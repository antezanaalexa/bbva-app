# repositories/pago_repository.py
from repositories.base import supabase

class PagoRepository:

    def insertar(self, datos: dict) -> dict:
        response = supabase.table("pagos").insert({
            "user_id":          str(datos["user_id"]),
            "servicio":         datos["servicio"],
            "numero_contrato":  datos["numero_contrato"],
            "monto":            datos["monto"],
            "estado":           "completado"
        }).execute()
        return response.data[0]

    def obtener_por_usuario(self, user_id: str) -> list:
        response = supabase.table("pagos") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("fecha", desc=True) \
            .execute()
        return response.data