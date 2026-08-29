@echo off
echo ===================================================
echo Starting GenCanvas AI (Backend Server + Frontend)
echo ===================================================
echo.

start "GenCanvas Server" cmd /k "cd server && npm start"
timeout /t 2 /nobreak >nul
start "GenCanvas Client" cmd /k "cd client && npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8080
echo.
pause
