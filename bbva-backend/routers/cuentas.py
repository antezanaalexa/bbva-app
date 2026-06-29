# routers/cuentas.py
from fastapi import APIRouter, Depends, HTTPException
from controllers.cuenta_controller import CuentaController
from routers.dependencies import obtener_usuario_actual

router = APIRouter()
controller = CuentaController()

@router.get("/{user_id}", summary="Listar cuentas del usuario")
async def listar_cuentas(user_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="No autorizado para acceder a las cuentas de otro usuario")
    return await controller.listar(user_id)

@router.get("/{user_id}/saldo", summary="Saldo total del usuario")
async def saldo_total(user_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="No autorizado para acceder al saldo de otro usuario")
    return await controller.saldo(user_id)

@router.post("/abrir", summary="Abrir nueva cuenta")
async def abrir_cuenta(datos: dict, current_user: dict = Depends(obtener_usuario_actual)):
    if current_user.get("sub") != datos.get("user_id"):
        raise HTTPException(status_code=403, detail="No autorizado para abrir una cuenta para otro usuario")
    return await controller.abrir(datos)