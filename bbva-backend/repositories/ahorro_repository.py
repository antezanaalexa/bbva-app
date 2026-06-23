# repositories/ahorro_repository.py
from repositories.base import get_connection


class AhorroRepository:

    def obtener_por_usuario(self, user_id: str) -> list:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM cuentas_ahorro
            WHERE user_id = %s
            ORDER BY fecha_apertura DESC
        """, (str(user_id),))

        data = cur.fetchall()
        cur.close()
        conn.close()
        return data

    def obtener_por_id(self, cuenta_id: str) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM cuentas_ahorro
            WHERE id = %s
        """, (str(cuenta_id),))

        data = cur.fetchone()
        cur.close()
        conn.close()
        return data

    def actualizar_saldo(self, cuenta_id: str, nuevo_saldo: float) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE cuentas_ahorro
            SET saldo = %s,
                updated_at = NOW()
            WHERE id = %s
            RETURNING *
        """, (nuevo_saldo, str(cuenta_id)))

        data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return data

    def insertar_movimiento(self, datos: dict) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO movimientos_ahorro (
                cuenta_id,
                tipo,
                monto,
                descripcion
            )
            VALUES (%s, %s, %s, %s)
            RETURNING *
        """, (
            str(datos["cuenta_id"]),
            datos["tipo"],
            datos["monto"],
            datos.get("descripcion", "")
        ))

        data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return data

    def obtener_movimientos(self, cuenta_id: str) -> list:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM movimientos_ahorro
            WHERE cuenta_id = %s
            ORDER BY fecha DESC
        """, (str(cuenta_id),))

        data = cur.fetchall()
        cur.close()
        conn.close()
        return data