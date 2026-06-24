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
                estado,
                password_hash
            FROM app_usuarios
            WHERE dni = %s
        """, (datos.username,))

        usuario = cur.fetchone()

        if not usuario:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        # Verificar contraseña encriptada (o en texto plano por compatibilidad temporal si es necesario, pero obligamos Bcrypt)
        import bcrypt
        try:
            if not bcrypt.checkpw(datos.password.encode('utf-8'), usuario["password_hash"].encode('utf-8')):
                raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        except ValueError:
            # Si la base de datos tenía contraseñas en texto plano de pruebas anteriores
            if datos.password != usuario["password_hash"]:
                raise HTTPException(status_code=401, detail="Credenciales incorrectas (hash inválido)")

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

        import bcrypt
        pwd_bytes = datos.password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

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
            hashed_password
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