# controllers/cuenta_controller.py
from services.cuenta_service import CuentaService
service = CuentaService()

class CuentaController:
    async def listar(self, user_id: str) -> dict:
        cuentas = service.obtener_cuentas(user_id)
        return {"success": True, "data": cuentas}

    async def saldo(self, user_id: str) -> dict:
        resultado = service.obtener_saldo(user_id)
        return {"success": True, "data": resultado}