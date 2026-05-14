# controllers/ahorro_controller.py
from services.ahorro_service import AhorroService
service = AhorroService()

class AhorroController:
    async def listar(self, user_id: str) -> dict:
        ahorros = service.obtener_ahorros(user_id)
        return {"success": True, "data": ahorros}

    async def depositar(self, datos) -> dict:
        try:
            resultado = service.depositar(datos.dict())
            return {"success": True, "data": resultado}
        except ValueError as e:
            return {"success": False, "message": str(e)}

    async def retirar(self, datos) -> dict:
        try:
            resultado = service.retirar(datos.dict())
            return {"success": True, "data": resultado}
        except ValueError as e:
            return {"success": False, "message": str(e)}

    async def movimientos(self, cuenta_id: str) -> dict:
        movs = service.obtener_movimientos(cuenta_id)
        return {"success": True, "data": movs}