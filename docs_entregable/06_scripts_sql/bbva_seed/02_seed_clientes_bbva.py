import os
import sys
import uuid
import bcrypt
import random
from datetime import datetime
from faker import Faker
from sqlalchemy import text

sys.path.append(r'c:\Proyectos\BBVA\core-backend')
from app.core.cfg_database import SessionLocal

fake = Faker('es_MX')

def main():
    db = SessionLocal()
    print("=== Iniciando Seed de Clientes BBVA ===")
    
    # Cantidad de clientes a generar
    NUM_CLIENTES = 100
    
    # Las contraseñas serán individuales y seguirán el patrón Cli@<DNI>
    salt = bcrypt.gensalt()

    insertados = 0
    
    # También crearemos a los usuarios principales para la demo
    demo_users = [
        {"dni": "11111111", "nombres": "Alexandra", "apellidos": "Antezana", "correo": "alexa@gmail.com"},
        {"dni": "22222222", "nombres": "Johnny", "apellidos": "Rodriguez", "correo": "johnny@gmail.com"},
        {"dni": "33333333", "nombres": "Profesor", "apellidos": "BBVA", "correo": "profesor@bbva.pe"},
    ]

    # Combinamos demo users y fake users
    todos_usuarios = demo_users
    for _ in range(NUM_CLIENTES - len(demo_users)):
        todos_usuarios.append({
            "dni": fake.unique.numerify(text="########"),
            "nombres": fake.first_name(),
            "apellidos": fake.last_name() + " " + fake.last_name(),
            "correo": fake.unique.email()
        })

    for u in todos_usuarios:
        # 1. Insertar en dcliente (CORE Histórico)
        sql_dcliente = text("""
            INSERT INTO dcliente (
                codcliente, nomcliente, numerodocumentoidentidad,
                pkclasepersona, codclasepersona, desclasepersona,
                pktipodocumentoidentidad, codtipodocumentoidentidad, destipodocumentoidentidad,
                pkactividadeconomica, fecultactualizacion,
                fechaingresocaja, fechainiciosistemafin, fechaingreso, fechanacimiento
            ) VALUES (
                :codcliente, :nombre, :dni,
                1, '1', 'PERSONA NATURAL',
                1, '1', 'DNI',
                1, NOW(),
                NOW(), NOW(), NOW(), NOW()
            ) RETURNING pkcliente
        """)
        
        nombre_completo = f"{u['nombres']} {u['apellidos']}"
        cod_cliente = f"CLI{u['dni']}"
        
        try:
            res = db.execute(sql_dcliente, {
                "codcliente": cod_cliente,
                "nombre": nombre_completo,
                "dni": u['dni']
            })
            pkcliente = res.scalar()
            
            # 2. Insertar en app_usuarios (BBVA Homebanking)
            user_id = str(uuid.uuid4())
            pwd_bytes = f"Cli@{u['dni']}".encode('utf-8')
            hashed_password = bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
            sql_app = text("""
                INSERT INTO app_usuarios (
                    id, pkcliente, dni, nombres, apellidos,
                    correo, password_hash, rol, estado, fecha_registro
                ) VALUES (
                    :id, :pkcliente, :dni, :nombres, :apellidos,
                    :correo, :pwd, 'cliente', 'activo', NOW()
                )
            """)
            db.execute(sql_app, {
                "id": user_id,
                "pkcliente": pkcliente,
                "dni": u['dni'],
                "nombres": u['nombres'],
                "apellidos": u['apellidos'],
                "correo": u['correo'],
                "pwd": hashed_password
            })
            
            insertados += 1
            
        except Exception as e:
            print(f"Error insertando cliente {u['dni']}: {e}")
            db.rollback()
            continue

    db.commit()
    print(f"Se insertaron exitosamente {insertados} clientes en dcliente y app_usuarios.")
    print("Contraseña por defecto para login: Cli@<DNI>")
    print("=======================================")

if __name__ == "__main__":
    main()
