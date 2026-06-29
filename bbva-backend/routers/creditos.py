# routers/creditos.py
from fastapi import APIRouter, Depends, HTTPException
from models.schemas import CreditoSimularRequest, CreditoSolicitudRequest
from controllers.credito_controller import CreditoController
from routers.dependencies import obtener_usuario_actual

router = APIRouter()
controller = CreditoController()

@router.post("/simular", summary="Simular cuota de crédito")
async def simular(datos: CreditoSimularRequest):
    return await controller.simular(datos)

@router.post("/cronograma", summary="Generar cronograma de pagos")
async def cronograma(datos: CreditoSimularRequest):
    return await controller.cronograma(datos)

@router.post("/solicitar", summary="Solicitar crédito")
async def solicitar(datos: CreditoSolicitudRequest, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if datos.user_id and str(datos.user_id) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="El ID del usuario no coincide con el token")
    datos.user_id = user_id_oficial

    # Validar que la cuenta de destino pertenece al usuario actual
    if datos.cuenta_destino_id:
        from repositories.cuenta_repository import CuentaRepository
        cuenta_repo = CuentaRepository()
        cuenta = cuenta_repo.obtener_por_id(datos.cuenta_destino_id)
        if not cuenta or str(cuenta["user_id"]) != str(user_id_oficial):
            raise HTTPException(status_code=403, detail="La cuenta de depósito no pertenece al usuario autenticado")

    resultado = await controller.solicitar(datos)
    if resultado.get("success") is False:
        raise HTTPException(status_code=400, detail=resultado.get("message"))
    return resultado

@router.get("/solicitudes/{user_id}", summary="Listar solicitudes del usuario")
async def listar(user_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if str(user_id_oficial) != str(user_id):
        raise HTTPException(status_code=403, detail="No autorizado para acceder a este recurso")
    return await controller.listar(user_id_oficial)

@router.get("/solicitudes/{user_id}/{solicitud_id}", summary="Detalle de solicitud")
async def detalle(user_id: str, solicitud_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    if str(user_id_oficial) != str(user_id):
        raise HTTPException(status_code=403, detail="No autorizado para acceder a este recurso")
    
    solicitud = controller.service.obtener_solicitud(solicitud_id)
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    if str(solicitud.get("user_id")) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="No autorizado para acceder a esta solicitud")
        
    return await controller.detalle(solicitud_id)

@router.delete("/solicitudes/{solicitud_id}", summary="Cancelar solicitud")
async def cancelar(solicitud_id: str, current_user: dict = Depends(obtener_usuario_actual)):
    user_id_oficial = current_user.get("sub")
    solicitud = controller.service.obtener_solicitud(solicitud_id)
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    if str(solicitud.get("user_id")) != str(user_id_oficial):
        raise HTTPException(status_code=403, detail="No autorizado para cancelar esta solicitud")
        
    resultado = await controller.cancelar(solicitud_id)
    if resultado.get("success") is False:
        raise HTTPException(status_code=400, detail=resultado.get("message"))
    return resultado