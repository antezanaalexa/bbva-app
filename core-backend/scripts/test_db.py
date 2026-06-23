import sys
import os

# Add core-backend to sys.path
sys.path.append(r"c:\Proyectos\BBVA\core-backend")

from app.core.cfg_database import SessionLocal
from app.controllers.ctl_core_bbva import get_solicitudes

db = SessionLocal()
try:
    sols = get_solicitudes(db)
    print(sols)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
