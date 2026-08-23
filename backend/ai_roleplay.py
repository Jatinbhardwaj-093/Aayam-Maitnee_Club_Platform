import asyncio
import base64
import json
import logging
import re
import time
import uuid
from difflib import SequenceMatcher

try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False

logger = logging.getLogger(__name__)

REHEARSAL_IDLE = "IDLE"
REHEARSAL_LOADING = "LOADING"
REHEARSAL_HUMAN_TURN = "HUMAN_TURN"
REHEARSAL_PROCESSING_HUMAN_AUDIO = "PROCESSING_HUMAN_AUDIO"
REHEARSAL_AI_TURN = "AI_TURN"
REHEARSAL_GENERATING_AI_RESPONSE = "GENERATING_AI_RESPONSE"
REHEARSAL_PLAYING_AI_AUDIO = "PLAYING_AI_AUDIO"
REHEARSAL_SCENE_COMPLETE = "SCENE_COMPLETE"


class ScriptParser:
    def parse(self, script):
        content = (script.content or "").strip()
        turns = []
        characters = []

        if content.startswith("{"):
            try:
                parsed = json.loads(content)
                characters = self._characters_from_json(parsed.get("characters", []))
                turns = self._turns_from_json(parsed.get("lines", []), script.title)
            except Exception:
                turns = []

        if not turns:
            source = content or script.excerpt or ""
            turns = self._turns_from_text(source, script.title)

        if not characters:
            names = []
            for turn in turns:
                if turn["type"] == "dialogue" and turn["character"] not in names:
                    names.append(turn["character"])
            characters = [{"id": f"character_{idx + 1}", "name": name, "description": "", "voice": "default"} for idx, name in enumerate(names)]

        playable_turns = [turn for turn in turns if turn["type"] == "dialogue"]
        if not playable_turns:
            raise ValueError("No playable dialogue lines found. Use lines like 'John: Hello Mary.'")

        return {
            "scene_id": f"script_{script.id}_scene_1",
            "script_id": script.id,
            "title": script.title,
            "characters": characters,
            "turns": turns,
        }

    def _characters_from_json(self, characters):
        result = []
        for idx, character in enumerate(characters):
            name = character.get("name")
            if not name:
                continue
            result.append({
                "id": str(character.get("id") or f"character_{idx + 1}"),
                "name": name,
                "description": character.get("traits") or character.get("description") or "",
                "voice": character.get("voice") or "default",
                "color": character.get("color") or "#635f41",
            })
        return result

    def _turns_from_json(self, lines, title):
        turns = []
        for idx, line in enumerate(lines):
            text = (line.get("text") or "").strip()
            character = line.get("characterName") or line.get("character") or line.get("speaker")
            if not text:
                continue
            turn_type = "stage_direction" if self._is_stage_direction(text) or line.get("characterId") == "stage-note" else "dialogue"
            turns.append(self._make_turn(idx, character or "Stage Direction", text, turn_type, title))
        return turns

    def _turns_from_text(self, text, title):
        turns = []
        lines = text.splitlines()
        current_speaker = None

        for raw_line in lines:
            line = raw_line.strip()
            if not line:
                continue
            if self._is_stage_direction(line):
                turns.append(self._make_turn(len(turns), "Stage Direction", line, "stage_direction", title))
                continue
            
            # Check for inline speaker e.g. "SUTRADHAR: Hello"
            match = re.match(r"^([A-Za-z][A-Za-z0-9 ._'/-]{0,48})\s*:\s*(.+)$", line)
            if match:
                turns.append(self._make_turn(len(turns), match.group(1).strip(), match.group(2).strip(), "dialogue", title))
                current_speaker = match.group(1).strip()
                continue
                
            # Check for standalone speaker e.g. "SUTRADHAR:"
            speaker_only = re.match(r"^([A-Za-z][A-Za-z0-9 ._'/-]{0,48})\s*:$", line)
            if speaker_only:
                current_speaker = speaker_only.group(1).strip()
                continue
                
            # If we have an active speaker, this is their dialogue
            if current_speaker:
                turns.append(self._make_turn(len(turns), current_speaker, line, "dialogue", title))
                
        if not turns and text.strip():
            turns.append(self._make_turn(0, "Lead Character", text.strip(), "dialogue", title))
        return turns

    def _make_turn(self, idx, character, text, turn_type, title):
        words = split_words(text)
        return {
            "id": f"turn_{idx + 1:03d}",
            "speaker": character,
            "character": character,
            "text": text,
            "type": turn_type,
            "order": idx + 1,
            "scene": title,
            "words": words,
        }

    def _is_stage_direction(self, text):
        stripped = text.strip()
        return (stripped.startswith("[") and stripped.endswith("]")) or (stripped.startswith("(") and stripped.endswith(")"))


