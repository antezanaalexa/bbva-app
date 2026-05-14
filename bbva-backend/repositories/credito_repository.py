# repositories/credito_repository.py
from repositories.base import supabase

class CreditoRepository:

    def insertar_solicitud(self, datos: dict) -> dict:
        response = supabase.table("solicitudes_prestamo").insert({
            "user_id":       str(datos["user_id"]),
            "monto":         datos["monto"],
            "plazo_meses":   datos["plazo_meses"],
            "tasa_anual":    datos["tasa_anual"],
            "cuota_mensual": datos["cuota_mensual"],
            "proposito":     datos.get("proposito", "consumo"),
            "estado":        "pendiente"
        }).execute()
        return response.data[0]

    def obtener_por_usuario(self, user_id: str) -> list:
        response = supabase.table("solicitudes_prestamo") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        return response.data

    def obtener_por_id(self, solicitud_id: str) -> dict:
        response = supabase.table("solicitudes_prestamo") \
            .select("*") \
            .eq("id", solicitud_id) \
            .execute()
        if not response.data:
            return None
        return response.data[0]

    def actualizar_estado(self, solicitud_id: str, estado: str) -> dict:
        response = supabase.table("solicitudes_prestamo") \
            .update({"estado": estado}) \
            .eq("id", solicitud_id) \
            .execute()
        return response.data[0]

    def eliminar(self, solicitud_id: str) -> bool:
        response = supabase.table("solicitudes_prestamo") \
            .delete() \
            .eq("id", solicitud_id) \
            .eq("estado", "pendiente") \
            .execute()
        return len(response.data) > 0