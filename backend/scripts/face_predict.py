import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))



from utils.preprocess import detect_faces, preprocess_face
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load trained model
model = load_model("../saved_models/emotion_model_v2.keras")

emotion_labels = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise"
]

# Image path
image_path = "../test_images/angry.jpg"

# Read image
img = cv2.imread(image_path)

if img is None:
    print("Image not found!")
    exit()

# Detect faces
gray, faces = detect_faces(img)

print("Faces found:", len(faces))

# Predict emotion
for (x, y, w, h) in faces:

    face = preprocess_face(gray, x, y, w, h)

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

    # Draw prediction
    cv2.putText(
        img,
        f"{emotion} ({confidence:.1f}%)",
        (x, y - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 0),
        2
    )

# Show result
plt.figure(figsize=(8, 6))
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.axis("off")
plt.show()
