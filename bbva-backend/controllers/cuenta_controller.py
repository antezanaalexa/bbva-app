from services.cuenta_service import CuentaService

service = CuentaService()

class CuentaController:

    async def listar(self, user_id: str) -> dict:
        cuentas = service.obtener_cuentas(user_id)
        return {
            "success": True,
            "data": cuentas
        }

    async def saldo(self, user_id: str) -> dict:
        resultado = service.obtener_saldo(user_id)
        return {
            "success": True,
            "data": resultado
        }

    async def abrir(self, datos) -> dict:

        cuenta = service.crear_cuenta(
            user_id=datos["user_id"],
            tipo_cuenta=datos["tipo_cuenta"],
            moneda=datos.get("moneda", "PEN")
        )

        return {
            "success": True,
            "data": cuenta
        }