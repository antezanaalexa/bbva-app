from repositories.base import get_connection


class CuentaRepository:

    def obtener_por_usuario(self, user_id: str) -> list:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM cuentas
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (str(user_id),))

        data = cur.fetchall()
        cur.close()
        conn.close()
        return data

    def obtener_por_numero(self, numero_cuenta: str) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM cuentas
            WHERE numero_cuenta = %s
        """, (numero_cuenta,))

        data = cur.fetchone()
        cur.close()
        conn.close()
        return data

    def obtener_por_id(self, cuenta_id: str) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM cuentas
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
            UPDATE cuentas
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

    def crear_cuenta(self, datos: dict) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO cuentas (
                user_id,
                tipo,
                numero_cuenta,
                cci,
                saldo,
                moneda,
                tipo_cuenta,
                estado
            )
            VALUES (
                %(user_id)s,
                %(tipo)s,
                %(numero_cuenta)s,
                %(cci)s,
                %(saldo)s,
                %(moneda)s,
                %(tipo_cuenta)s,
                %(estado)s
            )
            RETURNING *
        """, datos)

        data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return data