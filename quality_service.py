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


class FaceDetector:

    def __init__(self):

        self.detector = mp.solutions.face_detection.FaceDetection()

    def detect(self, image):

        img = cv2.imread(image)

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        results = self.detector.process(rgb)

        return results.detections is not None