import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bbvaCoreService } from '../services/svc_bbva_core.js'
import { useAuth } from '../hooks/useAuth.js'
import Loader from '../components/ui/Loader.jsx'
import BBVACard from '../components/ui/BBVACard.jsx'
import BBVAButton from '../components/ui/BBVAButton.jsx'
import { StatusBadge, RiskBadge, RoleBadge } from '../components/ui/Badges.jsx'
import { money, num, pct } from '../utils/format.js'

export default function SolicitudDetallePage() {
  const { codsolicitud } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accionLoading, setAccionLoading] = useState(false)
  const [accionMsg, setAccionMsg] = useState(null)

  function cargar() {
    setLoading(true)
    bbvaCoreService.getSolicitudById(codsolicitud)
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(err => {
        setError('Error al cargar detalle de solicitud')
        setLoading(false)
      })
  }

  useEffect(() => {
    cargar()
  }, [codsolicitud])

  async function handleAccion(accion) {
    setAccionLoading(true)
    setAccionMsg(null)
    try {
      if (accion === 'aprobar') await bbvaCoreService.aprobar(codsolicitud)
      if (accion === 'rechazar') await bbvaCoreService.rechazar(codsolicitud)
      if (accion === 'desembolsar') await bbvaCoreService.desembolsar(codsolicitud)
      setAccionMsg({ tipo: 'ok', texto: `Acción ${accion} completada con éxito.` })
      cargar()
    } catch (err) {
      setAccionMsg({ tipo: 'error', texto: err.response?.data?.detail || 'Ocurrió un error.' })
    } finally {
      setAccionLoading(false)
    }
  }

  if (loading) {
    return <div className="card"><Loader texto="Cargando solicitud…" /></div>
  }
  if (error || !data) {
    return (
      <div>
        <button className="btn btn--ghost" onClick={() => navigate('/solicitudes')}>← Volver</button>
        <div className="alert alert--error" style={{ marginTop: 16 }}>{error || 'Solicitud no encontrada'}</div>
      </div>
    )
  }

  const { solicitud, cliente } = data
  const est = solicitud.estado

  // Roles
  const esAsesor = user?.rol === 'asesor'
  const esAdmin = user?.rol === 'administrador'
  const esJefe = user?.rol === 'jefe_regional'
  const esRiesgos = user?.rol === 'riesgos'

  // Propietario de la solicitud (id del usuario que la creó)
  const esPropietario = solicitud?.user_id === user?.pkpersonal

  const nivel = solicitud.nivel_aprobacion
  let puedeAprobar = false
  if (nivel === 'asesor' && (esAsesor || esAdmin || esJefe || esRiesgos)) puedeAprobar = true
  if (nivel === 'administrador' && (esAdmin || esJefe || esRiesgos)) puedeAprobar = true
  if (nivel === 'jefe_regional' && (esJefe || esRiesgos)) puedeAprobar = true
  if (nivel === 'riesgos' && esRiesgos) puedeAprobar = true

  const puedeDesembolsar = (esAsesor || esAdmin || esJefe)

  const getSemaforoColor = (color) => {
    if (color === 'verde') return '#16a34a'
    if (color === 'amarillo') return '#d97706'
    if (color === 'rojo') return '#dc2626'
    return '#666'
  }

  return (
    <div>
      <BBVAButton variant="outline-light" style={{ background: '#fff', color: 'var(--c-primary-dark)', border: '1px solid var(--c-border)' }} onClick={() => navigate('/solicitudes')}>← Volver a Bandeja</BBVAButton>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        <h1 className="page-title" style={{ margin: 0, color: 'var(--c-primary-dark)' }}>Solicitud {solicitud.id.split('-')[0]}</h1>
        <StatusBadge estado={est} />
      </div>

      {accionMsg && (
        <div className={`alert ${accionMsg.tipo === 'ok' ? 'alert--info' : 'alert--error'}`}>
          {accionMsg.texto}
        </div>
      )}

      <div className="grid grid-2">
        {/* Detalle */}
        <BBVACard>
          <h3 style={{ marginTop: 0, color: 'var(--c-primary-dark)', fontSize: '16px' }}>Datos del Cliente</h3>
          <ul className="detalle-list">
            <li><span>DNI</span><span><strong>{cliente.dni}</strong></span></li>
            <li><span>Nombres</span><span><strong>{cliente.nombres} {cliente.apellidos}</strong></span></li>
            <li><span>Correo</span><span><strong>{cliente.correo}</strong></span></li>
          </ul>

          <h3 style={{ marginTop: 24, color: 'var(--c-primary-dark)', fontSize: '16px' }}>Datos Financieros</h3>
          <ul className="detalle-list">
            <li><span>Monto Solicitado</span><span><strong>{money(solicitud.monto)}</strong></span></li>
            <li><span>Plazo</span><span><strong>{solicitud.plazo_meses} meses</strong></span></li>
            <li><span>TEA</span><span><strong>{pct(solicitud.tasa_anual)}</strong></span></li>
            <li><span>Cuota Mensual</span><span><strong>{money(solicitud.cuota_mensual)}</strong></span></li>
            <li><span>Propósito</span><span><strong style={{textTransform:'capitalize'}}>{solicitud.proposito}</strong></span></li>
            <li><span>Fecha de Solicitud</span><span><strong>{new Date(solicitud.created_at).toLocaleDateString()}</strong></span></li>
          </ul>

          <h3 style={{ marginTop: 24, color: 'var(--c-primary-dark)', fontSize: '16px' }}>Evaluación Crediticia (Motor BBVA)</h3>
          <ul className="detalle-list">
            <li><span>Ingresos Declarados</span><span><strong>{money(solicitud.ingresos_mensuales)}</strong></span></li>
            <li><span>Ratio de Deuda (RDS)</span><span><strong>{solicitud.rds}%</strong></span></li>
            <li><span>Score Crediticio</span><span><strong>{solicitud.score}</strong></span></li>
            <li><span>Nivel de Aprobación</span><span><RoleBadge role={solicitud.nivel_aprobacion} /></span></li>
            <li>
              <span>Semáforo de Riesgo</span>
              <span><RiskBadge semaforo={solicitud.semaforo_rds} /></span>
            </li>
          </ul>

          <div style={{ marginTop: '24px', padding: '16px', background: '#F3F4F6', borderRadius: '8px', fontSize: '12px', color: 'var(--c-text-soft)' }}>
            <strong>Nota Interna BBVA:</strong> Esta evaluación se genera con reglas simuladas BBVA: capacidad de pago, RDS, score y nivel de aprobación por monto.
          </div>
        </BBVACard>

        {/* Acciones del flujo */}
        <BBVACard>
          <h3 style={{ marginTop: 0, color: 'var(--c-primary-dark)', fontSize: '16px' }}>Flujo de Aprobación</h3>

          {est === 'pendiente' && (
            <>
              {puedeAprobar ? (
                <>
                  <p className="page-subtitle" style={{ color: 'var(--c-text-soft)' }}>Como colaborador con rol <strong style={{ color: 'var(--c-primary-dark)' }}>{user?.rol.replace('_', ' ')}</strong>, tienes permisos para decidir sobre esta solicitud.</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <BBVAButton variant="success" disabled={accionLoading} onClick={() => handleAccion('aprobar')}>
                      Aprobar Solicitud
                    </BBVAButton>
                    <BBVAButton variant="danger" disabled={accionLoading} onClick={() => handleAccion('rechazar')}>
                      Rechazar Solicitud
                    </BBVAButton>
                  </div>
                </>
              ) : (
                <div className="alert alert--info" style={{ background: '#F3F4F6', color: 'var(--c-text-soft)' }}>
                  Tu rol ({user?.rol}) no tiene nivel suficiente para aprobar esta solicitud. Requiere nivel: <strong>{solicitud.nivel_aprobacion.replace('_', ' ')}</strong>.
                </div>
              )}
            </>
          )}

          {est === 'aprobado' && (
            <>
              <h4 style={{ color: 'var(--c-primary-dark)' }}>Desembolso</h4>
              <p className="page-subtitle" style={{ color: 'var(--c-text-soft)' }}>
                La solicitud ha sido aprobada. Procede con el desembolso a la cuenta del cliente.
              </p>
              {puedeDesembolsar ? (
                <BBVAButton variant="primary" disabled={accionLoading} onClick={() => handleAccion('desembolsar')}>
                  Desembolsar Ahora →
                </BBVAButton>
              ) : (
                <div className="alert alert--info">Solo asesores y administradores pueden ejecutar el desembolso.</div>
              )}
            </>
          )}

          {est === 'rechazado' && (
            <p className="page-subtitle" style={{ color: '#dc2626', fontWeight: 'bold' }}>La solicitud fue rechazada. No hay acciones disponibles.</p>
          )}

          {est === 'desembolsado' && (
            <div className="alert alert--info" style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
              <strong>El desembolso se ha completado con éxito.</strong>
              <p style={{ margin: '4px 0 0 0' }}>Los fondos ya están en la cuenta del cliente.</p>
            </div>
          )}
        </BBVACard>
      </div>
    </div>
  )
}
