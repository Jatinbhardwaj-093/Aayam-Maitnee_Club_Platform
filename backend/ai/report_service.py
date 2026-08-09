import requests

from config import OPENROUTER_API_KEY


class ReportService:

    def __init__(self):

        self.url = "https://openrouter.ai/api/v1/chat/completions"

        self.headers = {

            "Authorization": f"Bearer {OPENROUTER_API_KEY}",

            "Content-Type": "application/json",

            "HTTP-Referer": "http://localhost",

            "X-Title": "Aayam Drama Club"

        }

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
"overall_score":0-100,
"lighting":"",
"camera_quality":"",
"face_visibility":"",
"audio_quality":"",
"recommendation":"",
"feedback":""
}}

"""

        payload = {

            "model": "openai/gpt-oss-20b:free",

            "messages": [

                {

                    "role": "user",

                    "content": prompt

                }

            ]

        }

        response = requests.post(

            self.url,

            headers=self.headers,

            json=payload

        )

        response.raise_for_status()

        return response.json()["choices"][0]["message"]["content"]
        return json.loads(content)


















































































































        