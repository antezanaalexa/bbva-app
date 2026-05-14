# controllers/pago_controller.py
from services.pago_service import PagoService
service = PagoService()

class PagoController:
    async def pagar(self, datos) -> dict:
        try:
            resultado = service.realizar_pago(datos.dict())
            return {"success": True, "data": resultado}
        except Exception as e:
            return {"success": False, "message": str(e)}

    async def listar(self, user_id: str) -> dict:
        pagos = service.obtener_pagos(user_id)
        return {"success": True, "data": pagos}