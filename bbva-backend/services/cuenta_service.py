import random
from fastapi import HTTPException
from repositories.cuenta_repository import CuentaRepository

TIPOS_CUENTA = {
    "digital": "digital",
    "independencia": "independencia",
    "sueldo": "sueldo",
    "ganadora": "ganadora",
    "vip": "vip",
}

MAP_NOMBRES = {
    "digital": "Cuenta Digital",
    "independencia": "Cuenta Independencia",
    "sueldo": "Cuenta Sueldo",
    "ganadora": "Cuenta Ganadora",
    "vip": "Cuenta VIP",
}

MONEDAS = ["PEN", "USD"]


class CuentaService:
    def __init__(self):
        self.repository = CuentaRepository()

    def obtener_cuentas(self, user_id: str) -> list:
        cuentas = self.repository.obtener_por_usuario(user_id)
        # Filtrar solo cuentas activas
        cuentas_activas = [c for c in cuentas if c.get("estado") == "activa"]
        # Mapear nombres legibles para el frontend
        for c in cuentas_activas:
            c["tipo_cuenta"] = MAP_NOMBRES.get(c.get("tipo_cuenta"), c.get("tipo_cuenta"))
        return cuentas_activas

    def obtener_saldo(self, user_id: str) -> dict:
        cuentas = self.repository.obtener_por_usuario(user_id)
        # Filtrar solo cuentas activas
        cuentas_activas = [c for c in cuentas if c.get("estado") == "activa"]

        total_pen = sum(
            float(c.get("saldo") or 0)
            for c in cuentas_activas
            if c.get("moneda") == "PEN"
        )

        total_usd = sum(
            float(c.get("saldo") or 0)
            for c in cuentas_activas
            if c.get("moneda") == "USD"
        )

        # Mapear nombres legibles para el frontend
        for c in cuentas_activas:
            c["tipo_cuenta"] = MAP_NOMBRES.get(c.get("tipo_cuenta"), c.get("tipo_cuenta"))

        return {
            "cuentas": cuentas_activas,
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

        # Validar duplicados de tipo + moneda usando el código de base de datos
        for cuenta in cuentas_usuario:
            if cuenta.get("tipo_cuenta") == tipo_cuenta and cuenta.get("moneda") == moneda:
                raise HTTPException(
                    status_code=400,
                    detail="Ya tienes una cuenta de este tipo y moneda"
                )

        numero = self.generar_numero_cuenta()

        cuenta = {
            "user_id": user_id,
            "tipo": "ahorro",
            "tipo_cuenta": tipo_cuenta,
            "numero_cuenta": numero,
            "cci": self.generar_cci(numero),
            "saldo": 0.0,
            "moneda": moneda,
            "alias": MAP_NOMBRES.get(tipo_cuenta, tipo_cuenta),
            "estado": "activa"
        }

        creada = self.repository.crear_cuenta(cuenta)
        if creada:
            creada["tipo_cuenta"] = MAP_NOMBRES.get(creada.get("tipo_cuenta"), creada.get("tipo_cuenta"))
        return creada