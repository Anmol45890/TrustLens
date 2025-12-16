TrustLens — AI-Powered Voice Deception Detection System

TrustLens is an AI-driven voice analysis platform that predicts truth vs deception from human speech using audio signal processing + machine learning.

The system captures live microphone input or uploaded audio files, extracts behavioral voice features, and returns a deception probability score with explainable insights — all through a modern, futuristic web interface.

⚠️ Ethical Disclaimer:
TrustLens provides probabilistic insights only and must NOT be used for legal, forensic, or law-enforcement decisions.

🚀 Project Highlights

🎙 Live voice recording (browser-based)

📂 Audio file upload support

🧠 ML-based deception classification

📊 Explainable AI output

⚡ FastAPI backend

🌌 Next.js frontend with 3D visuals

🧪 Research-inspired, resume-grade project

🧠 System Architecture
User Voice / Audio File
        ↓
Browser (MediaRecorder API)
        ↓
Next.js Frontend (UI + Visualization)
        ↓
FastAPI Backend
        ↓
Audio Feature Extraction (MFCC, Pitch, Rate)
        ↓
ML Classifier (RandomForest)
        ↓
Deception Probability + Explanation

🛠 Tech Stack
Frontend

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS + shadcn/ui

Audio: MediaRecorder API

3D: Three.js

Icons: lucide-react

Backend

Framework: FastAPI

Language: Python 3.10

ML: scikit-learn (RandomForest)

Audio Processing: librosa, numpy

Server: Uvicorn

📁 Project Structure
TrustLens/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
│
├── audio_model/
│   ├── train_audio_model.py
│   ├── infer_audio.py
│   ├── extract_features.py
│   └── model.pkl
│
├── datasets/
│   └── audio/
│       ├── truth/
│       └── lie/
│
├── frontend/
│   ├── app/
│   │   └── page.tsx
│   ├── components/
│   ├── package.json
│   └── README.md
│
└── README.md   ← (this file)

▶️ How to Run the Project (Windows)
🔹 Step 1: Run Backend
1️⃣ Open Terminal 1
cd TrustLens
python -m venv venv
.\venv\Scripts\activate

2️⃣ Install backend dependencies
pip install -r backend/requirements.txt

3️⃣ Add Dataset

Place .wav files inside:

datasets/audio/truth/
datasets/audio/lie/

4️⃣ Train the Audio Model
python audio_model/train_audio_model.py

5️⃣ Start FastAPI Server
python -m uvicorn backend.main:app --reload


Backend will run at:

http://127.0.0.1:8000


API Endpoint:

POST /analyze/audio

🔹 Step 2: Run Frontend
1️⃣ Open Terminal 2 (NEW)
cd frontend
npm install

2️⃣ Start frontend
npm run dev


Frontend will run at:

http://localhost:3000


⚠️ Important: Backend must be running for microphone/audio analysis to work.

🔗 Backend API Contract
Endpoint
POST /analyze/audio

Request

multipart/form-data

Key: file

Value: .wav audio

Response
{
  "deception_probability": 70.5,
  "explanation": "Higher pitch variation and pauses increased deception likelihood."
}

📊 Deception Score Interpretation
Score Range	Meaning
0–33%	Truth Likely
34–66%	Inconclusive
67–100%	Deception Likely
⚠️ Ethical Use Disclaimer

TrustLens is built for:

Academic research

Learning & experimentation

AI/ML portfolio demonstration

❌ NOT intended for:

Legal investigations

Criminal profiling

Court evidence

Hiring or interrogation decisions

🧪 Current Limitations

Audio-only (no video/text yet)

Sensitive to heavy noise

Short clips may reduce accuracy

Model is probabilistic, not deterministic

🔮 Future Roadmap

🎥 Facial micro-expression analysis

📝 Speech-to-text deception cues

🔗 Multimodal fusion model

📈 Confidence timelines

🌍 Cloud deployment (Docker + AWS/GCP)

📌 Resume-Ready Description

Built TrustLens, an AI-powered voice deception detection system using signal processing and machine learning, featuring a real-time Next.js frontend and FastAPI backend with explainable AI outputs.

👨‍💻 Author

Ashish Sharma
AI / ML Engineer • Full-Stack Developer

🔗 LinkedIn
👉 https://www.linkedin.com/in/ashish-sharma-30a427291/

💻 GitHub
👉 https://github.com/ashishsharma909
