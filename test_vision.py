from ai.vision_service import VisionService

vision = VisionService()

result = vision.analyze("uploads/frames/frame_0.jpg")

print(result)