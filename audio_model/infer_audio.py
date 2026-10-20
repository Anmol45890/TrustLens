from pathlib import Path

import joblib
from audio_model.extract_features import extract_features

model_path = Path(__file__).resolve().parent / "models" / "audio_rf.joblib"
model = joblib.load(model_path)

def predict_audio(file_path):
    features = extract_features(file_path).reshape(1, -1)
    return float(model.predict_proba(features)[0][1])