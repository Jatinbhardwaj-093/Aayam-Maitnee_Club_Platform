from ai.utils import extract_audio, extract_frames
import os

video = "uploads/videos/test.mp4"

os.makedirs("uploads/audio", exist_ok=True)
os.makedirs("uploads/frames", exist_ok=True)

print("Extracting audio...")
extract_audio(
    video,
    "uploads/audio/audio.wav"
)

print("Extracting frames...")
extract_frames(
    video,
    "uploads/frames"
)

print("Extraction completed!")