from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.cfg_database import get_db
from app.core.cfg_auth import get_current_user
from app.controllers import ctl_core_bbva
from app.core.cfg_roles import puede_rechazar, puede_aprobar
from app.models.mdl_bbva import SolicitudPrestamo

router = APIRouter()

@router.get("/dashboard/kpis")
def get_kpis(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ctl_core_bbva.get_kpis(db)

@router.get("/solicitudes/mias")
def get_solicitudes_mias(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retorna solo las solicitudes de nivel 'asesor' si el rol del usuario es asesor.
    Para roles superiores, retorna todas las solicitudes.
    """
    rol = (current_user.get("rol") or "").strip().lower()
    if rol == "asesor":
        return ctl_core_bbva.get_solicitudes_por_nivel(db, "asesor")
    return ctl_core_bbva.get_solicitudes(db)

@router.get("/solicitudes")
def get_solicitudes(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ctl_core_bbva.get_solicitudes(db)

@router.get("/solicitudes/{solicitud_id}")
def get_solicitud(solicitud_id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    data = ctl_core_bbva.get_solicitud(db, solicitud_id)
    if not data:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    return data

@router.post("/solicitudes/{solicitud_id}/aprobar")
def aprobar_solicitud(solicitud_id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Obtener la solicitud completa
    solicitud = db.query(SolicitudPrestamo).filter(SolicitudPrestamo.id == solicitud_id).first()
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    # Verificar permiso de aprobación según rol y nivel de la solicitud
    if not puede_aprobar(current_user.get("rol"), solicitud.nivel_aprobacion):
        raise HTTPException(status_code=403, detail="No tienes permiso para aprobar esta solicitud")
    success = ctl_core_bbva.update_estado(db, solicitud_id, "aprobado")
    if not success:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    return {"message": "Solicitud aprobada correctamente"}

@router.post("/solicitudes/{solicitud_id}/rechazar")
def rechazar_solicitud(solicitud_id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Obtener la solicitud completa
    solicitud = db.query(SolicitudPrestamo).filter(SolicitudPrestamo.id == solicitud_id).first()
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    # Verificar permiso de rechazo según rol y nivel de la solicitud
    if not puede_rechazar(current_user.get("rol"), solicitud.nivel_aprobacion):
        raise HTTPException(status_code=403, detail="No tienes permiso para rechazar esta solicitud")

    success = ctl_core_bbva.update_estado(db, solicitud_id, "rechazado")
    if not success:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    return {"message": "Solicitud rechazada"}

@router.post("/solicitudes/{solicitud_id}/desembolsar")
def desembolsar_solicitud(solicitud_id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    rol = current_user.get("rol")
    if rol not in ["asesor", "administrador", "jefe_regional"]:
        raise HTTPException(status_code=403, detail="Solo asesor, administrador o jefe regional pueden desembolsar")
    
    success, msg = ctl_core_bbva.desembolsar(db, solicitud_id)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"message": msg}
