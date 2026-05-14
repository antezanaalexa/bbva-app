# routers/ahorros.py
from fastapi import APIRouter
from models.schemas import AhorroDepositoRequest, AhorroRetiroRequest
from controllers.ahorro_controller import AhorroController

router = APIRouter()
controller = AhorroController()

@router.get("/{user_id}", summary="Listar cuentas de ahorro")
async def listar_ahorros(user_id: str):
    return await controller.listar(user_id)

@router.get("/{cuenta_id}/movimientos", summary="Movimientos de una cuenta ahorro")
async def movimientos(cuenta_id: str):
    return await controller.movimientos(cuenta_id)

@router.post("/depositar", summary="Depositar en cuenta ahorro")
async def depositar(datos: AhorroDepositoRequest):
    return await controller.depositar(datos)

@router.post("/retirar", summary="Retirar de cuenta ahorro")
async def retirar(datos: AhorroRetiroRequest):
    return await controller.retirar(datos)