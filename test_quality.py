from ai.quality_service import QualityService

quality = QualityService()

print("Blur:", quality.blur_score("uploads/frames/frame_1.jpg"))

print("Brightness:", quality.brightness("uploads/frames/frame_1.jpg"))