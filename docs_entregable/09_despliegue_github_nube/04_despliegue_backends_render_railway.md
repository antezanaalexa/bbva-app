# Despliegue de Backends en Render / Railway — BBVA Perú Simulado

Este documento explica cómo configurar y desplegar los dos backends FastAPI en plataformas de contenedores como **Render** o **Railway**.

---

## 1. Configuración de `bbva-backend` (API Homebanking)

### En Render:
1. Cree un nuevo **Web Service**.
2. Conecte su repositorio de GitHub.
3. Configure los siguientes campos:
   - **Name**: `bbva-backend-simulado`
   - **Environment**: `Python`
   - **Root Directory**: `bbva-backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Presione **Advanced** y agregue las variables de entorno detalladas en el documento `02_variables_entorno_produccion.md`.
5. Presione **Create Web Service**.

### En Railway:
1. Cree un **New Project** y seleccione **Deploy from GitHub repo**.
2. Elija su repositorio.
3. En la configuración del servicio:
   - Defina el **Root Directory** como `bbva-backend`.
   - Railway detectará automáticamente el archivo `requirements.txt`.
   - Modifique el **Start Command** a: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. En la pestaña **Variables**, agregue las variables correspondientes.

---

## 2. Configuración de `core-backend` (API Core Bancario)

### En Render:
1. Cree un nuevo **Web Service**.
2. Conecte su repositorio.
3. Configure los siguientes campos:
   - **Name**: `core-backend-simulado`
   - **Environment**: `Python`
   - **Root Directory**: `core-backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Agregue las variables de entorno.
5. Presione **Create Web Service**.

### En Railway:
1. Agregue un nuevo servicio desde el repositorio GitHub.
2. Configure:
   - **Root Directory**: `core-backend`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Agregue las variables de entorno correspondientes.

---

## 3. Manejo del Puerto Dinámico `$PORT`

> [!IMPORTANT]
> Render y Railway asignan dinámicamente un puerto libre a la variable de entorno `$PORT` para que el contenedor escuche las peticiones externas.

Tanto `bbva-backend` como `core-backend` están configurados para iniciarse mediante Uvicorn con la bandera `--port $PORT`. Uvicorn tomará automáticamente el valor numérico inyectado por la plataforma en tiempo de ejecución. 

No hardcodee puertos como `8000` o `8001` en el comando de inicio en la nube; de lo contrario, el despliegue fallará por problemas de enlace de puerto.

---

## 4. Verificación del Despliegue de los Backends

Una vez desplegados los servicios, puede validar que están activos y accesibles realizando una petición GET HTTP simple a su ruta raíz:

- **Para Homebanking Backend**: `[URL_BACKEND_HOMEBANKING]/`
  - Respuesta esperada (JSON):
    ```json
    {"message": "BBVA Perú API funcionando correctamente"}
    ```

- **Para Core Backend**: `[URL_BACKEND_CORE]/`
  - Respuesta esperada (JSON):
    ```json
    {"sistema": "Core Financiero BBVA", "version": "1.0.0", "status": "ok"}
    ```
