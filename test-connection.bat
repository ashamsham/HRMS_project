@echo off
REM Test Backend and Frontend Connection

echo.
echo ==========================================
echo HRMS Connection Test
echo ==========================================
echo.

REM Test Backend
echo Testing Backend Connection...
timeout /t 1 /nobreak > nul
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✓ Backend is running' -ForegroundColor Green } } catch { Write-Host '✗ Backend connection failed' -ForegroundColor Red; Write-Host '  Make sure backend is running on http://127.0.0.1:8000' -ForegroundColor Yellow }"

echo.

REM Test Frontend
echo Testing Frontend Connection...
timeout /t 1 /nobreak > nul
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173/' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✓ Frontend is running' -ForegroundColor Green } } catch { Write-Host '✗ Frontend connection failed' -ForegroundColor Red; Write-Host '  Make sure frontend is running on http://localhost:5173' -ForegroundColor Yellow }"

echo.

REM Test API Docs
echo Testing API Documentation...
timeout /t 1 /nobreak > nul
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/docs' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✓ API Documentation available' -ForegroundColor Green } } catch { Write-Host '✗ API Documentation not available' -ForegroundColor Red }"

echo.
echo ==========================================
echo Test Complete!
echo ==========================================
echo.
echo Backend URL:  http://127.0.0.1:8000
echo Frontend URL: http://localhost:5173
echo API Docs:     http://127.0.0.1:8000/docs
echo.

pause
