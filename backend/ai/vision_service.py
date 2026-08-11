from PIL import Image
from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL


class VisionService:

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = GEMINI_MODEL

    def analyze(self, image_path):
        image = Image.open(image_path)
        prompt = """
You are an audition screening assistant.

Evaluate:
1. Lighting
2. Face visibility
3. Camera framing
4. Background distractions

Return concise feedback.
"""
        response = self.client.models.generate_content(
            model=self.model,
            contents=[image, prompt]
        )
        return response.text