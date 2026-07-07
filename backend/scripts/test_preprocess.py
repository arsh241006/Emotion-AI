import sys
import os

# Add backend folder to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import cv2
from utils.preprocess import detect_faces, preprocess_face

img = cv2.imread("../test_images/happy.jpg")

if img is None:
    print("Image not found!")
    exit()

gray, faces = detect_faces(img)

print("Faces detected:", len(faces))

if len(faces) > 0:
    x, y, w, h = faces[0]

    face = preprocess_face(gray, x, y, w, h)

    print("Shape:", face.shape)