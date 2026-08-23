import os
import json
from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL

class GeminiPool:
    """
    Centralized Gemini API Client with automatic key rotation and quota exhaustion fallback.
    Supports GEMINI_API_KEYS (comma-separated) or GEMINI_API_KEY, GEMINI_API_KEY_2, GOOGLE_API_KEY, etc.
    """
    def __init__(self):
        self.model = GEMINI_MODEL or "gemini-3.6-flash"
        self._keys = self._load_keys()
        self._current_index = 0

    def _load_keys(self):
        keys = []
        
        # 1. Comma-separated list in GEMINI_API_KEYS
        raw_keys = os.getenv("GEMINI_API_KEYS", "")
        if raw_keys:
            for k in raw_keys.split(","):
                k_clean = k.strip()
                if k_clean and k_clean not in keys:
                    keys.append(k_clean)

        # 2. Numbered env vars: GEMINI_API_KEY, GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
        for env_var in ["GEMINI_API_KEY", "GEMINI_API_KEY_1", "GEMINI_API_KEY_2", "GEMINI_API_KEY_3", "GEMINI_API_KEY_4", "GOOGLE_API_KEY"]:
            val = os.getenv(env_var, "").strip()
            if val and val not in keys:
                keys.append(val)

        if not keys and GEMINI_API_KEY:
            keys.append(GEMINI_API_KEY.strip())

        return keys

    def add_key(self, key_str):
        k_clean = key_str.strip()
        if k_clean and k_clean not in self._keys:
            self._keys.append(k_clean)

    @property
    def key_count(self):
        return len(self._keys)

    def generate_content(self, prompt, model=None):
        """
        Executes generate_content with failover rotation across all keys in pool.
        """
        if not self._keys:
            raise RuntimeError("No Gemini API keys configured. Set GEMINI_API_KEY or GEMINI_API_KEYS in backend/.env")

        target_model = model or self.model
        attempts = len(self._keys)
        last_error = None

        for attempt in range(attempts):
            key_index = (self._current_index + attempt) % len(self._keys)
            api_key = self._keys[key_index]
            key_preview = f"{api_key[:6]}...{api_key[-4:]}" if len(api_key) > 10 else "***"

            try:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model=target_model,
                    contents=prompt
                )
                # Successful call: advance current index to load-balance
                self._current_index = (key_index + 1) % len(self._keys)
                return response.text.strip()
            except Exception as e:
                err_str = str(e)
                print(f"[GeminiPool] Key #{key_index + 1} ({key_preview}) error: {err_str}")
                last_error = e
                # Rotate immediately to the next key on 429, 403, quota, or network errors
                continue

        raise RuntimeError(f"All {attempts} Gemini API keys in pool failed. Last error: {last_error}")

    def generate_json(self, prompt, model=None):
        """
        Executes generate_content and parses cleanly formatted JSON output.
        """
        raw_text = self.generate_content(prompt, model=model)
        content = raw_text
        if content.startswith("```"):
            lines = content.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            content = "\n".join(lines).strip()
        return json.loads(content)


# Global singleton instance
gemini_pool = GeminiPool()
