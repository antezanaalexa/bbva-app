from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import cuentas, transacciones, ahorros, creditos, pagos, auth

app = FastAPI(
    title="BBVA Perú — API Banca por Internet",
    version="1.0.0",
    description="Backend del portal de Banca por Internet BBVA Perú"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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