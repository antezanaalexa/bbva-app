# services/ahorro_service.py
from repositories.ahorro_repository import AhorroRepository

class AhorroService:
    def __init__(self):
        self.repository = AhorroRepository()

    def obtener_ahorros(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)

    def depositar(self, datos: dict) -> dict:
        cuenta = self.repository.obtener_por_id(str(datos["cuenta_id"]))
        if not cuenta:
            raise ValueError("Cuenta de ahorro no encontrada")
        nuevo_saldo = cuenta["saldo"] + datos["monto"]
        self.repository.actualizar_saldo(str(datos["cuenta_id"]), nuevo_saldo)
        self.repository.insertar_movimiento({
            "cuenta_id":   datos["cuenta_id"],
            "tipo":        "deposito",
            "monto":       datos["monto"],
            "descripcion": datos.get("descripcion", "Depósito")
        })
        return {"mensaje": "Depósito realizado", "nuevo_saldo": round(nuevo_saldo, 2)}

    def retirar(self, datos: dict) -> dict:
        cuenta = self.repository.obtener_por_id(str(datos["cuenta_id"]))
        if not cuenta:
            raise ValueError("Cuenta de ahorro no encontrada")
        if cuenta["saldo"] < datos["monto"]:
            raise ValueError("Saldo insuficiente")
        nuevo_saldo = cuenta["saldo"] - datos["monto"]
        self.repository.actualizar_saldo(str(datos["cuenta_id"]), nuevo_saldo)
        self.repository.insertar_movimiento({
            "cuenta_id":   datos["cuenta_id"],
            "tipo":        "retiro",
            "monto":       datos["monto"],
            "descripcion": datos.get("descripcion", "Retiro")
        })
        return {"mensaje": "Retiro realizado", "nuevo_saldo": round(nuevo_saldo, 2)}

    def obtener_movimientos(self, cuenta_id: str) -> list:
        return self.repository.obtener_movimientos(cuenta_id)