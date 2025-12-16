from extract_features import extract_features

features = extract_features("datasets/audio/truth/sample.wav")
print("Feature vector length:", len(features))
print(features)

