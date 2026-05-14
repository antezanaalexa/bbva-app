# services/cuenta_service.py
from repositories.cuenta_repository import CuentaRepository

class CuentaService:
    def __init__(self):
        self.repository = CuentaRepository()

    def obtener_cuentas(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)

    def obtener_saldo(self, user_id: str) -> dict:
        cuentas = self.repository.obtener_por_usuario(user_id)
        total = sum(c["saldo"] for c in cuentas)
        return {"cuentas": cuentas, "total_saldo": round(total, 2)}