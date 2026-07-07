import cv2
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model

# Load trained model
model = load_model("../saved_models/emotion_model.keras")

# Emotion labels
emotion_labels = [
    'angry',
    'disgust',
    'fear',
    'happy',
    'neutral',
    'sad',
    'surprise'
]

# Load OpenCV face detector
face_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

# Image path
image_path = "../test_images/angry.jpg"

# Read image
img = cv2.imread(image_path)

if img is None:
    print("Image not found!")
    exit()

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect faces
faces = face_detector.detectMultiScale(
    gray,
    scaleFactor=1.3,
    minNeighbors=5
)

print("Faces found:", len(faces))

# Predict emotion for each face
for (x, y, w, h) in faces:

    # Crop face
    face = gray[y:y+h, x:x+w]

    # Resize to model input size
    face = cv2.resize(face, (48, 48))

    # Normalize
    face = face / 255.0

    # Add batch and channel dimensions
    face = np.expand_dims(face, axis=0)
    face = np.expand_dims(face, axis=-1)

    # Predict
    prediction = model.predict(face, verbose=0)

    predicted_class = np.argmax(prediction)

    emotion = emotion_labels[predicted_class]

    confidence = np.max(prediction) * 100

    print(f"Emotion: {emotion}")
    print(f"Confidence: {confidence:.2f}%")

    # Draw rectangle
    cv2.rectangle(
        img,
        (x, y),
        (x + w, y + h),
        (0, 255, 0),
        2
    )

    # Draw label
    cv2.putText(
        img,
        f"{emotion} ({confidence:.1f}%)",
        (x, y - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 0),
        2
    )

# Display result
plt.figure(figsize=(8, 6))
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.axis("off")
plt.show()