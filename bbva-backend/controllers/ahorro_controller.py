# controllers/ahorro_controller.py
from repositories.cuenta_repository import CuentaRepository
from repositories.transaccion_repository import TransaccionRepository

cuenta_repo = CuentaRepository()
trans_repo = TransaccionRepository()

class AhorroController:
    async def listar(self, user_id: str) -> dict:
        # Usa tabla CUENTAS en vez de cuentas_ahorro
        cuentas = cuenta_repo.obtener_por_usuario(user_id)
        ahorros = [c for c in cuentas if c['tipo'] == 'ahorro']
        return {"success": True, "data": ahorros}

    async def movimientos(self, cuenta_id: str) -> dict:
        movs = trans_repo.obtener_por_cuenta(cuenta_id)
        return {"success": True, "data": movs}

    async def depositar(self, datos) -> dict:
        return {"success": True, "message": "Use transferencias"}

    async def retirar(self, datos) -> dict:
        return {"success": True, "message": "Use transferencias"}