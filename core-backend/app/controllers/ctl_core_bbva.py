from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.mdl_bbva import SolicitudPrestamo, AppUsuario, Cuenta, Transaccion

def get_kpis(db: Session):
    total_solicitudes = db.query(func.count(SolicitudPrestamo.id)).scalar() or 0
    pendientes = db.query(func.count(SolicitudPrestamo.id)).filter(SolicitudPrestamo.estado == 'pendiente').scalar() or 0
    aprobadas = db.query(func.count(SolicitudPrestamo.id)).filter(SolicitudPrestamo.estado == 'aprobado').scalar() or 0
    rechazadas = db.query(func.count(SolicitudPrestamo.id)).filter(SolicitudPrestamo.estado == 'rechazado').scalar() or 0
    desembolsadas = db.query(func.count(SolicitudPrestamo.id)).filter(SolicitudPrestamo.estado == 'desembolsado').scalar() or 0
    monto_solicitado = db.query(func.sum(SolicitudPrestamo.monto)).scalar() or 0.0
    monto_desembolsado = db.query(func.sum(SolicitudPrestamo.monto)).filter(SolicitudPrestamo.estado == 'desembolsado').scalar() or 0.0

    return {
        "total_solicitudes": total_solicitudes,
        "pendientes": pendientes,
        "aprobadas": aprobadas,
        "rechazadas": rechazadas,
        "desembolsadas": desembolsadas,
        "monto_solicitado": float(monto_solicitado),
        "monto_desembolsado": float(monto_desembolsado)
    }

def get_solicitudes(db: Session):
    solicitudes = db.query(SolicitudPrestamo, AppUsuario).join(AppUsuario).order_by(SolicitudPrestamo.created_at.desc()).all()
    result = []
    for sol, user in solicitudes:
        moneda = "PEN"
        if sol.cuenta_destino_id:
            cuenta = db.query(Cuenta).filter(Cuenta.id == sol.cuenta_destino_id).first()
            if cuenta:
                moneda = cuenta.moneda
        result.append({
            "id": sol.id,
            "user_id": sol.user_id,
            "cliente": f"{user.nombres} {user.apellidos}",
            "dni": user.dni,
            "monto": float(sol.monto),
            "plazo_meses": sol.plazo_meses,
            "rds": float(sol.rds),
            "semaforo_rds": sol.semaforo_rds,
            "score": sol.score,
            "nivel_aprobacion": sol.nivel_aprobacion,
            "estado": sol.estado,
            "created_at": sol.created_at,
            "moneda": moneda
        })
    return result

def get_solicitudes_por_nivel(db: Session, nivel: str):
    """Retorna solo las solicitudes cuyo nivel_aprobacion coincida con el nivel dado."""
    solicitudes = (
        db.query(SolicitudPrestamo, AppUsuario)
        .join(AppUsuario)
        .filter(func.lower(SolicitudPrestamo.nivel_aprobacion) == nivel.lower())
        .order_by(SolicitudPrestamo.created_at.desc())
        .all()
    )
    result = []
    for sol, user in solicitudes:
        moneda = "PEN"
        if sol.cuenta_destino_id:
            cuenta = db.query(Cuenta).filter(Cuenta.id == sol.cuenta_destino_id).first()
            if cuenta:
                moneda = cuenta.moneda
        result.append({
            "id": sol.id,
            "user_id": sol.user_id,
            "cliente": f"{user.nombres} {user.apellidos}",
            "dni": user.dni,
            "monto": float(sol.monto),
            "plazo_meses": sol.plazo_meses,
            "rds": float(sol.rds),
            "semaforo_rds": sol.semaforo_rds,
            "score": sol.score,
            "nivel_aprobacion": sol.nivel_aprobacion,
            "estado": sol.estado,
            "created_at": sol.created_at,
            "moneda": moneda
        })
    return result


def get_solicitud(db: Session, solicitud_id: str):
    solicitud = db.query(SolicitudPrestamo).filter(SolicitudPrestamo.id == solicitud_id).first()
    if not solicitud:
        return None
    user = db.query(AppUsuario).filter(AppUsuario.id == solicitud.user_id).first()
    
    moneda = "PEN"
    if solicitud.cuenta_destino_id:
        cuenta = db.query(Cuenta).filter(Cuenta.id == solicitud.cuenta_destino_id).first()
        if cuenta:
            moneda = cuenta.moneda

    return {
        "solicitud": {
            "id": solicitud.id,
            "user_id": solicitud.user_id,
            "monto": float(solicitud.monto),
            "plazo_meses": solicitud.plazo_meses,
            "tasa_anual": float(solicitud.tasa_anual),
            "cuota_mensual": float(solicitud.cuota_mensual),
            "proposito": solicitud.proposito,
            "ingresos_mensuales": float(solicitud.ingresos_mensuales),
            "rds": float(solicitud.rds),
            "semaforo_rds": solicitud.semaforo_rds,
            "score": solicitud.score,
            "nivel_aprobacion": solicitud.nivel_aprobacion,
            "estado": solicitud.estado,
            "created_at": solicitud.created_at,
            "moneda": moneda
        },
        "cliente": {
            "id": user.id,
            "dni": user.dni,
            "nombres": user.nombres,
            "apellidos": user.apellidos,
            "correo": user.correo
        }
    }

def update_estado(db: Session, solicitud_id: str, estado: str):
    solicitud = db.query(SolicitudPrestamo).filter(SolicitudPrestamo.id == solicitud_id).first()
    if not solicitud:
        return None
    solicitud.estado = estado
    db.commit()
    db.refresh(solicitud)
    return True

def desembolsar(db: Session, solicitud_id: str):
    solicitud = db.query(SolicitudPrestamo).filter(SolicitudPrestamo.id == solicitud_id).first()
    if not solicitud or solicitud.estado != 'aprobado':
        return False, "Solicitud no encontrada o no está en estado aprobado."
    
    if solicitud.cuenta_destino_id:
        cuenta = db.query(Cuenta).filter(Cuenta.id == solicitud.cuenta_destino_id).first()
    else:
        cuenta = db.query(Cuenta).filter(Cuenta.user_id == solicitud.user_id).first()
        
    if not cuenta:
        return False, "Cliente no tiene cuenta asociada para desembolsar."
    
    # Actualizar saldo
    cuenta.saldo = float(cuenta.saldo) + float(solicitud.monto)
    
    # Insertar transacción
    tx = Transaccion(
        user_id=solicitud.user_id,
        cuenta_id=cuenta.id,
        tipo='credito',
        monto=solicitud.monto,
        descripcion=f"Desembolso de préstamo {solicitud.id}"
    )
    db.add(tx)
    
    # Cambiar estado
    solicitud.estado = 'desembolsado'
    
    db.commit()
    return True, "Desembolso exitoso"
