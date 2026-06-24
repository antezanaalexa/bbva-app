# 03. Levantamiento del Core Bancario — BBVA Perú Simulado

El Core Bancario es el sistema administrativo donde los asesores y jefes evalúan, aprueban créditos y revisan la mora.

## Levantar el Backend (FastAPI)

1. Abrir la terminal y navegar a la carpeta del backend administrativo:
   ```bash
   cd core-backend
   ```
2. (Opcional si es primera vez) Crear y activar el entorno virtual, e instalar dependencias:
   ```bash
   python -m venv venv
   source venv/Scripts/activate
   pip install -r requirements.txt
   ```
3. Iniciar el servidor:
   ```bash
   ./venv/Scripts/uvicorn main:app --reload --port 8001
   ```
   > El servidor estará disponible en: **http://localhost:8001**

## Levantar el Frontend (React + Vite)

1. Abrir una NUEVA terminal y navegar a la carpeta del frontend administrativo:
   ```bash
   cd core-fronted
   ```
2. (Opcional si es primera vez) Instalar las dependencias de Node:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   > La aplicación web administrativa estará disponible en: **http://localhost:5174**

---
> [!TIP]
> **Ejecución Automatizada**
> Existe un archivo `start_all.bat` en la raíz del proyecto. Si haces doble clic sobre él, abrirá las cuatro terminales automáticamente e iniciará todos los servicios a la vez.
