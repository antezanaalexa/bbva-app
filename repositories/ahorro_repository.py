# repositories/ahorro_repository.py
from repositories.base import supabase

class AhorroRepository:

    def obtener_por_usuario(self, user_id: str) -> list:
        response = supabase.table("cuentas_ahorro") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()
        return response.data

    def obtener_por_id(self, cuenta_id: str) -> dict:
        response = supabase.table("cuentas_ahorro") \
            .select("*") \
            .eq("id", cuenta_id) \
            .execute()
        if not response.data:
            return None
        return response.data[0]

    def actualizar_saldo(self, cuenta_id: str, nuevo_saldo: float) -> dict:
        response = supabase.table("cuentas_ahorro") \
            .update({"saldo": nuevo_saldo}) \
            .eq("id", cuenta_id) \
            .execute()
        return response.data[0]

    def insertar_movimiento(self, datos: dict) -> dict:
        response = supabase.table("movimientos_ahorro").insert({
            "cuenta_id":   str(datos["cuenta_id"]),
            "tipo":        datos["tipo"],
            "monto":       datos["monto"],
            "descripcion": datos.get("descripcion", "")
        }).execute()
        return response.data[0]

    def obtener_movimientos(self, cuenta_id: str) -> list:
        response = supabase.table("movimientos_ahorro") \
            .select("*") \
            .eq("cuenta_id", cuenta_id) \
            .order("fecha", desc=True) \
            .execute()
        return response.data