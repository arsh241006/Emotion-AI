"""
Version 1:
Predicts emotion directly from the entire image.
Kept for comparison purposes.

For better results use face_predict.py,
which first detects and crops the face.
"""

import cv2
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model

# Load model
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

# Image path
image_path = "../test_images/happy.jpg"

# Read image
img = cv2.imread(image_path)

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Resize
gray = cv2.resize(gray, (48, 48))

# Normalize
gray = gray / 255.0

# Add dimensions
gray = np.expand_dims(gray, axis=0)
gray = np.expand_dims(gray, axis=-1)

# Predict
prediction = model.predict(gray)

predicted_class = np.argmax(prediction)
emotion = emotion_labels[predicted_class]
confidence = np.max(prediction) * 100

for i, e in enumerate(emotion_labels):
    print(f"{e}: {prediction[0][i]*100:.2f}%")
print(f"Confidence: {confidence:.2f}%")

# Display image
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.title(f"{emotion} ({confidence:.2f}%)")
plt.axis("off")
plt.show()