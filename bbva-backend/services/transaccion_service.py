from decimal import Decimal
from repositories.transaccion_repository import TransaccionRepository
from repositories.cuenta_repository import CuentaRepository


class TransaccionService:
    def __init__(self):
        self.repository = TransaccionRepository()
        self.cuenta_repo = CuentaRepository()

    def obtener_movimientos(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)

    def realizar_transferencia(self, datos: dict) -> dict:
        cuenta_origen = self.cuenta_repo.obtener_por_id(
            str(datos["cuenta_origen_id"])
        )

        if not cuenta_origen:
            raise ValueError("Cuenta origen no encontrada")

        monto = Decimal(str(datos["monto"]))
        saldo_origen = Decimal(str(cuenta_origen["saldo"]))

        if monto <= 0:
            raise ValueError("El monto debe ser mayor a cero")

        if saldo_origen < monto:
            raise ValueError("Saldo insuficiente")

        cuenta_destino = self.cuenta_repo.obtener_por_numero(
            datos["cuenta_destino_numero"]
        )

        if not cuenta_destino:
            raise ValueError("Cuenta destino no encontrada")

        if cuenta_origen["id"] == cuenta_destino["id"]:
            raise ValueError("No puedes transferir a la misma cuenta")

        if cuenta_origen["moneda"] != cuenta_destino["moneda"]:
            raise ValueError("No puedes transferir entre cuentas de distinta moneda")

        if cuenta_origen["estado"] != "activa" or cuenta_destino["estado"] != "activa":
            raise ValueError("Una de las cuentas no está activa")

        saldo_destino = Decimal(str(cuenta_destino["saldo"]))

        self.cuenta_repo.actualizar_saldo(
            cuenta_origen["id"],
            saldo_origen - monto
        )

        self.cuenta_repo.actualizar_saldo(
            cuenta_destino["id"],
            saldo_destino + monto
        )

        self.repository.insertar({
            "user_id": datos["user_id"],
            "cuenta_id": cuenta_origen["id"],
            "tipo": "debito",
            "descripcion": f"Transferencia a {datos['cuenta_destino_numero']} - {datos.get('concepto', '')}",
            "monto": monto
        })

        self.repository.insertar({
            "user_id": cuenta_destino["user_id"],
            "cuenta_id": cuenta_destino["id"],
            "tipo": "credito",
            "descripcion": f"Transferencia recibida - {datos.get('concepto', '')}",
            "monto": monto
        })

        return {
            "mensaje": "Transferencia realizada correctamente",
            "monto": float(monto)
        }