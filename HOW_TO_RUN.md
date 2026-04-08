# ATS AI — Setup & Deployment Guide

---

## What Is ATS AI?

ATS AI is a full-stack resume scoring platform with:
- **Backend**: Python (FastAPI) — NLP-powered resume analysis using sentence-transformers
- **Frontend**: React — Premium dark UI with real-time score visualization

---

## Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.9+ | https://python.org |
| Node.js | 16+ | https://nodejs.org |
| npm | comes with Node | — |

---

## LOCAL DEVELOPMENT (Two Terminals)

### Step 1 — Install Python dependencies

Open **Terminal 1** inside the project root (`ats-ui-clean/`):

```bash
pip install -r ../requirements.txt
```

> First install downloads `sentence-transformers` and `spacy` models — this can take 2–5 minutes.

### Step 2 — Start the Backend

Still in **Terminal 1**:

```bash
uvicorn src.api:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3 — Install Frontend dependencies

Open **Terminal 2** inside `ats-ui-clean/`:

```bash
npm install
```

### Step 4 — Start the Frontend

Still in **Terminal 2**:

```bash
npm start
```

The app opens at → **http://localhost:3000**

---

## ONE-COMMAND STARTUP (optional)

Create a `start.sh` in `ats-ui-clean/`:

```bash
#!/bin/bash
echo "Starting ATS AI..."
uvicorn src.api:app --reload &
BACKEND_PID=$!
npm start
kill $BACKEND_PID
```

Then run: `chmod +x start.sh && ./start.sh`

---

## DEPLOYING TO GITHUB (Make it Public/Online)

### Option A — Frontend on GitHub Pages (Free, Static)

> Note: GitHub Pages hosts only the static React frontend. The Python backend must be hosted separately (see Option B).

**Step 1 — Push your code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ats-ai.git
git push -u origin main
```

**Step 2 — Install gh-pages**

```bash
npm install --save-dev gh-pages
```

**Step 3 — Update package.json**

Add these two lines:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/ats-ai",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    ...
  }
}
```

**Step 4 — Update the API URL**

In `src/App.js`, change the fetch URL from:
```js
"http://127.0.0.1:8000/analyze-resume"
```
to your deployed backend URL (see Option B below).

**Step 5 — Deploy**

```bash
npm run deploy
```

Your frontend is live at: `https://YOUR_USERNAME.github.io/ats-ai`

---

### Option B — Backend on Render (Free Tier)

Render hosts your FastAPI backend for free.

**Step 1 — Create `render.yaml`** in your project root:

```yaml
services:
  - type: web
    name: ats-ai-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn src.api:app --host 0.0.0.0 --port $PORT
    rootDir: ats-ui-clean
```

**Step 2 — Push to GitHub** (if not done already)

**Step 3 — Go to https://render.com**
1. Sign up / log in with GitHub
2. Click "New Web Service"
3. Connect your GitHub repo
4. Set Root Directory to `ats-ui-clean`
5. Set Start Command: `uvicorn src.api:app --host 0.0.0.0 --port $PORT`
6. Click Deploy

**Step 4 — Copy your Render URL** (e.g. `https://ats-ai-backend.onrender.com`)

**Step 5 — Update App.js** with the Render URL:

```js
const res = await fetch("https://ats-ai-backend.onrender.com/analyze-resume", {
```

---

### Option C — Full Stack on Railway (Easiest, Recommended)

Railway.app can host both frontend and backend together.

**Step 1 — Create `railway.json`** in root:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn src.api:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/"
  }
}
```

**Step 2 — Go to https://railway.app**
1. Sign in with GitHub
2. New Project → Deploy from GitHub Repo
3. Select your repository
4. Railway auto-detects Python + Node
5. Set env variable: `PORT=8000`

Your full app runs at the Railway-provided URL.

---

## ENVIRONMENT VARIABLES (Production)

For production, set these env vars instead of hardcoding:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

Then in `App.js`:
```js
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const res = await fetch(`${API_URL}/analyze-resume`, { ... });
```

---

## FOLDER STRUCTURE

```
ats-ui-clean/
├── public/
│   ├── index.html          ← App title & favicon
│   ├── favicon.svg         ← Custom ATS AI icon
│   └── manifest.json
├── src/
│   ├── App.js              ← Main React UI
│   ├── App.css             ← All styles (Orbitron font, dark theme)
│   ├── index.js
│   ├── api.py              ← FastAPI backend
│   ├── pipeline.py         ← Main analysis pipeline
│   ├── parser.py           ← PDF text extraction
│   ├── embedder.py         ← Sentence embeddings
│   ├── similarity.py       ← Cosine similarity
│   ├── skill_extractor.py  ← Skill detection
│   ├── scorer.py           ← Score calculation
│   ├── explainer.py        ← Verdict generation
│   └── skills.py           ← Skills dictionary
├── package.json
└── requirements.txt (in parent folder)
```

---

## TROUBLESHOOTING

| Problem | Fix |
|--------|-----|
| `CORS error` in browser | Make sure backend is running on port 8000 |
| `Cannot find module` | Run `npm install` in ats-ui-clean/ |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| Backend slow on first run | Sentence-transformer model loads once — wait 30s |
| Port 3000 already in use | Run `npm start` and say yes to use another port |
| Port 8000 already in use | `lsof -ti:8000 \| xargs kill` then restart |

---

## QUICK REFERENCE

```bash
# Backend
uvicorn src.api:app --reload

# Frontend
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

*ATS AI — Built with FastAPI + React + Sentence Transformers*
