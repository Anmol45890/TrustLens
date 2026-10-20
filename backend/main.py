import os
import shutil
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

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
    temp_dir = Path(__file__).resolve().parents[1] / "tmp"
    temp_dir.mkdir(exist_ok=True)
    suffix = Path(file.filename or "").suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir=temp_dir) as temp_file:
        temp_path = temp_file.name
        shutil.copyfileobj(file.file, temp_file)

    try:
        score = predict_audio(temp_path)
    finally:
        os.unlink(temp_path)

    return {
        "deception_probability": round(score * 100, 2),
        "explanation": "Higher pitch variation and pauses increased deception likelihood."
    }