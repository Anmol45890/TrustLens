from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from audio_model.extract_features import extract_features

X = []
y = []

project_root = Path(__file__).resolve().parents[1]
for label, folder in [(0, "truth"), (1, "lie")]:
    folder_path = project_root / "datasets" / "audio" / folder
    for file in sorted(folder_path.glob("*.wav")):
        if file.is_file():
            features = extract_features(str(file))
            X.append(features)
            y.append(label)

if not X or len(set(y)) != 2:
    raise ValueError("Training requires WAV files in both datasets/audio/truth and datasets/audio/lie.")

X = np.array(X)
y = np.array(y)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

model_path = project_root / "audio_model" / "models" / "audio_rf.joblib"
model_path.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, model_path)
print(f"Audio model trained successfully and saved to {model_path}")
