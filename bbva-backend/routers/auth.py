from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from repositories.base import get_connection

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    nombres: str
    apellidos: str
    dni: str
    correo: str
    password: str
    tipo_cuenta: str
    moneda: str = "PEN"


@router.post("/login")
def login(datos: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                id,
                dni,
                nombres,
                apellidos,
                correo,
                rol,
                estado
            FROM app_usuarios
            WHERE dni = %s
              AND password_hash = %s
        """, (datos.username, datos.password))

        usuario = cur.fetchone()

        if not usuario:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        if usuario["estado"] != "activo":
            raise HTTPException(status_code=403, detail="Usuario inactivo")

        return {
            "success": True,
            "user": {
                "id": usuario["id"],
                "dni": usuario["dni"],
                "nombres": usuario["nombres"],
                "apellidos": usuario["apellidos"],
                "email": usuario["correo"],
                "rol": usuario["rol"]
            }
        }

    finally:
        cur.close()
        conn.close()


@router.post("/register")
def register(datos: RegisterRequest):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id
            FROM app_usuarios
            WHERE dni = %s
        """, (datos.dni,))

        existente = cur.fetchone()

        if existente:
            raise HTTPException(
                status_code=400,
                detail="Ya existe una cuenta asociada a este DNI."
            )

        cur.execute("""
            INSERT INTO app_usuarios (
                dni,
                nombres,
                apellidos,
                correo,
                password_hash,
                rol,
                estado
            )
            VALUES (%s, %s, %s, %s, %s, 'cliente', 'activo')
            RETURNING
                id,
                dni,
                nombres,
                apellidos,
                correo,
                rol,
                estado
        """, (
            datos.dni,
            datos.nombres,
            datos.apellidos,
            datos.correo,
            datos.password
        ))

        usuario = cur.fetchone()

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
                %s,
                'ahorro',
                '0011-0816-01-' || LPAD(FLOOR(RANDOM() * 9999999)::TEXT, 7, '0'),
                '0110816001' || LPAD(FLOOR(RANDOM() * 999999999)::TEXT, 9, '0') || '17',
                0,
                %s,
                %s,
                'activa'
            )
            RETURNING *
        """, (
            str(usuario["id"]),
            datos.moneda,
            datos.tipo_cuenta
        ))

        cuenta = cur.fetchone()

        conn.commit()

        return {
            "success": True,
            "user": {
                "id": usuario["id"],
                "dni": usuario["dni"],
                "nombres": usuario["nombres"],
                "apellidos": usuario["apellidos"],
                "email": usuario["correo"],
                "rol": usuario["rol"]
            },
            "cuenta": cuenta
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cur.close()
        conn.close()