# routers/transacciones.py
from fastapi import APIRouter, Depends, HTTPException
from models.schemas import TransferenciaRequest
from controllers.transaccion_controller import TransaccionController
from routers.dependencies import obtener_usuario_actual

router = APIRouter()
controller = TransaccionController()

@router.get("/{user_id}", summary="Listar movimientos del usuario")
async def listar_movimientos(user_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if str(user_id_oficial) != str(user_id):
        raise HTTPException(status_code=403, detail="No autorizado para acceder a este recurso")
    return await controller.listar(user_id_oficial)

@router.post("/transferir", summary="Realizar transferencia entre cuentas")
async def transferir(datos: TransferenciaRequest, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if datos.user_id and str(datos.user_id) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="El ID del usuario no coincide con el token")
    
    datos.user_id = user_id_oficial
    
    resultado = await controller.transferir(datos)
    if resultado.get("success") is False:
        raise HTTPException(status_code=400, detail=resultado.get("message"))
    return resultado