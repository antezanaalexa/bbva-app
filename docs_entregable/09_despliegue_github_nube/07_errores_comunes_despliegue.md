# Errores Comunes en el Despliegue y Soluciones — BBVA Perú Simulado

Este documento recopila los problemas técnicos más frecuentes que pueden surgir durante el proceso de despliegue en la nube y cómo solucionarlos rápidamente.

---

## 1. Problema: Bloqueo por CORS (`Origin ... is not allowed`)

* **Síntoma**: El frontend en Vercel carga correctamente, pero el inicio de sesión o la carga de datos fallan. En la consola del desarrollador (F12) se observa un error similar a:
  `Access to fetch at '...' from origin '...' has been blocked by CORS policy`.
* **Causa**: La variable `CORS_ALLOWED_ORIGINS` en el backend respectivo de Render/Railway no incluye la URL exacta del frontend desplegado en Vercel, o contiene una barra diagonal `/` al final de la URL.
* **Solución**:
  1. Copie la URL exacta del frontend desde el panel de Vercel (ej: `https://bbva-fronted-simulado.vercel.app`).
  2. Ingrese a la configuración de variables de entorno de su servicio en Render/Railway.
  3. Modifique `CORS_ALLOWED_ORIGINS` agregando la URL separada por comas (sin espacios ni barras finales).
  4. Reinicie el servicio de backend para aplicar los cambios.

---

## 2. Problema: Error de Conexión a Neon (`SSL connection required`)

* **Síntoma**: El backend se cae al iniciarse o da error 500 al intentar conectar a la base de datos, mostrando logs de `FATAL: connection requires a secure (SSL) connection`.
* **Causa**: Neon requiere de forma obligatoria conexiones encriptadas mediante SSL.
* **Solución**:
  - Asegúrese de que la variable `DATABASE_URL` contenga el parámetro `?sslmode=require` al final.
  - Ejemplo: `postgresql://neondb_owner:[PASSWORD]@[HOST]/neondb?sslmode=require`

---

## 3. Problema: El Backend no Inicia o se Cae Constantemente en Render/Railway

* **Síntoma**: Los logs del despliegue en Render muestran: `Port 8000 was not bound within 10 minutes, shutting down`.
* **Causa**: Se configuró el comando de inicio apuntando a un puerto fijo (ej: `--port 8000`), pero Render o Railway inyectan un puerto dinámico mediante la variable de entorno `$PORT`.
* **Solución**:
  - Asegúrese de que el comando de inicio en Render o Railway sea exactamente:
    `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
  - Esto obliga a Uvicorn a leer el puerto asignado dinámicamente.

---

## 4. Problema: Error 404 al Recargar la Página en Vercel

* **Síntoma**: El frontend funciona bien cuando se hace clic para navegar, pero si el usuario presiona F5 (recargar) en `/dashboard` o `/cuentas`, el navegador devuelve un error de Vercel: `404: NOT_FOUND`.
* **Causa**: Vercel asume que la ruta `/dashboard` es un archivo físico y no redirige el tráfico a la aplicación React SPA.
* **Solución**:
  - Agregue un archivo `vercel.json` en la raíz de su frontend (`bbva-fronted/` y `core-fronted/`) con el siguiente contenido:
    ```json
    {
      "rewrites": [
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```
  - Suba el archivo a GitHub. Vercel redesplegará la aplicación y resolverá el problema.

---

## 5. Problema: Fallas en la Construcción del Frontend en Vercel

* **Síntoma**: Vercel cancela el despliegue del frontend con errores en el build.
* **Causa**: Advertencias de ESLint tratadas como errores fatales, dependencias faltantes en `package.json` o errores de capitalización en nombres de archivos importados.
* **Solución**:
  - Verifique que las importaciones de componentes tengan la misma capitalización que los archivos físicos (Postgres y Windows son insensibles a mayúsculas/minúsculas, pero el sistema de archivos de Vercel/Linux es sensible).
  - Si ESLint interrumpe el despliegue por advertencias no críticas, puede desactivarlo temporalmente modificando la configuración de Vite o agregando `/* eslint-disable */` en los archivos problemáticos para permitir el build inicial.
