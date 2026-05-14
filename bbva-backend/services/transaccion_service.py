# services/transaccion_service.py
from repositories.transaccion_repository import TransaccionRepository
from repositories.cuenta_repository import CuentaRepository

class TransaccionService:
    def __init__(self):
        self.repository = TransaccionRepository()
        self.cuenta_repo = CuentaRepository()

    def obtener_movimientos(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)

    def realizar_transferencia(self, datos: dict) -> dict:
        # Obtener cuenta origen
        cuenta_origen = self.cuenta_repo.obtener_por_id(str(datos["cuenta_origen_id"]))
        if not cuenta_origen:
            raise ValueError("Cuenta origen no encontrada")

        # Verificar saldo suficiente
        if cuenta_origen["saldo"] < datos["monto"]:
            raise ValueError("Saldo insuficiente")

        # Obtener cuenta destino por número
        cuenta_destino = self.cuenta_repo.obtener_por_numero(datos["cuenta_destino_numero"])
        if not cuenta_destino:
            raise ValueError("Cuenta destino no encontrada")

        # Actualizar saldos
        self.cuenta_repo.actualizar_saldo(
            cuenta_origen["id"],
            cuenta_origen["saldo"] - datos["monto"]
        )
        self.cuenta_repo.actualizar_saldo(
            cuenta_destino["id"],
            cuenta_destino["saldo"] + datos["monto"]
        )

        # Registrar transacciones
        self.repository.insertar({
            "user_id":     datos["user_id"],
            "cuenta_id":   cuenta_origen["id"],
            "tipo":        "debito",
            "descripcion": f"Transferencia a {datos['cuenta_destino_numero']} - {datos.get('concepto', '')}",
            "monto":       datos["monto"]
        })
        self.repository.insertar({
            "user_id":     cuenta_destino["user_id"],
            "cuenta_id":   cuenta_destino["id"],
            "tipo":        "credito",
            "descripcion": f"Transferencia recibida - {datos.get('concepto', '')}",
            "monto":       datos["monto"]
        })

        return {"mensaje": "Transferencia realizada correctamente", "monto": datos["monto"]}