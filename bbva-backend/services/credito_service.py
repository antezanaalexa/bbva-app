from repositories.credito_repository import CreditoRepository

class CreditoService:
    def __init__(self):
        self.repository = CreditoRepository()

    def calcular_cuota(self, monto: float, plazo: int, tasa_anual: float = None, proposito: str = "consumo") -> dict:
        from services.tasas_bbva import TASAS_SIMULADAS_POR_PROPOSITO, PRESTAMO_PERSONAL_BPI_TEA
        tasa = TASAS_SIMULADAS_POR_PROPOSITO.get(proposito, PRESTAMO_PERSONAL_BPI_TEA)
        r = (1 + tasa / 100) ** (1 / 12) - 1
        factor = (1 + r) ** plazo
        cuota = monto * (r * factor) / (factor - 1)
        total = cuota * plazo

        return {
            "monto": round(monto, 2),
            "cuota_mensual": round(cuota, 2),
            "total_pagar": round(total, 2),
            "total_interes": round(total - monto, 2),
            "plazo_meses": plazo,
            "tasa_anual": tasa
        }

    def evaluar_credito(self, monto, cuota, ingresos):
        rds = (cuota / ingresos) * 100

        score = 0

        if ingresos >= 700:
            score += 30
        if rds <= 35:
            score += 40
        elif rds <= 50:
            score += 20
        if monto <= 30000:
            score += 20
        elif monto <= 100000:
            score += 10
        score += 10

        if ingresos < 700:
            estado = "rechazado"
            semaforo = "rojo"
            mensaje = "Ingresos menores al mínimo requerido."
        elif rds <= 35:
            estado = "pendiente"
            semaforo = "verde"
            mensaje = "Solicitud viable. Pasa a evaluación del Core."
        elif rds <= 50:
            estado = "pendiente"
            semaforo = "amarillo"
            mensaje = "Solicitud requiere evaluación adicional."
        else:
            estado = "rechazado"
            semaforo = "rojo"
            mensaje = "Ratio de endeudamiento demasiado alto."

        if monto <= 30000:
            nivel = "asesor"
        elif monto <= 100000:
            nivel = "administrador"
        elif monto <= 300000:
            nivel = "jefe_regional"
        else:
            nivel = "riesgos"

        return {
            "rds": round(rds, 2),
            "semaforo_rds": semaforo,
            "score": score,
            "nivel_aprobacion": nivel,
            "estado": estado,
            "mensaje_evaluacion": mensaje
        }

    def solicitar(self, datos: dict) -> dict:
        proposito = datos.get("proposito", "consumo")
        calculo = self.calcular_cuota(
            datos["monto"],
            datos["plazo_meses"],
            proposito=proposito
        )

        evaluacion = self.evaluar_credito(
            datos["monto"],
            calculo["cuota_mensual"],
            datos["ingresos_mensuales"]
        )

        datos_finales = {
            **datos,
            **calculo,
            **evaluacion
        }

        return self.repository.insertar_solicitud(datos_finales)

    def obtener_solicitudes(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)

    def obtener_solicitud(self, solicitud_id: str) -> dict:
        return self.repository.obtener_por_id(solicitud_id)

    def cancelar(self, solicitud_id: str) -> bool:
        return self.repository.eliminar(solicitud_id)

    def generar_cronograma(self, monto: float, plazo: int, tasa_anual: float = None, proposito: str = "consumo") -> list:
        from services.tasas_bbva import TASAS_SIMULADAS_POR_PROPOSITO, PRESTAMO_PERSONAL_BPI_TEA
        tasa = TASAS_SIMULADAS_POR_PROPOSITO.get(proposito, PRESTAMO_PERSONAL_BPI_TEA)
        r = (1 + tasa / 100) ** (1 / 12) - 1
        factor = (1 + r) ** plazo
        cuota = monto * (r * factor) / (factor - 1)
        saldo = monto
        cronograma = []

        for i in range(1, plazo + 1):
            interes = saldo * r
            capital = cuota - interes
            saldo -= capital

            cronograma.append({
                "cuota": i,
                "capital": round(capital, 2),
                "interes": round(interes, 2),
                "total": round(cuota, 2),
                "saldo": round(max(saldo, 0), 2)
            })

        return cronograma