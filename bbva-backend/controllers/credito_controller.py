# controllers/credito_controller.py
from services.credito_service import CreditoService
service = CreditoService()

class CreditoController:
    async def simular(self, datos) -> dict:
        resultado = service.calcular_cuota(datos.monto, datos.plazo_meses, proposito=datos.proposito)
        return {"success": True, "data": resultado}

    async def cronograma(self, datos) -> dict:
        cronograma = service.generar_cronograma(datos.monto, datos.plazo_meses, proposito=datos.proposito)
        return {"success": True, "data": cronograma}

    async def solicitar(self, datos) -> dict:
        try:
            resultado = service.solicitar(datos.dict())
            return {"success": True, "data": resultado}
        except Exception as e:
            return {"success": False, "message": str(e)}

    async def listar(self, user_id: str) -> dict:
        solicitudes = service.obtener_solicitudes(user_id)
        return {"success": True, "data": solicitudes}

    async def detalle(self, solicitud_id: str) -> dict:
        solicitud = service.obtener_solicitud(solicitud_id)
        if not solicitud:
            return {"success": False, "message": "Solicitud no encontrada"}
        return {"success": True, "data": solicitud}

    async def cancelar(self, solicitud_id: str) -> dict:
        eliminado = service.cancelar(solicitud_id)
        if not eliminado:
            return {"success": False, "message": "No se puede cancelar"}
        return {"success": True, "message": "Solicitud cancelada"}