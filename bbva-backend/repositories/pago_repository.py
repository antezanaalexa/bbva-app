# repositories/pago_repository.py
from repositories.base import get_connection


class PagoRepository:

    def insertar(self, datos: dict) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO pagos (
                user_id,
                servicio,
                numero_contrato,
                monto,
                estado
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        """, (
            str(datos["user_id"]),
            datos["servicio"],
            datos["numero_contrato"],
            datos["monto"],
            "completado"
        ))

        data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return data

    def obtener_por_usuario(self, user_id: str) -> list:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM pagos
            WHERE user_id = %s
            ORDER BY fecha DESC
        """, (str(user_id),))

        data = cur.fetchall()
        cur.close()
        conn.close()
        return data