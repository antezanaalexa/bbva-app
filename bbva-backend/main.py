import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import cuentas, transacciones, ahorros, creditos, pagos, auth

app = FastAPI(
    title="BBVA Perú — API Banca por Internet",
    version="1.0.0",
    description="Backend del portal de Banca por Internet BBVA Perú"
)

allowed_origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [orig.strip() for orig in allowed_origins_str.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router,          prefix="/api/auth",          tags=["Auth"])
app.include_router(cuentas.router,       prefix="/api/cuentas",       tags=["Cuentas"])
app.include_router(transacciones.router, prefix="/api/transacciones", tags=["Transacciones"])
app.include_router(ahorros.router,       prefix="/api/ahorros",       tags=["Ahorros"])
app.include_router(creditos.router,      prefix="/api/creditos",      tags=["Créditos"])
app.include_router(pagos.router,         prefix="/api/pagos",         tags=["Pagos"])

@app.get("/")
def root():
    return {"message": "BBVA Perú API funcionando correctamente"}