import sys
import os
import json
from sqlalchemy import text

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.cfg_database import engine, SessionLocal

def main():
    print("=== Revirtiendo Contraseñas y Constraints ===")
    
    backup_path = r'c:\Proyectos\BBVA\docs_entregable\07_backups\passwords_backup_before_secure.json'
    if not os.path.exists(backup_path):
        print(f"Error: No se encontró el archivo de copia de seguridad en {backup_path}. No se puede revertir.")
        return
        
    with open(backup_path, 'r', encoding='utf-8') as f:
        backup = json.load(f)
        
    db = SessionLocal()
    try:
        # 1. Revertir dpersonal
        print("Restaurando hashes de dpersonal...")
        count_pers = 0
        for p in backup["dpersonal"]:
            pk = p["pkpersonal"]
            pwd_hash = p["password_hash"]
            db.execute(text("UPDATE dpersonal SET password_hash = :hash WHERE pkpersonal = :pk"),
                       {"hash": pwd_hash, "pk": pk})
            count_pers += 1
        print(f"Restaurados {count_pers} hashes en dpersonal.")
        
        # 2. Revertir app_usuarios
        print("Restaurando hashes de app_usuarios...")
        count_cli = 0
        for c in backup["app_usuarios"]:
            uid = c["id"]
            pwd_hash = c["password_hash"]
            db.execute(text("UPDATE app_usuarios SET password_hash = :hash WHERE id = :id"),
                       {"hash": pwd_hash, "id": uid})
            count_cli += 1
        print(f"Restaurados {count_cli} hashes en app_usuarios.")
        
        # 3. Eliminar constraint UNIQUE en dpersonal
        print("Eliminando restricción UNIQUE uq_dpersonal_numerodni si existe...")
        db.execute(text("ALTER TABLE dpersonal DROP CONSTRAINT IF EXISTS uq_dpersonal_numerodni;"))
        print("Restricción UNIQUE uq_dpersonal_numerodni eliminada.")
        
        db.commit()
        print("=== Reversión completada con éxito ===")
        
    except Exception as e:
        db.rollback()
        print("Error durante la reversión:", e)
    finally:
        db.close()

if __name__ == "__main__":
    main()
