@echo off
REM Start HRMS Backend and Frontend

echo Starting HRMS Backend and Frontend...
echo.

REM Start Backend in a new terminal
echo Launching Backend...
start cmd /k "cd /d D:\HRMS_Project && (Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (& .\venv\Scripts\Activate.ps1) ; python -m uvicorn backend.main:backend --reload --host 127.0.0.1 --port 8000"

REM Wait a bit for backend to start
timeout /t 2 /nobreak

REM Start Frontend in a new terminal
echo Launching Frontend...
start cmd /k "cd /d D:\HRMS_Project\frontend && npm install && npm run dev"

echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo API Docs: http://127.0.0.1:8000/docs
echo.
pause
