# repositories/credito_repository.py

from repositories.base import get_connection


class CreditoRepository:

    def insertar_solicitud(self, datos: dict) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO solicitudes_prestamo (
                user_id,
                monto,
                plazo_meses,
                tasa_anual,
                cuota_mensual,
                proposito,
                ingresos_mensuales,
                rds,
                semaforo_rds,
                score,
                nivel_aprobacion,
                estado
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
    """, (
            str(datos["user_id"]),
            datos["monto"],
            datos["plazo_meses"],
            datos["tasa_anual"],
            datos["cuota_mensual"],
            datos.get("proposito", "consumo"),
            datos["ingresos_mensuales"],
            datos["rds"],
            datos["semaforo_rds"],
            datos["score"],
            datos["nivel_aprobacion"],
            datos["estado"]
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
            FROM solicitudes_prestamo
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (str(user_id),))

        data = cur.fetchall()

        cur.close()
        conn.close()

        return data

    def obtener_por_id(self, solicitud_id: str) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM solicitudes_prestamo
            WHERE id = %s
        """, (str(solicitud_id),))

        data = cur.fetchone()

        cur.close()
        conn.close()

        return data

    def actualizar_estado(self, solicitud_id: str, estado: str) -> dict:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE solicitudes_prestamo
            SET estado = %s
            WHERE id = %s
            RETURNING *
        """, (
            estado,
            str(solicitud_id)
        ))

        data = cur.fetchone()

        conn.commit()
        cur.close()
        conn.close()

        return data

    def eliminar(self, solicitud_id: str) -> bool:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            DELETE FROM solicitudes_prestamo
            WHERE id = %s
            AND estado = 'pendiente'
            RETURNING id
        """, (str(solicitud_id),))

        eliminado = cur.fetchone()

        conn.commit()
        cur.close()
        conn.close()

        return eliminado is not None