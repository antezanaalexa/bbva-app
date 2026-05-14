# services/pago_service.py
from repositories.pago_repository import PagoRepository

class PagoService:
    def __init__(self):
        self.repository = PagoRepository()

    def realizar_pago(self, datos: dict) -> dict:
        return self.repository.insertar(datos)

    def obtener_pagos(self, user_id: str) -> list:
        return self.repository.obtener_por_usuario(user_id)