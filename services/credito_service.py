# services/credito_service.py
from repositories.credito_repository import CreditoRepository

class CreditoService:
    def __init__(self):
        self.repository = CreditoRepository()

    def calcular_cuota(self, monto: float, plazo: int, tasa_anual: float) -> dict:
        """Fórmula de amortización francesa"""
        r = (tasa_anual / 100) / 12
        factor = (1 + r) ** plazo
        cuota = monto * (r * factor) / (factor - 1)
        total = cuota * plazo
        return {
            "monto":         round(monto, 2),
            "cuota_mensual": round(cuota, 2),
            "total_pagar":   round(total, 2),
            "total_interes": round(total - monto, 2),
            "plazo_meses":   plazo,
            "tasa_anual":    tasa_anual
        }

    def generar_cronograma(self, monto: float, plazo: int, tasa_anual: float) -> list:
        """Genera el cronograma de pagos mes a mes"""
        r = (tasa_anual / 100) / 12
        factor = (1 + r) ** plazo
        cuota = monto * (r * factor) / (factor - 1)
        saldo = monto
        cronograma = []
        for i in range(1, plazo + 1):
            interes = saldo * r
            capital = cuota - interes
            saldo -= capital
            cronograma.append({
                "cuota":    i,
                "capital":  round(capital, 2),
                "interes":  round(interes, 2),
                "total":    round(cuota, 2),
                "saldo":    round(max(saldo, 0), 2)
            })
        return cronograma

    def solicitar(self, datos: dict) -> dict:
        calculo = self.calcular_cuota(datos["monto"], datos["plazo_meses"], datos["tasa_anual"])
        return self.repository.insertar_solicitud({**datos, **calculo})

    def obtener_solicitudes(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)

    def obtener_solicitud(self, solicitud_id: str) -> dict:
        return self.repository.obtener_por_id(solicitud_id)

    def cancelar(self, solicitud_id: str) -> bool:
        return self.repository.eliminar(solicitud_id)