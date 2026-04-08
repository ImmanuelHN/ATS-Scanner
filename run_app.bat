@echo off
echo ==========================================
echo   Starting ATS AI - Full Stack 🚀
echo ==========================================

:: Start the Backend in a separate window
echo Starting Backend...
:: Added --port 8000 (or your preferred backend port) to avoid conflict
start cmd /k "cd backend && .venv\Scripts\activate && uvicorn src.api:app --reload --port 8000"

:: Start the Frontend in the current window
echo Starting Frontend...
cd frontend
:: Fix: Use 'set' instead of PowerShell syntax
#set PORT=3001
npm start
