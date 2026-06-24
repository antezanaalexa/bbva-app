import sys
import os
from sqlalchemy import text

# Añadir ruta al backend para poder importar modulos
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.cfg_database import engine, SessionLocal
import bcrypt

def get_password_hash(password: str) -> str:
    # bcrypt requires bytes, we encode the string to utf-8
    pwd_bytes = password.encode('utf-8')
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def main():
    print("Iniciando proceso de encriptación de contraseñas de personal...")
    
    # 1. Asegurar que la columna password_hash existe
    with engine.connect() as conn:
        try:
            # Añadir columna si no existe
            conn.execute(text("ALTER TABLE dpersonal ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);"))
            conn.commit()
            print("Columna 'password_hash' asegurada en la tabla 'dpersonal'.")
        except Exception as e:
            print(f"La columna ya existe o hubo un error menor: {e}")

    # 2. Encriptar contraseñas usando el DNI
    db = SessionLocal()
    try:
        # Obtener todo el personal que no tiene hash o que vamos a forzar actualizar
        result = db.execute(text("SELECT pkpersonal, numerodni FROM dpersonal"))
        personal_list = result.fetchall()
        
        updates_count = 0
        for p in personal_list:
            pk = p[0]
            dni = str(p[1]).strip()
            
            # La contraseña inicial será el DNI
            hash_generado = get_password_hash(dni)
            
            # Actualizar en BD
            db.execute(text("UPDATE dpersonal SET password_hash = :hash WHERE pkpersonal = :pk"),
                       {"hash": hash_generado, "pk": pk})
            updates_count += 1
            
        db.commit()
        print(f"¡Éxito! Se han encriptado las contraseñas de {updates_count} usuarios en la base de datos usando Bcrypt.")
        print("Las contraseñas generadas (encriptadas) usan el DNI como clave inicial.")
        
    except Exception as e:
        db.rollback()
        print(f"Error durante la encriptación: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
