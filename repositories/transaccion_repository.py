# repositories/transaccion_repository.py
from repositories.base import supabase

class TransaccionRepository:

    def insertar(self, datos: dict) -> dict:
        response = supabase.table("transacciones").insert({
            "user_id":    str(datos["user_id"]),
            "cuenta_id":  str(datos["cuenta_id"]),
            "tipo":       datos["tipo"],
            "descripcion": datos["descripcion"],
            "monto":      datos["monto"]
        }).execute()
        return response.data[0]

    def obtener_por_usuario(self, user_id: str) -> list:
        response = supabase.table("transacciones") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("fecha", desc=True) \
            .limit(20) \
            .execute()
        return response.data

    def obtener_por_cuenta(self, cuenta_id: str) -> list:
        response = supabase.table("transacciones") \
            .select("*") \
            .eq("cuenta_id", cuenta_id) \
            .order("fecha", desc=True) \
            .execute()
        return response.data