import sys
import os
from sqlalchemy import text
import bcrypt

# Añadir ruta al backend para poder importar módulos
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.cfg_database import engine, SessionLocal

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def main():
    print("=== Actualizando contraseñas a patrones seguros e individuales ===")
    db = SessionLocal()
    try:
        # 1. dpersonal (Core Personal)
        # Patrón: Bv@<DNI>
        result_pers = db.execute(text("SELECT pkpersonal, numerodni FROM dpersonal"))
        personal_list = result_pers.fetchall()
        print(f"Encontrados {len(personal_list)} usuarios en dpersonal.")
        
        count_pers = 0
        for p in personal_list:
            pk = p[0]
            dni = str(p[1]).strip()
            password = f"Bv@{dni}"
            pwd_hash = get_password_hash(password)
            db.execute(text("UPDATE dpersonal SET password_hash = :hash WHERE pkpersonal = :pk"),
                       {"hash": pwd_hash, "pk": pk})
            count_pers += 1
            
        print(f"Se actualizaron {count_pers} contraseñas en dpersonal.")

        # 2. app_usuarios (Homebanking Clientes)
        # Patrón: Cli@<DNI>
        result_cli = db.execute(text("SELECT id, dni FROM app_usuarios"))
        client_list = result_cli.fetchall()
        print(f"Encontrados {len(client_list)} usuarios en app_usuarios.")
        
        count_cli = 0
        for c in client_list:
            uid = c[0]
            dni = str(c[1]).strip()
            password = f"Cli@{dni}"
            pwd_hash = get_password_hash(password)
            db.execute(text("UPDATE app_usuarios SET password_hash = :hash WHERE id = :id"),
                       {"hash": pwd_hash, "id": uid})
            count_cli += 1
            
        print(f"Se actualizaron {count_cli} contraseñas en app_usuarios.")
        db.commit()
        print("=== Actualización completada con éxito ===")
    except Exception as e:
        db.rollback()
        print("Error durante la actualización:", e)
    finally:
        db.close()

if __name__ == "__main__":
    main()
