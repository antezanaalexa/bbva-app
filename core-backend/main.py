from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    rtr_scoring, rtr_creditos, rtr_ahorros,
    rtr_dashboard, rtr_clientes, rtr_auth, rtr_homebanking, rtr_recuperaciones, rtr_core_bbva
)
from app.core.cfg_config import settings

app = FastAPI(
    title="Core Financiero — BBVA",
    description="Motor de scoring, cartera crediticia y KPIs institucionales",
    version="1.0.0"
)

allowed_origins = [orig.strip() for orig in settings.CORS_ALLOWED_ORIGINS.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rtr_auth.router,      prefix="/auth",      tags=["Auth"])
app.include_router(rtr_scoring.router,   prefix="/scoring",   tags=["Scoring"])
app.include_router(rtr_creditos.router,  prefix="/creditos",  tags=["Créditos"])
app.include_router(rtr_ahorros.router,   prefix="/ahorros",   tags=["Ahorros"])
app.include_router(rtr_clientes.router,  prefix="/clientes",  tags=["Clientes"])
app.include_router(rtr_dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(rtr_homebanking.router, prefix="/hb",       tags=["Homebanking"])
app.include_router(rtr_recuperaciones.router, prefix="/recuperaciones", tags=["Recuperaciones"])
app.include_router(rtr_core_bbva.router, prefix="/api/core", tags=["Core BBVA"])

@app.get("/")
def root():
    return {"sistema": "Core Financiero BBVA", "version": "1.0.0", "status": "ok"}



