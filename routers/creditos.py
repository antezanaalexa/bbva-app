# routers/creditos.py
from fastapi import APIRouter
from models.schemas import CreditoSimularRequest, CreditoSolicitudRequest
from controllers.credito_controller import CreditoController

router = APIRouter()
controller = CreditoController()

@router.post("/simular", summary="Simular cuota de crédito")
async def simular(datos: CreditoSimularRequest):
    return await controller.simular(datos)

@router.post("/cronograma", summary="Generar cronograma de pagos")
async def cronograma(datos: CreditoSimularRequest):
    return await controller.cronograma(datos)

@router.post("/solicitar", summary="Solicitar crédito")
async def solicitar(datos: CreditoSolicitudRequest):
    return await controller.solicitar(datos)

@router.get("/solicitudes/{user_id}", summary="Listar solicitudes del usuario")
async def listar(user_id: str):
    return await controller.listar(user_id)

@router.get("/solicitudes/{user_id}/{solicitud_id}", summary="Detalle de solicitud")
async def detalle(solicitud_id: str):
    return await controller.detalle(solicitud_id)

@router.delete("/solicitudes/{solicitud_id}", summary="Cancelar solicitud")
async def cancelar(solicitud_id: str):
    return await controller.cancelar(solicitud_id)