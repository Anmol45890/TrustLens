import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from extract_features import extract_features

X = []
y = []

for label, folder in [(0, "truth"), (1, "lie")]:
    folder_path = f"datasets/audio/{folder}"
    for file in os.listdir(folder_path):
        if file.endswith(".wav"):
            features = extract_features(os.path.join(folder_path, file))
            X.append(features)
            y.append(label)

X = np.array(X)
y = np.array(y)

model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

print("Audio model trained successfully!")
