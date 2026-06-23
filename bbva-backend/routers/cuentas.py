# routers/cuentas.py
from fastapi import APIRouter
from controllers.cuenta_controller import CuentaController

router = APIRouter()
controller = CuentaController()

@router.get("/{user_id}", summary="Listar cuentas del usuario")
async def listar_cuentas(user_id: str):
    return await controller.listar(user_id)

@router.get("/{user_id}/saldo", summary="Saldo total del usuario")
async def saldo_total(user_id: str):
    return await controller.saldo(user_id)

@router.post("/abrir", summary="Abrir nueva cuenta")
async def abrir_cuenta(datos: dict):
    return await controller.abrir(datos)