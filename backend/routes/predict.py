import time
from flask import Blueprint, request, jsonify
import cv2
import numpy as np
import base64

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

    start_time = time.perf_counter()

    prediction = model.predict(face, verbose=0)[0]

    end_time = time.perf_counter()

    inference_time = (end_time - start_time) * 1000

    print(prediction)
    print(np.max(prediction))

    emotion = emotion_labels[np.argmax(prediction)]
    confidence = float(np.max(prediction) * 100)

    probabilities = {
        label: round(float(prob) * 100, 2)
        for label, prob in zip(emotion_labels, prediction)
    }

    return jsonify({
        "emotion": emotion,
        "confidence": round(confidence, 2),
        "probabilities": probabilities,
        "inference_time": round(inference_time, 2)
    })

@predict_bp.route("/predict-frame", methods=["POST"])
def predict_frame():

    data = request.get_json()

    if not data or "image" not in data:
        return jsonify({"error": "No image received"}), 400

    try:
        image_data = data["image"]

        # remove "data:image/jpeg;base64,..."
        encoded = image_data.split(",")[1]

        image_bytes = base64.b64decode(encoded)

        np_array = np.frombuffer(image_bytes, np.uint8)

        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    except Exception:
        return jsonify({"error": "Invalid image"}), 400

    gray, faces = detect_faces(img)

    if len(faces) == 0:
        return jsonify({
            "face_detected": False,
            "message": "No face detected"
        }), 200

    x, y, w, h = faces[0]

    face = preprocess_face(gray, x, y, w, h)

    start_time = time.perf_counter()

    prediction = model.predict(face, verbose=0)[0]

    end_time = time.perf_counter()

    inference_time = (end_time - start_time) * 1000

    emotion = emotion_labels[np.argmax(prediction)]

    confidence = float(np.max(prediction) * 100)

    probabilities = {
        label: round(float(prob) * 100, 2)
        for label, prob in zip(emotion_labels, prediction)
    }

    return jsonify({
        "face_detected": True,
        "emotion": emotion,
        "confidence": round(confidence, 2),
        "probabilities": probabilities,
        "inference_time": round(inference_time, 2),
        "box": {
        "x": int(x),
        "y": int(y),
        "w": int(w),
        "h": int(h)
    }
    })