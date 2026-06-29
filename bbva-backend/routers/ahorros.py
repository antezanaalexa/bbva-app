# routers/ahorros.py
from fastapi import APIRouter, Depends, HTTPException
from controllers.ahorro_controller import AhorroController
from routers.dependencies import obtener_usuario_actual
from repositories.cuenta_repository import CuentaRepository
from models.schemas import AhorroDepositoRequest, AhorroRetiroRequest

router = APIRouter()
controller = AhorroController()
cuenta_repo = CuentaRepository()

@router.get("/{user_id}", summary="Listar cuentas de ahorro")
async def listar_ahorros(user_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if str(user_id_oficial) != str(user_id):
        raise HTTPException(status_code=403, detail="No autorizado para acceder a este recurso")
    return await controller.listar(user_id_oficial)

@router.get("/{cuenta_id}/movimientos", summary="Movimientos de una cuenta")
async def movimientos(cuenta_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    
    # Validar propiedad de la cuenta
    cuenta = cuenta_repo.obtener_por_id(cuenta_id)
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    if str(cuenta.get("user_id")) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="No autorizado para acceder a esta cuenta")
        
    return await controller.movimientos(cuenta_id)

@router.post("/depositar", summary="Depositar")
async def depositar(datos: AhorroDepositoRequest, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if str(datos.user_id) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="El ID de usuario no coincide con el token")
    
    # Validar propiedad de la cuenta
    cuenta = cuenta_repo.obtener_por_id(datos.cuenta_id)
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    if str(cuenta.get("user_id")) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="La cuenta no pertenece al usuario autenticado")
        
    return await controller.depositar(datos)

@router.post("/retirar", summary="Retirar")
async def retirar(datos: AhorroRetiroRequest, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if str(datos.user_id) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="El ID de usuario no coincide con el token")
        
    # Validar propiedad de la cuenta
    cuenta = cuenta_repo.obtener_por_id(datos.cuenta_id)
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    if str(cuenta.get("user_id")) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="La cuenta no pertenece al usuario autenticado")
        
    return await controller.retirar(datos)