from ai.whisper_service import WhisperService

whisper = WhisperService()

text = whisper.transcribe("uploads/audio/audio.wav")

print("\nTranscript:\n")
print(text)