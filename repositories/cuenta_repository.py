# repositories/cuenta_repository.py
from repositories.base import supabase

class CuentaRepository:

    def obtener_por_usuario(self, user_id: str) -> list:
        response = supabase.table("cuentas") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()
        return response.data

    def obtener_por_numero(self, numero_cuenta: str) -> dict:
        response = supabase.table("cuentas") \
            .select("*") \
            .eq("numero_cuenta", numero_cuenta) \
            .execute()
        if not response.data:
            return None
        return response.data[0]

    def actualizar_saldo(self, cuenta_id: str, nuevo_saldo: float) -> dict:
        response = supabase.table("cuentas") \
            .update({"saldo": nuevo_saldo}) \
            .eq("id", cuenta_id) \
            .execute()
        return response.data[0]

    def obtener_por_id(self, cuenta_id: str) -> dict:
        response = supabase.table("cuentas") \
            .select("*") \
            .eq("id", cuenta_id) \
            .execute()
        if not response.data:
            return None
        return response.data[0]