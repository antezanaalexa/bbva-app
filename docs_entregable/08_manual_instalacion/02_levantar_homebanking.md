# 02. Levantamiento del Homebanking — BBVA Perú Simulado

El Homebanking es la plataforma donde el cliente final ingresa para visualizar sus cuentas, transacciones y solicitar créditos. Se compone de un frontend y un backend propios.

## Levantar el Backend (FastAPI)

1. Abrir la terminal y navegar a la carpeta del backend:
   ```bash
   cd bbva-backend
   ```
2. (Opcional si es primera vez) Crear y activar el entorno virtual, e instalar dependencias:
   ```bash
   python -m venv venv
   source venv/Scripts/activate
   pip install -r requirements.txt
   ```
3. Iniciar el servidor:
   ```bash
   ./venv/Scripts/uvicorn main:app --reload --port 8000
   ```
   > El servidor estará disponible en: **http://localhost:8000**

## Levantar el Frontend (React + Vite)

1. Abrir una NUEVA terminal y navegar a la carpeta del frontend:
   ```bash
   cd bbva-fronted
   ```
2. (Opcional si es primera vez) Instalar las dependencias de Node:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   > La aplicación web estará disponible en: **http://localhost:5173**
