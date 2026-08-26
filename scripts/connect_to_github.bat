@echo off
echo ======================================================
echo SnapNow GitHub Connection Script
echo ======================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please download and install Git from: https://git-scm.com/
    echo.
    pause
    exit /b
)

echo [1/6] Initializing Git repository...
git init

echo [2/6] Adding all files...
git add .

echo [3/6] Creating initial commit...
git commit -m "Initial commit of SnapNow project"

echo [4/6] Setting branch to main...
git branch -M main

echo [5/6] Adding remote origin...
git remote add origin https://github.com/itdepartmentarcglobal-lgtm/snapnow.git

echo [6/6] Pushing to GitHub...
echo (You may be asked to log in to GitHub in a popup window)
git push -u origin main

echo.
echo ======================================================
echo Process complete! Check your GitHub repository.
echo ======================================================
pause
