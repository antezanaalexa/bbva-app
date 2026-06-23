from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.cfg_database import Base

class AppUsuario(Base):
    __tablename__ = 'app_usuarios'

    id = Column(Integer, primary_key=True, index=True)
    dni = Column(String(8), unique=True, nullable=False)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    correo = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(50), default='cliente')
    estado = Column(String(20), default='activo')
    # created_at no existe en la BD real, lo removemos para evitar ProgrammingError

    cuentas = relationship("Cuenta", back_populates="usuario")
    solicitudes = relationship("SolicitudPrestamo", back_populates="usuario")


class Cuenta(Base):
    __tablename__ = 'cuentas'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('app_usuarios.id'), nullable=False)
    tipo = Column(String(50), nullable=False)
    numero_cuenta = Column(String(50), unique=True, nullable=False)
    cci = Column(String(50), unique=True, nullable=False)
    saldo = Column(Numeric(15, 2), default=0.0)
    moneda = Column(String(10), default='PEN')
    tipo_cuenta = Column(String(50))
    estado = Column(String(20), default='activa')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    usuario = relationship("AppUsuario", back_populates="cuentas")
    transacciones = relationship("Transaccion", back_populates="cuenta")


class Transaccion(Base):
    __tablename__ = 'transacciones'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), nullable=False)
    cuenta_id = Column(Integer, ForeignKey('cuentas.id'), nullable=False)
    tipo = Column(String(20), nullable=False) # 'credito', 'debito'
    monto = Column(Numeric(15, 2), nullable=False)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
    descripcion = Column(String(255))

    cuenta = relationship("Cuenta", back_populates="transacciones")


class SolicitudPrestamo(Base):
    __tablename__ = 'solicitudes_prestamo'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('app_usuarios.id'), nullable=False)
    monto = Column(Numeric(15, 2), nullable=False)
    plazo_meses = Column(Integer, nullable=False)
    tasa_anual = Column(Numeric(5, 2), nullable=False)
    cuota_mensual = Column(Numeric(15, 2), nullable=False)
    proposito = Column(String(50), nullable=False)
    ingresos_mensuales = Column(Numeric(15, 2), nullable=False)
    rds = Column(Numeric(5, 2), nullable=False)
    semaforo_rds = Column(String(20), nullable=False)
    score = Column(Integer, nullable=False)
    nivel_aprobacion = Column(String(50), nullable=False)
    estado = Column(String(50), default='pendiente')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("AppUsuario", back_populates="solicitudes")
