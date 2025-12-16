from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
import shutil, os
from audio_model.infer_audio import predict_audio

app = FastAPI(title="TrustLens API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/analyze/audio")
async def analyze_audio(file: UploadFile = File(...)):
    os.makedirs("tmp", exist_ok=True)
    temp_path = f"tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    score = predict_audio(temp_path)
    return {
        "deception_probability": round(score * 100, 2),
        "explanation": "Higher pitch variation and pauses increased deception likelihood."
    }