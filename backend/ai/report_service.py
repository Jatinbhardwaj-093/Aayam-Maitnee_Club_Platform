import json
from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL


class ReportService:

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = GEMINI_MODEL

    def generate_report(
        self,
        transcript,
        blur,
        brightness,
        face_detected
    ):
        prompt = f"""
You are an AI audition screening assistant.

Below are the technical measurements of an audition recording.

Transcript:
{transcript}

Blur Score:
{blur}

Brightness:
{brightness}

Face Detected:
{face_detected}

Evaluate ONLY the technical quality.
Do NOT judge acting ability.

Return JSON in this format:
{{
  "overall_score": 85,
  "lighting": "good",
  "camera_quality": "clear",
  "face_visibility": "high",
  "audio_quality": "good",
  "recommendation": "accept",
  "feedback": "Technical setup is clear and well lit."
}}
"""
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        content = response.text.strip()
        if content.startswith("```"):
            lines = content.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            content = "\n".join(lines).strip()

        try:
            return json.loads(content)
        except Exception:
            return content