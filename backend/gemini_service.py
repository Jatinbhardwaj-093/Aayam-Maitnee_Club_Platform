import json
import logging
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request


logger = logging.getLogger(__name__)


class GeminiPerformanceProvider:
    def __init__(self, model_name=None, api_key=None, api_base=None, timeout_seconds=6.0):
        self.model_name = model_name or os.getenv("COMPLETIONS_MODEL", "gemini/gemini-3.6-flash")
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.api_base = api_base or os.getenv("COMPLETIONS_API_BASE", "http://localhost:4000/v1")
        self.timeout_seconds = timeout_seconds

    def analyze_delivery(
        self,
        character,
        personality,
        scene_context,
        previous_dialogue,
        scripted_dialogue,
        stage_direction="",
    ):
        fallback = self.default_instructions()
        if not self.api_key:
            logger.warning("[REHEARSAL][GEMINI] unavailable; using default performance metadata")
            return {**fallback, "provider": "default", "available": False}

        logger.info("[REHEARSAL][GEMINI] analyzing %s", character)
        logger.info("[GEMINI] start")
        started_at = time.perf_counter()
        prompt = self._build_prompt(
            character,
            personality,
            scene_context,
            previous_dialogue,
            scripted_dialogue,
            stage_direction,
        )
        provider_name = "gemini-developer-api"
        developer_model = self._developer_model_name()
        logger.info(
            "[GEMINI] provider=%s model=%s api_key_present=%s",
            provider_name,
            developer_model,
            bool(self.api_key),
        )

        try:
            content = self._generate_content(developer_model, prompt)
            parsed = self._parse_metadata_json(content)
            instructions = self._sanitize(parsed)
            logger.info(
                "[REHEARSAL][GEMINI] emotion=%s tone=%s pace=%s intensity=%s",
                instructions["emotion"],
                instructions["tone"],
                instructions["pace"],
                instructions["intensity"],
            )
            logger.info("[GEMINI] complete in %.2fs", time.perf_counter() - started_at)
            return instructions
        except Exception as exc:
            error_message = f"{type(exc).__name__}: {exc}"
            logger.warning("[REHEARSAL][GEMINI] failed; using default performance metadata: %s", error_message)
            logger.info("[GEMINI] complete fallback in %.2fs", time.perf_counter() - started_at)
            return {**fallback, "provider": "default", "available": False, "error": error_message}

    def default_instructions(self):
        return {
            "emotion": "neutral",
            "tone": "natural",
            "pace": "moderate",
            "intensity": 0.5,
            "provider": "gemini-developer-api",
            "available": True,
        }

    def _developer_model_name(self):
        model = (self.model_name or "").strip()
        if model.startswith("gemini/"):
            model = model.split("/", 1)[1]
        if model.startswith("models/"):
            model = model.split("/", 1)[1]
        return model

    def _generate_content(self, model, prompt):
        query = urllib.parse.urlencode({"key": self.api_key})
        model_path = urllib.parse.quote(model, safe="")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_path}:generateContent?{query}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
                "responseSchema": {
                    "type": "OBJECT",
                    "properties": {
                        "emotion": {"type": "STRING"},
                        "tone": {"type": "STRING"},
                        "pace": {"type": "STRING", "enum": ["slow", "moderate", "brisk"]},
                        "intensity": {"type": "NUMBER"},
                    },
                    "required": ["emotion", "tone", "pace", "intensity"],
                },
                "temperature": 0.2,
                "maxOutputTokens": 1024,
            },
        }
        data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout_seconds) as response:
                response_body = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:500]
            raise RuntimeError(f"Gemini Developer API HTTP {exc.code}: {detail}") from exc
        except urllib.error.URLError as exc:
            raise RuntimeError(f"Gemini Developer API connection error: {exc.reason}") from exc

        parsed = json.loads(response_body)
        candidates = parsed.get("candidates") or []
        if not candidates:
            prompt_feedback = parsed.get("promptFeedback") or parsed
            raise RuntimeError(f"Gemini Developer API returned no candidates: {prompt_feedback}")

        parts = candidates[0].get("content", {}).get("parts") or []
        text = "".join(part.get("text", "") for part in parts).strip()
        if not text:
            raise RuntimeError("Gemini Developer API returned an empty text response")
        return text

    def _parse_metadata_json(self, content):
        cleaned = (content or "").strip()
        candidates = [cleaned]
        candidates.extend(
            match.group(1).strip()
            for match in re.finditer(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, flags=re.IGNORECASE)
        )

        last_error = None
        for candidate in candidates:
            parsed, error = self._try_parse_metadata(candidate)
            if parsed is not None:
                return parsed
            last_error = error or last_error

        snippet = cleaned[:160].replace("\n", " ")
        raise ValueError(f"Gemini returned malformed metadata JSON: {last_error}; response_snippet={snippet!r}")

    def _try_parse_metadata(self, text):
        decoder = json.JSONDecoder()
        attempts = [text.strip()]
        attempts.extend(text[index:].strip() for index, char in enumerate(text) if char == "{")

        last_error = None
        for attempt in attempts:
            if not attempt:
                continue
            try:
                parsed, _ = decoder.raw_decode(attempt)
                parsed = self._normalize_metadata_object(parsed)
                if parsed is not None:
                    return parsed, None
            except json.JSONDecodeError as exc:
                last_error = exc
        return None, last_error

    def _normalize_metadata_object(self, parsed):
        if isinstance(parsed, str):
            nested, _ = self._try_parse_metadata(parsed)
            return nested
        if not isinstance(parsed, dict):
            return None
        for key in ("metadata", "performance", "delivery", "tts"):
            nested = parsed.get(key)
            if isinstance(nested, dict):
                parsed = nested
                break
        if not any(key in parsed for key in ("emotion", "tone", "pace", "intensity")):
            return None
        return parsed

    def _build_prompt(self, character, personality, scene_context, previous_dialogue, scripted_dialogue, stage_direction):
        previous_text = "\n".join(
            f"{turn.get('character', 'Unknown')}: \"{turn.get('text', '')}\""
            for turn in previous_dialogue
            if turn.get("type") == "dialogue"
        ) or "None"
        stage_text = stage_direction or "None"
        return (
            "Return compact JSON performance metadata for TTS. Do not write or modify dialogue.\n"
            'Use exactly these keys: "emotion", "tone", "pace", "intensity".\n'
            f"Character: {character}\n"
            f"Personality: {personality or 'Not specified.'}\n"
            f"Scene: {scene_context or 'Not specified.'}\n"
            f"Previous dialogue:\n{previous_text}\n"
            f"Stage direction: {stage_text}\n"
            f"Exact scripted dialogue, must not change: \"{scripted_dialogue}\"\n"
            'JSON only, under 30 words: {"emotion":"neutral","tone":"natural","pace":"slow|moderate|brisk","intensity":0.5}'
        )

    def _sanitize(self, parsed):
        emotion = str(parsed.get("emotion") or "neutral")[:40]
        tone = str(parsed.get("tone") or "natural")[:60]
        pace = str(parsed.get("pace") or "moderate").lower()
        if pace not in {"slow", "moderate", "brisk"}:
            pace = "moderate"
        try:
            intensity = float(parsed.get("intensity", 0.5))
        except (TypeError, ValueError):
            intensity = 0.5
        intensity = max(0.0, min(1.0, intensity))
        return {
            "emotion": emotion,
            "tone": tone,
            "pace": pace,
            "intensity": intensity,
            "provider": "gemini-developer-api",
            "available": True,
        }
