import joblib
from audio_model.extract_features import extract_features

model = joblib.load("audio_model/models/audio_rf.joblib")

def predict_audio(file_path):
    features = extract_features(file_path).reshape(1, -1)
    return float(model.predict_proba(features)[0][1])