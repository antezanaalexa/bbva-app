@echo off
echo Iniciando Homebanking Backend (Puerto 8000)...
start "BBVA Homebanking Backend" cmd /c "cd c:\Proyectos\BBVA\bbva-backend && uvicorn main:app --reload --port 8000"

echo Iniciando Core Backend (Puerto 8001)...
start "BBVA Core Backend" cmd /c "cd c:\Proyectos\BBVA\core-backend && uvicorn main:app --reload --port 8001"

echo Iniciando Homebanking Frontend (Puerto 5173)...
start "BBVA Homebanking Frontend" cmd /c "cd c:\Proyectos\BBVA\bbva-fronted && npm run dev"

echo Iniciando Core Frontend (Puerto 5174)...
start "BBVA Core Frontend" cmd /c "cd c:\Proyectos\BBVA\core-fronted && npm run dev"

echo Todos los servicios han sido iniciados en ventanas separadas.
