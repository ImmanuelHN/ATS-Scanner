# 🚂 Railway Deployment — Step by Step

This guide walks you through deploying ATS AI (FastAPI backend + React frontend)
fully online using GitHub + Railway.app — completely free.

---

## OVERVIEW OF THE PLAN

```
Your Computer  →  GitHub (code storage)  →  Railway (runs your app online)
```

Railway reads your code from GitHub and runs both the backend and frontend for you.
You get a public URL like: `https://ats-ai.up.railway.app`

---

## PART 1 — PUSH YOUR CODE TO GITHUB

### Step 1 — Create a GitHub account (if you don't have one)
Go to https://github.com and sign up. It's free.

---

### Step 2 — Create a new repository on GitHub

1. Click the **"+"** icon (top right) → **"New repository"**
2. Repository name: `ats-ai` (or anything you like)
3. Set to **Public** (Railway free tier works with public repos)
4. ❌ Do NOT tick "Add README" — leave everything unchecked
5. Click **"Create repository"**

GitHub will show you a page with setup commands. Keep this tab open.

---

### Step 3 — Prepare your project folder

Open your terminal inside the `ats-ui-clean/` folder:

```bash
cd path/to/ats-ui-clean
```

Check if git is already initialized:
```bash
git status
```

If you see `fatal: not a git repository`, initialize it:
```bash
git init
```

If git was already initialized (you had a `.git` folder), that's fine — continue.

---

### Step 4 — Create a `.gitignore` file

In the `ats-ui-clean/` folder, create a file called `.gitignore` with this content:

```
node_modules/
build/
__pycache__/
*.pyc
.env
temp/
*.pdf
```

This stops large/unnecessary files from being uploaded to GitHub.

---

### Step 5 — Stage and commit all your files

```bash
git add .
git commit -m "Initial ATS AI deployment"
```

---

### Step 6 — Connect to GitHub and push

Copy the commands GitHub showed you on the repository page. They look like this:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ats-ai.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

When prompted, enter your GitHub username and password.
> If password doesn't work, use a **Personal Access Token** instead:
> GitHub → Settings → Developer Settings → Personal Access Tokens → Generate New Token → tick "repo" → use that as your password.

✅ After this, refresh your GitHub repo page — you should see all your files there.

---

## PART 2 — ADD RAILWAY CONFIG FILES

Before deploying, you need to tell Railway how to run your app.
Add these files inside your `ats-ui-clean/` folder:

---

### File 1 — `Procfile` (tells Railway what command to run)

Create a file called exactly `Procfile` (no extension) with this content:

```
web: uvicorn src.api:app --host 0.0.0.0 --port $PORT
```

---

### File 2 — `runtime.txt` (tells Railway which Python version)

Create a file called `runtime.txt`:

```
python-3.10.0
```

---

### File 3 — Move `requirements.txt` inside `ats-ui-clean/`

Railway looks for `requirements.txt` in the root of the project.
Copy or move your `requirements.txt` into the `ats-ui-clean/` folder if it isn't there already.

Your `requirements.txt` should contain:
```
pymupdf
spacy
scikit-learn
sentence-transformers
rapidfuzz
fastapi
uvicorn
python-multipart
```

---

### Step 7 — Commit and push the new config files

```bash
git add .
git commit -m "Add Railway deployment config"
git push
```

✅ Now your GitHub repo has everything Railway needs.

---

## PART 3 — DEPLOY ON RAILWAY

### Step 8 — Sign up on Railway

1. Go to https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

---

### Step 9 — Create a new project

1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Find and select your `ats-ai` repository
4. Click **"Deploy Now"**

Railway will start building your project automatically.

---

### Step 10 — Watch the build logs

Click on your project → click the service → click **"Deploy Logs"** tab.

You'll see it installing Python packages. The first build takes 3–5 minutes
because `sentence-transformers` is large.

If you see errors, common fixes:
- `ModuleNotFoundError` → check that `requirements.txt` is in the right folder
- Port errors → make sure `Procfile` says `--port $PORT` (not a hardcoded number)

---

### Step 11 — Get your public URL

1. Once deployment is green ✅, click **"Settings"** tab of your service
2. Scroll to **"Networking"** → click **"Generate Domain"**
3. Railway gives you a URL like: `https://ats-ai-production.up.railway.app`

Test it by visiting: `https://your-railway-url.up.railway.app/`
You should see: `{"message": "ATS AI Backend Running 🚀"}`

---

## PART 4 — CONNECT YOUR REACT FRONTEND TO RAILWAY

Your React frontend still runs locally (`npm start`). To point it to the Railway backend:

### Step 12 — Update the API URL in App.js

Open `src/App.js`, find this line:
```js
const res = await fetch("http://127.0.0.1:8000/analyze-resume", {
```

Change it to:
```js
const res = await fetch("https://YOUR-RAILWAY-URL.up.railway.app/analyze-resume", {
```

Replace `YOUR-RAILWAY-URL` with your actual Railway domain.

---

### Step 13 — Also deploy the React frontend (optional but recommended)

You can host the React frontend on **Vercel** (free, instant):

1. Go to https://vercel.com → Sign in with GitHub
2. Click **"New Project"** → Import your `ats-ai` GitHub repo
3. Set **Root Directory** to `ats-ui-clean`
4. Set **Framework Preset** to `Create React App`
5. Add an **Environment Variable**:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-railway-url.up.railway.app`
6. Click **Deploy**

Then update `App.js` to use the env variable:
```js
const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const res = await fetch(`${API_BASE}/analyze-resume`, {
```

Vercel gives you a URL like: `https://ats-ai.vercel.app` — fully online! 🎉

---

## QUICK SUMMARY CHECKLIST

```
✅ Step 1  — Create GitHub account
✅ Step 2  — Create new GitHub repo
✅ Step 3  — Open terminal in ats-ui-clean/
✅ Step 4  — Create .gitignore
✅ Step 5  — git add . && git commit -m "Initial"
✅ Step 6  — git remote add origin ... && git push
✅ Step 7  — Create Procfile, runtime.txt, check requirements.txt → git push
✅ Step 8  — Sign up Railway with GitHub
✅ Step 9  — New Project → Deploy from GitHub repo
✅ Step 10 — Watch build logs
✅ Step 11 — Generate domain, test the URL
✅ Step 12 — Update API URL in App.js
✅ Step 13 — Deploy frontend on Vercel (optional)
```

---

## FUTURE UPDATES

Every time you make changes locally, just run:

```bash
git add .
git commit -m "describe your change"
git push
```

Railway automatically detects the new push and re-deploys. No manual steps needed.

---

*ATS AI — FastAPI Backend on Railway + React Frontend on Vercel*
