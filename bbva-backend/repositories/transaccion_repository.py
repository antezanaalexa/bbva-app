# repositories/transaccion_repository.py
from repositories.base import get_connection


class TransaccionRepository:

    def insertar(self, datos: dict) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO transacciones (
                user_id,
                cuenta_id,
                tipo,
                descripcion,
                monto
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        """, (
            str(datos["user_id"]),
            str(datos["cuenta_id"]),
            datos["tipo"],
            datos["descripcion"],
            datos["monto"]
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
            SELECT t.*, c.moneda
            FROM transacciones t
            LEFT JOIN cuentas c ON t.cuenta_id = c.id
            WHERE t.user_id = %s
            ORDER BY t.fecha DESC
            LIMIT 20
        """, (str(user_id),))

        data = cur.fetchall()
        cur.close()
        conn.close()
        return data

    def obtener_por_cuenta(self, cuenta_id: str) -> list:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT t.*, c.moneda
            FROM transacciones t
            LEFT JOIN cuentas c ON t.cuenta_id = c.id
            WHERE t.cuenta_id = %s
            ORDER BY t.fecha DESC
        """, (str(cuenta_id),))

        data = cur.fetchall()
        cur.close()
        conn.close()
        return data