# controllers/transaccion_controller.py
from services.transaccion_service import TransaccionService
service = TransaccionService()

class TransaccionController:
    async def listar(self, user_id: str) -> dict:
        movimientos = service.obtener_movimientos(user_id)
        return {"success": True, "data": movimientos}

    async def transferir(self, datos) -> dict:
        try:
            resultado = service.realizar_transferencia(datos.dict())
            return {"success": True, "data": resultado}
        except ValueError as e:
            return {"success": False, "message": str(e)}