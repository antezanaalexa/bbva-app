# 04. Variables de Entorno (.env)

Para que el proyecto se comunique correctamente entre sus partes (frontends ↔ backends ↔ base de datos), se requieren archivos de configuración de entorno `.env` en cada subproyecto.

## Backend Core (`core-backend/.env`)

Este archivo contiene la conexión real a PostgreSQL y los secretos JWT.

```env
# Conexión a la BD
DATABASE_URL=postgresql://postgres:root@localhost:5432/bd_core_financiero

# Seguridad JWT
SECRET_KEY=9a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Puerto
PORT=8001
```

## Frontend Core (`core-fronted/.env`)

```env
VITE_API_URL=http://localhost:8001
```

## Backend Homebanking (`bbva-backend/.env`)

```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/bd_core_financiero
PORT=8000
```

## Frontend Homebanking (`bbva-fronted/.env`)

```env
VITE_API_URL=http://localhost:8000
```
