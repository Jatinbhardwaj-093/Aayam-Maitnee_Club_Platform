import json
import logging
import os
import time

import litellm


logger = logging.getLogger(__name__)


class GeminiPerformanceProvider:
    def __init__(self, model_name=None, api_key=None, api_base=None, timeout_seconds=2.5):
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
        completion_kwargs = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "api_key": self.api_key,
            "response_format": {"type": "json_object"},
            "timeout": self.timeout_seconds,
        }
        if os.getenv("COMPLETIONS_API_BASE") or not self.model_name.startswith("gemini/"):
            completion_kwargs["api_base"] = self.api_base

        try:
            response = litellm.completion(**completion_kwargs)
            content = response.choices[0].message.content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            parsed = json.loads(content.strip())
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
            logger.warning("[REHEARSAL][GEMINI] failed; using default performance metadata: %s", exc)
            logger.info("[GEMINI] complete fallback in %.2fs", time.perf_counter() - started_at)
            return {**fallback, "provider": "default", "available": False, "error": "gemini_unavailable"}

    def default_instructions(self):
        return {
            "emotion": "neutral",
            "tone": "natural",
            "pace": "moderate",
            "intensity": 0.5,
            "provider": "gemini",
            "available": True,
        }

    def _build_prompt(self, character, personality, scene_context, previous_dialogue, scripted_dialogue, stage_direction):
        previous_text = "\n".join(
            f"{turn.get('character', 'Unknown')}: \"{turn.get('text', '')}\""
            for turn in previous_dialogue
            if turn.get("type") == "dialogue"
        ) or "None"
        stage_text = stage_direction or "None"
        return (
            "Return JSON performance metadata for TTS. Do not write or modify dialogue.\n"
            f"Character: {character}\n"
            f"Personality: {personality or 'Not specified.'}\n"
            f"Scene: {scene_context or 'Not specified.'}\n"
            f"Previous dialogue:\n{previous_text}\n"
            f"Stage direction: {stage_text}\n"
            f"Exact scripted dialogue, must not change: \"{scripted_dialogue}\"\n"
            'JSON only: {"emotion":"short label","tone":"short tone","pace":"slow|moderate|brisk","intensity":0.0}'
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
            "provider": "gemini",
            "available": True,
        }
