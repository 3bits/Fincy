@echo off
REM run-all.bat - Start backend and frontend in separate command windows
REM Run this from the project root: run-all.bat

SET ROOT=%~dp0

START "FinanceTracker Backend" cmd /k "cd /d "%ROOT%Backend" && mvn spring-boot:run"
START "FinanceTracker Frontend" cmd /k "cd /d "%ROOT%Frontend" && npm install && npm run dev"

echo Started backend and frontend windows.