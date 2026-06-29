# Despliegue de Frontends en Vercel — BBVA Perú Simulado

Este documento explica cómo configurar y desplegar los dos frontends React + Vite (Homebanking y Core Bancario) en **Vercel**.

---

## 1. Configuración de `bbva-fronted` (Frontend Homebanking)

1. Inicie sesión en [Vercel](https://vercel.com/) y presione **Add New** > **Project**.
2. Conecte e importe su repositorio de GitHub.
3. En la pantalla de configuración del proyecto:
   - **Project Name**: `bbva-fronted-simulado`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `bbva-fronted` (Presione Edit y seleccione esta carpeta).
   - **Build and Output Settings**:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
4. En **Environment Variables**, agregue la siguiente variable:
   - `VITE_API_URL` = `[URL_BACKEND_HOMEBANKING]`
5. Presione **Deploy**.

---

## 2. Configuración de `core-fronted` (Frontend Core)

1. En Vercel, presione **Add New** > **Project**.
2. Seleccione el mismo repositorio de GitHub.
3. Configure el proyecto:
   - **Project Name**: `core-fronted-simulado`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `core-fronted`
   - **Build and Output Settings**:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
4. En **Environment Variables**, agregue las siguientes variables:
   - `VITE_BASE_URL` = `[URL_BACKEND_CORE]`
   - `VITE_API_URL` = `[URL_BACKEND_CORE]`
5. Presione **Deploy**.

---

## 3. Manejo de Rutas en React Router (Evitar Error 404 en Recarga)

En aplicaciones Single Page Application (SPA) con React Router, recargar la página en una ruta interna (ej: `/dashboard` o `/cuentas`) causará que Vercel intente buscar el archivo HTML correspondiente a esa ruta física y devuelva un error **404 Not Found**.

Para evitar esto, se recomienda configurar redirecciones en Vercel agregando un archivo `vercel.json` en la raíz de cada frontend:

### Archivo `vercel.json` (aplicable para `bbva-fronted` y `core-fronted`):
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

> [!TIP]
> Estos archivos se pueden crear directamente en el código local de ambos directorios para que, al subir los cambios a GitHub, Vercel los reconozca automáticamente y habilite el enrutamiento SPA correcto.
