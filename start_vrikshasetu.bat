@echo off
title VrikshaSetu - Tree Survival Platform (Team Pandas Py)
color 0A

echo ====================================================================
echo             VRIKSHASETU: TREE SURVIVAL, NOT JUST PLANTATION
echo                  Hackathon 6.0 - Team Pandas Py
echo ====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking environment and backend database...
python backend\test_api.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend test failed. Please ensure Python dependencies are installed.
    pause
    exit /b 1
)

echo.
echo [2/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "VrikshaSetu Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo [3/3] Starting Vite Frontend on http://localhost:5173 ...
start "VrikshaSetu Frontend (Vite)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

timeout /t 3 /nobreak >nul
echo.
echo ====================================================================
echo   VrikshaSetu is running!
echo   Frontend : http://localhost:5173
echo   API Docs : http://127.0.0.1:8000/docs
echo ====================================================================
echo.
start http://localhost:5173

pause
