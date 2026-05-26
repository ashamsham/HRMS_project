# HRMS Backend and Frontend Startup Script
# PowerShell script to start both services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HRMS - Backend & Frontend Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "http://127.0.0.1:8000"
$frontendUrl = "http://localhost:5173"
$docsUrl = "http://127.0.0.1:8000/docs"

Write-Host "Starting HRMS services..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "1. Launching Backend on $backendUrl" -ForegroundColor Yellow
$backendDir = "D:\HRMS_Project"
$backendCommand = {
    Set-Location $backendDir
    & .\venv\Scripts\Activate.ps1
    python -m uvicorn backend.main:backend --reload --host 127.0.0.1 --port 8000
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $backendDir; & .\venv\Scripts\Activate.ps1; python -m uvicorn backend.main:backend --reload --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "2. Launching Frontend on $frontendUrl" -ForegroundColor Yellow
$frontendDir = "D:\HRMS_Project\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $frontendDir; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:   $backendUrl" -ForegroundColor Green
Write-Host "Frontend:  $frontendUrl" -ForegroundColor Green
Write-Host "API Docs:  $docsUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Default Credentials (if available):" -ForegroundColor Yellow
Write-Host "Email: admin@example.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
