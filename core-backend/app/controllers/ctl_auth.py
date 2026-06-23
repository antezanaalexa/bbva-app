from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.cfg_security import verify_password, create_access_token
from app.core.cfg_roles import rol_desde_cargo

def login(db: Session, numerodni: str, password: str):
    # --- INICIO INTEGRACION BBVA: Intercepción de usuarios de prueba ---
    test_users = {
        "11111111": {"rol": "asesor", "cargo": "Asesor de Negocios", "nombre": "Asesor de Prueba"},
        "11111112": {"rol": "administrador", "cargo": "Administrador de Agencia", "nombre": "Administrador de Prueba"},
        "11111113": {"rol": "jefe_regional", "cargo": "Jefe de Negocios Regional", "nombre": "Jefe Regional de Prueba"},
        "11111114": {"rol": "riesgos", "cargo": "Jefe de Riesgos", "nombre": "Riesgos de Prueba"}
    }
    
    ASIGNACIONES_PRUEBA = {
        "11111111": {"pkasesor": 31, "codasesor": "AS0031"},
        "11111112": {"pkasesor": 36, "codasesor": "AS0036"},
        "11111113": {"pkasesor": 12, "codasesor": "AS0012"},
        "11111114": {"pkasesor": 18, "codasesor": "AS0018"}
    }

    if numerodni in test_users:
        if password != "bbva123" and password != numerodni:
            return None
        
        user_data = test_users[numerodni]
        asig = ASIGNACIONES_PRUEBA.get(numerodni, {})
        pkasesor = asig.get("pkasesor") if user_data["rol"] == "asesor" else None
        codasesor = asig.get("codasesor") if user_data["rol"] == "asesor" else None

        token = create_access_token({
            "sub":         numerodni,
            "pkpersonal":  int(numerodni),
            "pkasesor":    pkasesor,
            "codasesor":   codasesor,
            "nombre":      user_data["nombre"],
            "rol":         user_data["rol"],
            "cargo":       user_data["cargo"],
            "codagencia":  "0001",
        })
        return {
            "access_token": token,
            "token_type":   "bearer",
            "codpersonal":  numerodni,
            "pkasesor":     pkasesor,
            "codasesor":    codasesor,
            "nombre":       user_data["nombre"],
            "rol":          user_data["rol"],
            "codagencia":   "0001",
        }
    # --- FIN INTEGRACION BBVA ---

    # DPERSONAL guarda el DNI y el nombre. El cargo real se obtiene de la tabla
    # puente dpersonalcargo -> dcargopersonal, y el asesor de la tabla puente
    # dpersonalasesor -> dasesor (dpersonal y dasesor no se cruzan naturalmente).
    sql = text("""
        SELECT p.pkpersonal, p.codpersonal, p.nombre,
               cp.codcargopersonal,
               cp.descargopersonal,
               a.pkasesor, a.codasesor
        FROM dpersonal p
        LEFT JOIN dpersonalcargo pc  ON pc.pkpersonal = p.pkpersonal
        LEFT JOIN dcargopersonal cp  ON cp.pkcargopersonal = pc.pkcargopersonal
        LEFT JOIN dpersonalasesor pa ON pa.pkpersonal = p.pkpersonal
        LEFT JOIN dasesor a          ON a.pkasesor = pa.pkasesor
        WHERE p.numerodni = :dni
        LIMIT 1
    """)
    row = db.execute(sql, {"dni": numerodni}).fetchone()
    if not row:
        return None

    # En desarrollo: password = numerodni (simplificado)
    # En producción: verify_password(password, row.password_hash)
    if password != numerodni:
        return None

    rol        = rol_desde_cargo(row.codcargopersonal)
    codagencia = "0001"  # la BD no liga persona->agencia; valor por defecto
    codasesor  = row.codasesor.strip() if row.codasesor else None

    token = create_access_token({
        "sub":         row.codpersonal,
        "pkpersonal":  row.pkpersonal,
        "pkasesor":    row.pkasesor,      # PK del asesor (None si no es asesor)
        "codasesor":   codasesor,
        "nombre":      row.nombre,
        "rol":         rol,
        "cargo":       row.descargopersonal or "Asesor de Negocios",
        "codagencia":  codagencia,
    })
    return {
        "access_token": token,
        "token_type":   "bearer",
        "codpersonal":  row.codpersonal,
        "pkasesor":     row.pkasesor,
        "codasesor":    codasesor,
        "nombre":       row.nombre,
        "rol":          rol,
        "codagencia":   codagencia,
    }