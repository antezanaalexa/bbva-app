import random
from fastapi import HTTPException
from repositories.cuenta_repository import CuentaRepository

TIPOS_CUENTA = {
    "digital": "Cuenta Digital",
    "independencia": "Cuenta Independencia",
    "sueldo": "Cuenta Sueldo",
    "vip": "Cuenta VIP",
}

MONEDAS = ["PEN", "USD"]


class CuentaService:
    def __init__(self):
        self.repository = CuentaRepository()

    def obtener_cuentas(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)

    def obtener_saldo(self, user_id: str) -> dict:
        cuentas = self.repository.obtener_por_usuario(user_id)

        total_pen = sum(
            float(c.get("saldo") or 0)
            for c in cuentas
            if c.get("moneda") == "PEN"
        )

        total_usd = sum(
            float(c.get("saldo") or 0)
            for c in cuentas
            if c.get("moneda") == "USD"
        )

        return {
            "cuentas": cuentas,
            "total_pen": round(total_pen, 2),
            "total_usd": round(total_usd, 2)
        }

    def generar_numero_cuenta(self) -> str:
        return f"0011-0814-{random.randint(1000000000, 9999999999)}"

    def generar_cci(self, numero_cuenta: str) -> str:
        base = numero_cuenta.replace("-", "")
        return f"011-{base}-17"

    def crear_cuenta(self, user_id: str, tipo_cuenta: str, moneda: str = "PEN"):
        if tipo_cuenta not in TIPOS_CUENTA:
            raise HTTPException(status_code=400, detail="Tipo de cuenta no válido")

        if moneda not in MONEDAS:
            raise HTTPException(status_code=400, detail="Moneda no válida")

        cuentas_usuario = self.repository.obtener_por_usuario(user_id)

        for cuenta in cuentas_usuario:
            if cuenta.get("tipo_cuenta") == TIPOS_CUENTA[tipo_cuenta] and cuenta.get("moneda") == moneda:
                raise HTTPException(
                    status_code=400,
                    detail="Ya tienes una cuenta de este tipo y moneda"
                )

        numero = self.generar_numero_cuenta()

        cuenta = {
            "user_id": user_id,
            "tipo": "ahorro",
            "tipo_cuenta": TIPOS_CUENTA[tipo_cuenta],
            "numero_cuenta": numero,
            "cci": self.generar_cci(numero),
            "saldo": 0,
            "moneda": moneda,
            "alias": TIPOS_CUENTA[tipo_cuenta],
            "estado": "activa"
        }

        return self.repository.crear_cuenta(cuenta)