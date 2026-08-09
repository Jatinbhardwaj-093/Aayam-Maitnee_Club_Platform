from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


class WhisperService:

    def transcribe(self, audio_path):

        with open(audio_path, "rb") as audio_file:

            transcript = client.audio.transcriptions.create(

                file=audio_file,

                model="whisper-large-v3"
            )

        return transcript.text