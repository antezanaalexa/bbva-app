import sys
sys.path.append(r"c:\Proyectos\BBVA\core-backend")

from app.core.cfg_database import SessionLocal
from app.controllers.ctl_core_bbva import desembolsar

db = SessionLocal()
try:
    print(desembolsar(db, "db05bd87-87e4-4007-851e-7fa157edd05c"))
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
