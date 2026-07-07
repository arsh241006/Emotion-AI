import cv2
import numpy as np

# Load OpenCV face detector
face_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)


def detect_faces(image):
    """
    Detect faces in an image.

    Returns:
        gray_image, faces
    """

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.3,
        minNeighbors=5
    )

    return gray, faces


def preprocess_face(gray, x, y, w, h):
    """
    Crop and preprocess a detected face for CNN prediction.
    """

    face = gray[y:y+h, x:x+w]

    face = cv2.resize(face, (48, 48))

    face = face.astype("float32") / 255.0

    face = np.expand_dims(face, axis=0)
    face = np.expand_dims(face, axis=-1)

    return face
