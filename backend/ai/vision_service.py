import base64
import requests

from config import OPENROUTER_API_KEY


class VisionService:

    def __init__(self):

        self.url = "https://openrouter.ai/api/v1/chat/completions"

        self.headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

    def analyze(self, image_path):

        with open(image_path, "rb") as img:
            image_base64 = base64.b64encode(img.read()).decode()

        payload = {

            "model": "qwen/qwen2.5-vl-72b-instruct:free",

            "messages": [

                {

                    "role": "user",

                    "content": [

                        {

                            "type": "text",

                            "text": """
You are an audition screening assistant.

Evaluate:

1. Lighting

2. Face visibility

3. Camera framing

4. Background distractions

Return concise feedback.
"""

                        },

                        {

                            "type": "image_url",

                            "image_url": {

                                "url": f"data:image/jpeg;base64,{image_base64}"

                            }

                        }

                    ]

                }

            ]

        }

        response = requests.post(
            self.url,
            headers=self.headers,
            json=payload
        )

        print("Status:", response.status_code)
        print("Response:", response.text)

        if response.status_code != 200:
            print(response.status_code)
            print(response.text)
            return response.json()

        return response.json()["choices"][0]["message"]["content"]

        