from pathlib import Path
from tensorflow.keras.models import load_model

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR.parent / "saved_models" / "emotion_model_v2.keras"

model = load_model(MODEL_PATH)