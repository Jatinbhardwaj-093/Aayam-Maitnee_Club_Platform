import cv2
import mediapipe as mp
import numpy as np


class QualityService:

    def blur_score(self, image):

        img = cv2.imread(image)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        return cv2.Laplacian(gray, cv2.CV_64F).var()

    def brightness(self, image):

        img = cv2.imread(image)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        return float(np.mean(gray))


# class FaceDetector:

    # def __init__(self):

    #     self.detector = mp.solutions.face_detection.FaceDetection()

    # def detect(self, image):

    #     img = cv2.imread(image)

    #     rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    #     results = self.detector.process(rgb)

    #     return results.detections is not None

class FaceDetector:
    def __init__(self):
        self.detector = None

    def _get_detector(self):
        if self.detector is None:
            self.detector = mp.solutions.face_detection.FaceDetection(
                model_selection=0,
                min_detection_confidence=0.5
            )
        return self.detector

    def detect(self, image):
        img = cv2.imread(image)

        if img is None:
            raise ValueError(f"Could not read image: {image}")

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        detector = self._get_detector()
        results = detector.process(rgb)

        return results.detections is not None
