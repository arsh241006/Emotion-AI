from tensorflow.keras.models import load_model

MODEL_PATH = "../saved_models/emotion_model_v2.keras"

model = load_model(MODEL_PATH)