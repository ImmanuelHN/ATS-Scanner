from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from src.pipeline import analyze_resume

app = FastAPI()   # ✅ FIRST CREATE APP

# ✅ THEN ADD MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "temp")

@app.post("/analyze-resume")
async def analyze_resume_api(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_resume(file_path, job_description)

    return result

@app.get("/")
def home():
    return {"message": "ATS AI Backend Running 🚀"}