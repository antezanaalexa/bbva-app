# routers/transacciones.py
from fastapi import APIRouter
from models.schemas import TransferenciaRequest
from controllers.transaccion_controller import TransaccionController

router = APIRouter()
controller = TransaccionController()

@router.get("/{user_id}", summary="Listar movimientos del usuario")
async def listar_movimientos(user_id: str):
    return await controller.listar(user_id)

@router.post("/transferir", summary="Realizar transferencia entre cuentas")
async def transferir(datos: TransferenciaRequest):
    return await controller.transferir(datos)