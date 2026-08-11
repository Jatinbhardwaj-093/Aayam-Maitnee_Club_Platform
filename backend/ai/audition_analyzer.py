from ai.utils import extract_frames, extract_audio

from ai.whisper_service import WhisperService

# from ai.vision_service import VisionService

from ai.quality_service import QualityService, FaceDetector
from ai.report_service import ReportService

# whisper_service = WhisperService()

# vision_service = VisionService()

quality = QualityService()
detector = FaceDetector()

whisper_service = WhisperService()

report_service = ReportService()


class AuditionAnalyzer:

    def analyze(self, video):

        print("1. Extracting frames...")
        extract_frames(video, "uploads/frames")

        print("2. Extracting audio...")
        extract_audio(video, "uploads/audio/audio.mp3")

        print("3. Calling Whisper...")
        transcript = whisper_service.transcribe(
            "uploads/audio/audio.mp3"
        )

        print("4. Calling Vision...")
        # vision_feedback = vision_service.analyze(
        
        #     "uploads/frames/frame_0.jpg"
        # )
        report_service = ReportService()

        print("5. Blur...")
        blur = quality.blur_score(
            "uploads/frames/frame_0.jpg"
        )

        print("6. Brightness...")
        brightness = quality.brightness(
            "uploads/frames/frame_0.jpg"
        )

        print("7. Done!")
        face = detector.detect(
            "uploads/frames/frame_0.jpg"
        )
        

        ai_report = report_service.generate_report(
            transcript,
            blur,
            brightness,
            face
        )
        return {

            "transcript": transcript,

            "blur": blur,

            "brightness": brightness,

            "face_detected": face,

            "ai_report": ai_report

        }