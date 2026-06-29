import sys
import os
import json
from sqlalchemy import text
import bcrypt

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.cfg_database import engine, SessionLocal

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def main():
    print("=== Aplicando Contraseñas Seguras e Individuales ===")
    
    # 1. Cargar las credenciales generadas en el dry-run
    creds_path = r'c:\Proyectos\BBVA\docs_entregable\07_backups\temp_new_credentials.json'
    if not os.path.exists(creds_path):
        print(f"Error: No se encontró el archivo temporal de credenciales en {creds_path}. Ejecuta el dry-run primero.")
        return
        
    with open(creds_path, 'r', encoding='utf-8') as f:
        credentials = json.load(f)
        
    db = SessionLocal()
    try:
        # 2. Actualizar dpersonal (Core Personal)
        print("Actualizando dpersonal...")
        count_pers = 0
        for p in credentials["dpersonal"]:
            pk = p["pkpersonal"]
            password = p["password"]
            pwd_hash = get_password_hash(password)
            db.execute(text("UPDATE dpersonal SET password_hash = :hash WHERE pkpersonal = :pk"),
                       {"hash": pwd_hash, "pk": pk})
            count_pers += 1
        print(f"Se actualizaron {count_pers} usuarios en dpersonal.")
        
        # 3. Actualizar app_usuarios (Homebanking Clientes)
        print("Actualizando app_usuarios...")
        count_cli = 0
        for c in credentials["app_usuarios"]:
            uid = c["id"]
            password = c["password"]
            pwd_hash = get_password_hash(password)
            db.execute(text("UPDATE app_usuarios SET password_hash = :hash WHERE id = :id"),
                       {"hash": pwd_hash, "id": uid})
            count_cli += 1
        print(f"Se actualizaron {count_cli} usuarios en app_usuarios.")
        
        # 4. Proponer y aplicar la constraint UNIQUE en dpersonal.numerodni
        print("Asegurando restricción UNIQUE en dpersonal.numerodni...")
        db.execute(text("""
            ALTER TABLE dpersonal 
            ADD CONSTRAINT uq_dpersonal_numerodni UNIQUE (numerodni);
        """))
        print("Restricción UNIQUE uq_dpersonal_numerodni agregada con éxito.")
        
        db.commit()
        print("=== Aplicación de contraseñas completada con éxito ===")
        
        # Opcional: eliminar el json temporal con contraseñas en texto plano por seguridad
        if os.path.exists(creds_path):
            os.remove(creds_path)
            print("Archivo temporal de credenciales en texto plano eliminado por seguridad.")
            
    except Exception as e:
        db.rollback()
        print("Error durante la aplicación de contraseñas:", e)
    finally:
        db.close()

if __name__ == "__main__":
    main()