class STTProvider:
    def transcribe_stream(self, audio_stream):
        raise NotImplementedError


class BrowserTranscriptProvider(STTProvider):
    def transcribe_stream(self, audio_stream):
        return audio_stream


class LLMProvider:
    def generate_dialogue(self, context):
        raise NotImplementedError


class ScriptedDialogueProvider(LLMProvider):
    def generate_dialogue(self, context):
        return context["turn"]["text"]


class TTSProvider:
    def synthesize(self, text, voice="default", performance=None):
        raise NotImplementedError


class BrowserTTSProvider(TTSProvider):
    def synthesize(self, text, voice="default", performance=None):
        words = split_words(text)
        timings = []
        cursor = 0.08
        pace = (performance or {}).get("pace", "moderate")
        pace_multiplier = {"slow": 1.18, "moderate": 1.0, "brisk": 0.86}.get(pace, 1.0)
        for word in words:
            duration = max(0.18, min(0.58, len(normalize_word(word)) * 0.055 + 0.14)) * pace_multiplier
            timings.append({"word": word, "start": round(cursor, 2), "end": round(cursor + duration, 2)})
            cursor += duration + (0.06 * pace_multiplier)
        return {
            "text": text,
            "audio_url": None,
            "voice": voice,
            "words": timings,
            "duration": round(cursor, 2),
            "provider": "browser-speech-synthesis",
            "performance": performance,
        }


class EdgeTTSProvider(TTSProvider):
    def __init__(self):
        self.fallback = BrowserTTSProvider()

    async def _generate_async(self, text, voice="en-US-AriaNeural", rate="+0%", pitch="+0Hz"):
        communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        audio_data = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data.extend(chunk["data"])
        return bytes(audio_data)

    def synthesize(self, text, voice="female", performance=None):
        voice_key = (voice or "female").lower()
        if "female" in voice_key:
            chosen_voice = "en-US-AriaNeural"
            chosen_pitch = "+0Hz"
            chosen_rate = "-3%"
        elif "male" in voice_key:
            chosen_voice = "en-US-GuyNeural"
            chosen_pitch = "-2Hz"
            chosen_rate = "-4%"
        else:
            chosen_voice = "en-US-AriaNeural"
            chosen_pitch = "+0Hz"
            chosen_rate = "-3%"

        words = split_words(text)
        timings = []
        cursor = 0.08
        pace = (performance or {}).get("pace", "moderate")
        pace_multiplier = {"slow": 1.18, "moderate": 1.0, "brisk": 0.86}.get(pace, 1.0)
        for word in words:
            duration = max(0.18, min(0.58, len(normalize_word(word)) * 0.055 + 0.14)) * pace_multiplier
            timings.append({"word": word, "start": round(cursor, 2), "end": round(cursor + duration, 2)})
            cursor += duration + (0.06 * pace_multiplier)

        audio_b64 = None
        if HAS_EDGE_TTS:
            try:
                raw_audio = asyncio.run(self._generate_async(text, chosen_voice, chosen_rate, chosen_pitch))
                if raw_audio:
                    audio_b64 = f"data:audio/mp3;base64,{base64.b64encode(raw_audio).decode('utf-8')}"
            except Exception as exc:
                logger.warning("edge-tts audio generation failed, using fallback: %s", exc)

        return {
            "text": text,
            "audio_url": audio_b64,
            "voice": voice,
            "voice_preference": voice,
            "neural_voice": chosen_voice,
            "words": timings,
            "duration": round(cursor, 2),
            "provider": "edge-tts" if audio_b64 else "browser-speech-synthesis",
            "performance": performance,
        }


def split_words(text):
    return re.findall(r"[\w']+|[^\s\w]", text, flags=re.UNICODE)


def normalize_word(word):
    return re.sub(r"[^a-z0-9']", "", word.lower())


