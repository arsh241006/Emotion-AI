from flask import Blueprint, request, jsonify
import cv2
import numpy as np

from utils.model_loader import model
from utils.preprocess import detect_faces, preprocess_face

predict_bp = Blueprint("predict", __name__)

emotion_labels = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise"
]


@predict_bp.route("/predict", methods=["POST"])
def predict():

    print(request.files)
    print(request.form)

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    # Read uploaded image
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    gray, faces = detect_faces(img)

    if len(faces) == 0:
        return jsonify({"error": "No face detected"}), 400

    x, y, w, h = faces[0]

    face = preprocess_face(gray, x, y, w, h)

    prediction = model.predict(face, verbose=0)

    emotion = emotion_labels[np.argmax(prediction)]
    confidence = float(np.max(prediction) * 100)

    return jsonify({
        "emotion": emotion,
        "confidence": round(confidence, 2)
    })
