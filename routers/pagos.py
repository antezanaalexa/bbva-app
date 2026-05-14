# routers/pagos.py
from fastapi import APIRouter
from models.schemas import PagoRequest
from controllers.pago_controller import PagoController

router = APIRouter()
controller = PagoController()

@router.post("/", summary="Realizar pago de servicio")
async def pagar(datos: PagoRequest):
    return await controller.pagar(datos)

@router.get("/{user_id}", summary="Historial de pagos del usuario")
async def listar_pagos(user_id: str):
    return await controller.listar(user_id)