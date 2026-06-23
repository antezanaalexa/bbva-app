from pydantic import BaseModel, Field
from typing import Optional


# ─── CUENTAS ──────────────────────────────────────────────────────────────────

class CuentaResponse(BaseModel):
    id: str
    user_id: str
    tipo: str
    numero_cuenta: str
    saldo: float
    moneda: str
    alias: Optional[str] = None
    cci: Optional[str] = None
    tipo_cuenta: Optional[str] = None
    estado: Optional[str] = None


# ─── TRANSACCIONES ────────────────────────────────────────────────────────────

class TransaccionRequest(BaseModel):
    user_id: str
    cuenta_id: str
    tipo: str = Field(description="debito o credito")
    descripcion: str
    monto: float = Field(gt=0)


class TransferenciaRequest(BaseModel):
    user_id: str
    cuenta_origen_id: str
    cuenta_destino_numero: str
    monto: float = Field(gt=0)
    concepto: Optional[str] = "Transferencia BBVA"


class TransaccionResponse(BaseModel):
    id: str
    tipo: str
    descripcion: str
    monto: float
    fecha: str


# ─── AHORROS ──────────────────────────────────────────────────────────────────

class AhorroDepositoRequest(BaseModel):
    user_id: str
    cuenta_id: str
    monto: float = Field(gt=0)
    descripcion: Optional[str] = "Depósito"


class AhorroRetiroRequest(BaseModel):
    user_id: str
    cuenta_id: str
    monto: float = Field(gt=0)
    descripcion: Optional[str] = "Retiro"


# ─── CRÉDITOS ─────────────────────────────────────────────────────────────────

class CreditoSimularRequest(BaseModel):
    monto: float = Field(gt=0, le=150000)
    plazo_meses: int = Field(ge=6, le=60)
    tasa_anual: float = Field(gt=0, le=50, default=18.5)


class CreditoSolicitudRequest(BaseModel):
    user_id: str
    monto: float = Field(gt=0, le=150000)
    plazo_meses: int = Field(ge=6, le=60)
    tasa_anual: float = Field(gt=0, le=50, default=18.5)
    proposito: Optional[str] = "consumo"
    ingresos_mensuales: float = Field(gt=0)


class CreditoSimularResponse(BaseModel):
    monto: float
    cuota_mensual: float
    total_pagar: float
    total_interes: float
    plazo_meses: int
    tasa_anual: float


# ─── PAGOS ────────────────────────────────────────────────────────────────────

class PagoRequest(BaseModel):
    user_id: str
    servicio: str
    numero_contrato: str
    monto: float = Field(gt=0)