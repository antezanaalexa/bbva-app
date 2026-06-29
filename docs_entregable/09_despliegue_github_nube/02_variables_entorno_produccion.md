# Variables de Entorno en Producción — BBVA Perú Simulado

Este documento contiene la matriz completa de variables de entorno requeridas para el funcionamiento de los cuatro módulos del sistema y la base de datos en producción.

> [!WARNING]
> No exponga estas variables en archivos `.env` subidos a repositorios públicos de GitHub. Configure estas variables directamente en los paneles de control de Render, Railway y Vercel.

---

## 1. Módulo: `bbva-backend` (API Homebanking)
Plataforma sugerida: **Render / Railway**

| Variable | Valor de Ejemplo / Formato | Propósito / Origen |
|---|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:[PASSWORD]@[HOST]/neondb?sslmode=require` | Cadena de conexión provista por Neon. Debe incluir `sslmode=require`. |
| `SECRET_KEY` | `5e883e218b0e8c4740840e447b85e352ef223a637d8e8b0b5cf83d2e67df14ba` | Clave secreta para firmar tokens JWT. Genere una cadena hexadecimal segura. |
| `ALGORITHM` | `HS256` | Algoritmo de cifrado para JWT. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `120` | Tiempo de vida del token de sesión en minutos (ej: 120 min). |
| `CORS_ALLOWED_ORIGINS` | `[URL_FRONTEND_HOMEBANKING],[URL_FRONTEND_CORE]` | URLs de producción de Vercel separadas por comas (sin `/` al final). |

---

## 2. Módulo: `core-backend` (API Core Bancario)
Plataforma sugerida: **Render / Railway**

| Variable | Valor de Ejemplo / Formato | Propósito / Origen |
|---|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:[PASSWORD]@[HOST]/neondb?sslmode=require` | Cadena de conexión provista por Neon. |
| `SECRET_KEY` | `8c4740840e447b85e352ef223a637d8e8b0b5cf83d2e67df14ba5e883e218b0e` | Clave secreta para firmar tokens JWT en el Core. |
| `ALGORITHM` | `HS256` | Algoritmo de cifrado para JWT. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Tiempo de vida del token de sesión del Core (ej: 60 min). |
| `PORTAL_BACKEND_URL` | `[URL_BACKEND_HOMEBANKING]` | URL base pública del API Homebanking para validación cruzada. |
| `CORS_ALLOWED_ORIGINS` | `[URL_FRONTEND_CORE],[URL_FRONTEND_HOMEBANKING]` | URLs de producción de Vercel separadas por comas (sin `/` al final). |

---

## 3. Módulo: `bbva-fronted` (Frontend Homebanking)
Plataforma sugerida: **Vercel**

| Variable | Valor de Ejemplo / Formato | Propósito / Origen |
|---|---|---|
| `VITE_API_URL` | `[URL_BACKEND_HOMEBANKING]` | URL base pública del backend FastAPI de Homebanking. |

---

## 4. Módulo: `core-fronted` (Frontend Core)
Plataforma sugerida: **Vercel**

| Variable | Valor de Ejemplo / Formato | Propósito / Origen |
|---|---|---|
| `VITE_BASE_URL` | `[URL_BACKEND_CORE]` | URL base pública del backend FastAPI del Core. |
| `VITE_API_URL` | `[URL_BACKEND_CORE]` | Duplicado por compatibilidad de llamadas. |

---

## 5. Instrucciones de Generación de `SECRET_KEY`
Para generar claves secretas seguras en producción, ejecute el siguiente comando en su terminal local:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
Copie el resultado y configúrelo como valor para `SECRET_KEY` en sus backends.