def normalize_tokens(text):
    return [token for token in (normalize_word(word) for word in split_words(text)) if token]


def match_spoken_words(expected_words, transcript, start_index=0):
    expected = [normalize_word(word) for word in expected_words]
    spoken = normalize_tokens(transcript)
    matched = set()
    cursor = max(0, start_index)

    for spoken_word in spoken:
        best_index = None
        best_score = 0
        search_end = min(len(expected), cursor + 6)
        for idx in range(cursor, search_end):
            if not expected[idx]:
                continue
            score = SequenceMatcher(None, expected[idx], spoken_word).ratio()
            if expected[idx] == spoken_word:
                score = 1
            if score > best_score:
                best_score = score
                best_index = idx
        if best_index is not None and best_score >= 0.65:
            matched.add(best_index)
            cursor = best_index + 1

    spoken_count = len(matched)
    expected_count = len([word for word in expected if word])
    progress = spoken_count / expected_count if expected_count else 1
    is_complete = progress >= 0.65 or (expected_count <= 2 and spoken_count >= 1)
    return {
        "matched_indices": sorted(matched),
        "current_word_index": max(matched) if matched else max(0, start_index - 1),
        "progress": round(progress, 3),
        "is_complete": is_complete,
    }


class RehearsalService:
    def __init__(self, performance_provider=None):
        self.parser = ScriptParser()
        self.stt = BrowserTranscriptProvider()
        self.llm = ScriptedDialogueProvider()
        self.performance_provider = performance_provider
        self.tts = EdgeTTSProvider() if HAS_EDGE_TTS else BrowserTTSProvider()
        self.sessions = {}

    def parse_script(self, script):
        return self.parser.parse(script)

    def start_session(self, script, assignments):
        return self.start_session_with_options(script, assignments)

    def start_session_with_options(self, script, assignments, voice_preferences=None):
        scene = self.parser.parse(script)
        if not any(turn["type"] == "dialogue" for turn in scene["turns"]):
            raise ValueError("No playable dialogue lines found.")
        normalized_assignments = self._normalize_assignments(scene["characters"], assignments)
        normalized_voices = self._normalize_voice_preferences(scene["characters"], voice_preferences)
        session_id = str(uuid.uuid4())
        session = {
            "session_id": session_id,
            "scene": scene,
            "assignments": normalized_assignments,
            "voice_preferences": normalized_voices,
            "current_turn": 0,
            "status": REHEARSAL_IDLE,
            "scene_status": "in_progress",
            "current_word_index": -1,
            "human_progress": {},
            "history": [],
            "events": [],
            "transcript_request_counts": {},
            "gemini_call_counts": {},
            "last_human_turn_id": None,
        }
        self.sessions[session_id] = session
        self._advance_to_next_playable_turn(session)
        self._record_event(session, "rehearsal_started")
        return self.public_state(session)

    def submit_human_transcript(self, session_id, transcript, is_final=False, silence_ms=0):
        session = self._get_session(session_id)
        turn = self.current_turn(session)
        if not turn:
            return self.public_state(session)
        if self._speaker_type(session, turn) != "human":
            self._record_event(session, "ignored_human_transcript", {
                "turn_id": turn["id"],
                "speaker": turn["character"],
                "status": session["status"],
            })
            logger.info(
                "Ignored human transcript for non-human turn: session=%s turn=%s speaker=%s status=%s",
                session_id,
                turn["id"],
                turn["character"],
                session["status"],
            )
            return self.public_state(session)
        session["status"] = REHEARSAL_PROCESSING_HUMAN_AUDIO
        session["transcript_request_counts"][turn["id"]] = session["transcript_request_counts"].get(turn["id"], 0) + 1
        logger.info(
            "[REHEARSAL][TRANSCRIPT] session=%s turn=%s count=%s final=%s",
            session_id,
            turn["id"],
            session["transcript_request_counts"][turn["id"]],
            is_final,
        )
        match = match_spoken_words(turn["words"], self.stt.transcribe_stream(transcript), 0)
        session["human_progress"][turn["id"]] = match
        session["current_word_index"] = match["current_word_index"]
        session["last_human_turn_id"] = turn["id"]
        logger.info(
            "Human transcript processed: session=%s turn=%s final=%s transcript=%r matched_word_index=%s progress=%s",
            session_id,
            turn["id"],
            is_final,
            transcript,
            match["current_word_index"],
            match["progress"],
        )
        self._record_event(session, "human_transcription_final" if is_final else "human_transcription_partial", {
            "turn_id": turn["id"],
            "transcript": transcript,
            "match": match,
        })
        enough_silence = int(silence_ms or 0) >= 200 or match["is_complete"]
        if (is_final and (match["is_complete"] or enough_silence)) or (match["is_complete"] and len(match["matched_indices"]) >= len(turn.get("words", []))):
            self._record_event(session, "human_turn_completed", {"turn_id": turn["id"]})
            logger.info("[REHEARSAL] human turn complete: session=%s turn=%s", session_id, turn["id"])
            self.advance(session_id)
        else:
            session["status"] = REHEARSAL_HUMAN_TURN
        return self.public_state(session)

    def prepare_ai_turn(self, session_id):
        session = self._get_session(session_id)
        turn = self.current_turn(session)
        if not turn:
            return self.public_state(session)
        logger.info(
            "[AI REHEARSAL] AI turn started: session=%s character=%s turn=%s",
            session_id,
            turn["character"],
            turn["id"],
        )
        session["status"] = REHEARSAL_GENERATING_AI_RESPONSE
        previous = session["scene"]["turns"][:session["current_turn"]]
        session["gemini_call_counts"][turn["id"]] = session["gemini_call_counts"].get(turn["id"], 0) + 1
        logger.info(
            "[REHEARSAL][GEMINI] session=%s turn=%s count=%s",
            session_id,
            turn["id"],
            session["gemini_call_counts"][turn["id"]],
        )
        # Fast-path for scripted rehearsals: use scripted dialogue directly without blocking on remote LLM roundtrip
        text = turn.get("text", "")
        if not text:
            text = self.llm.generate_dialogue({
                "turn": turn,
                "previous_dialogue": previous[-4:],
                "scene": session["scene"],
                "assignments": session["assignments"],
            })
        performance = self._analyze_performance(session, turn, previous)
        voice_preference = session.get("voice_preferences", {}).get(turn["character"], "default")
        logger.info("[TTS] start")
        logger.info('[REHEARSAL][TTS] exact script="%s"', text)
        tts_payload = self.tts.synthesize(text, voice_preference, performance)
        session["status"] = REHEARSAL_PLAYING_AI_AUDIO
        session["ai_payload"] = {"turn_id": turn["id"], **tts_payload}
        session["current_word_index"] = -1
        self._record_event(session, "ai_audio_ready", session["ai_payload"])
        logger.info(
            "AI audio ready: session=%s turn=%s speaker=%s word_count=%s",
            session_id,
            turn["id"],
            turn["character"],
            len(tts_payload.get("words", [])),
        )
        return self.public_state(session)

    def complete_ai_turn(self, session_id):
        session = self._get_session(session_id)
        turn = self.current_turn(session)
        self._record_event(session, "ai_turn_completed", {"turn_id": turn["id"] if turn else None})
        logger.info(
            "[AI REHEARSAL] AI turn completed: session=%s character=%s turn=%s",
            session_id,
            turn["character"] if turn else None,
            turn["id"] if turn else None,
        )
        self.advance(session_id)
        return self.public_state(session)

    def advance(self, session_id):
        session = self._get_session(session_id)
        session["current_turn"] += 1
        self._advance_to_next_playable_turn(session)
        return self.public_state(session)

    def stop(self, session_id):
        session = self._get_session(session_id)
        session["status"] = REHEARSAL_IDLE
        session["scene_status"] = "stopped"
        session["current_word_index"] = -1
        self._record_event(session, "rehearsal_stopped")
        return self.public_state(session)

    def public_state(self, session):
        turn = self.current_turn(session)
        speaker_type = self._speaker_type(session, turn) if turn else None
        return {
            "session_id": session["session_id"],
            "scene": session["scene"],
            "assignments": session["assignments"],
            "current_turn": session["current_turn"],
            "currentTurnIndex": session["current_turn"],
            "current_speaker": turn["character"] if turn else None,
            "speaker": turn["character"] if turn else None,
            "speaker_type": speaker_type,
            "speakerType": speaker_type,
            "status": session["status"],
            "rehearsalStatus": session["status"],
            "scene_status": session["scene_status"],
            "currentTurn": turn,
            "currentWordIndex": session.get("current_word_index", -1),
            "human_progress": session["human_progress"],
            "voice_preferences": session.get("voice_preferences", {}),
            "transcript_request_counts": session.get("transcript_request_counts", {}),
            "gemini_call_counts": session.get("gemini_call_counts", {}),
            "last_human_turn_id": session.get("last_human_turn_id"),
            "ai_payload": session.get("ai_payload"),
            "events": session["events"][-20:],
        }

    def current_turn(self, session):
        turns = session["scene"]["turns"]
        if session["current_turn"] >= len(turns):
            return None
        return turns[session["current_turn"]]

    def _advance_to_next_playable_turn(self, session):
        turns = session["scene"]["turns"]
        while session["current_turn"] < len(turns) and turns[session["current_turn"]]["type"] != "dialogue":
            self._record_event(session, "stage_direction", {"turn": turns[session["current_turn"]]})
            session["current_turn"] += 1
        if session["current_turn"] >= len(turns):
            session["status"] = REHEARSAL_SCENE_COMPLETE
            session["scene_status"] = "complete"
            session["current_word_index"] = -1
            self._record_event(session, "scene_completed")
            logger.info("Scene complete: session=%s", session["session_id"])
            return
        turn = turns[session["current_turn"]]
        session["ai_payload"] = None
        session["current_word_index"] = -1
        session["status"] = REHEARSAL_HUMAN_TURN if self._speaker_type(session, turn) == "human" else REHEARSAL_AI_TURN
        self._record_event(session, "turn_started", {
            "turn_id": turn["id"],
            "speaker": turn["character"],
            "speaker_type": self._speaker_type(session, turn),
        })
        logger.info(
            "Turn started: session=%s turn=%s speaker=%s speaker_type=%s",
            session["session_id"],
            turn["id"],
            turn["character"],
            self._speaker_type(session, turn),
        )

    def _speaker_type(self, session, turn):
        if not turn:
            return None
        return session["assignments"].get(turn["character"], "ai")

    def _normalize_assignments(self, characters, assignments):
        provided = assignments or {}
        result = {}
        for idx, character in enumerate(characters):
            value = provided.get(character["name"], "human" if idx == 0 else "ai")
            result[character["name"]] = "human" if value == "human" else "ai"
        return result

    def _normalize_voice_preferences(self, characters, voice_preferences):
        provided = voice_preferences or {}
        result = {}
        for idx, character in enumerate(characters):
            raw_value = provided.get(character["name"])
            if raw_value not in {"male", "female"}:
                raw_value = "male" if idx == 0 else "female"
            result[character["name"]] = raw_value
        return result

    def _analyze_performance(self, session, turn, previous):
        if not self.performance_provider:
            return {
                "emotion": "neutral",
                "tone": "natural",
                "pace": "moderate",
                "intensity": 0.5,
                "provider": "default",
                "available": False,
            }
        character = next(
            (item for item in session["scene"]["characters"] if item["name"] == turn["character"]),
            {},
        )
        stage_direction = self._nearest_stage_direction(previous)
        try:
            return self.performance_provider.analyze_delivery(
                character=turn["character"],
                personality=character.get("description", ""),
                scene_context=session["scene"].get("title", ""),
                previous_dialogue=previous[-4:],
                scripted_dialogue=turn["text"],
                stage_direction=stage_direction,
            )
        except Exception as exc:
            logger.warning("[REHEARSAL][GEMINI] provider failed; using default performance metadata: %s", exc)
            return {
                "emotion": "neutral",
                "tone": "natural",
                "pace": "moderate",
                "intensity": 0.5,
                "provider": "default",
                "available": False,
                "error": "gemini_unavailable",
            }

    def _nearest_stage_direction(self, previous):
        for turn in reversed(previous):
            if turn.get("type") == "stage_direction":
                return turn.get("text", "")
        return ""

    def _get_session(self, session_id):
        if session_id not in self.sessions:
            raise KeyError("Rehearsal session not found")
        return self.sessions[session_id]

    def _record_event(self, session, event, payload=None):
        session["events"].append({
            "event": event,
            "timestamp": round(time.time(), 3),
            **(payload or {}),
        })
