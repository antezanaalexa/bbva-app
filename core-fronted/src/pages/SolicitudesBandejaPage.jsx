import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, ClipboardList
} from 'lucide-react'
import { bbvaCoreService } from '../services/svc_bbva_core.js'
import { useAuth } from '../hooks/useAuth.js'
import Loader from '../components/ui/Loader.jsx'
import BBVACard from '../components/ui/BBVACard.jsx'
import BBVAButton from '../components/ui/BBVAButton.jsx'
import { StatusBadge, RiskBadge, RoleBadge } from '../components/ui/Badges.jsx'
import { money } from '../utils/format.js'

export default function SolicitudesBandejaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sel, setSel] = useState(null)

  function cargar() {
    setLoading(true)
    bbvaCoreService.getSolicitudes()
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Error al cargar solicitudes')
        setLoading(false)
      })
  }

  useEffect(() => {
    cargar()
  }, [])

  function abrir(id) {
    if (id) navigate(`/solicitudes/${id}`)
  }

  // Semaforo BBVA logic
  const getSemaforoColor = (color) => {
    if (color === 'verde') return '#16a34a'
    if (color === 'amarillo') return '#d97706'
    if (color === 'rojo') return '#dc2626'
    return '#666'
  }

  return (
    <div>
      <h1 className="page-title" style={{ color: 'var(--c-primary-dark)' }}>Bandeja de Solicitudes</h1>
      <p className="page-subtitle">Solicitudes generadas desde Homebanking BBVA</p>

      <BBVACard style={{ marginBottom: '24px', padding: '16px 24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--c-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Datos del Colaborador</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--c-text-soft)', fontWeight: '600' }}>Usuario</label>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>{user?.nombres} {user?.apellidos}</div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--c-text-soft)', fontWeight: '600' }}>Rol en el Core</label>
            <div style={{ marginTop: '4px' }}><RoleBadge role={user?.rol} /></div>
          </div>
        </div>
      </BBVACard>

      <div className="wb-panel" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h3 className="wb-panel__title">Solicitud seleccionada</h3>
            <div className="wb-fields">
              <div className="wb-field">
                <label>Cliente</label>
                <span className="val">{sel?.cliente ?? '—'}</span>
              </div>
              <div className="wb-field">
                <label>DNI</label>
                <span className="val">{sel?.dni ?? '—'}</span>
              </div>
              <div className="wb-field">
                <label>Monto</label>
                <span className="val">{sel ? money(sel.monto) : '—'}</span>
              </div>
              <div className="wb-field">
                <label>Estado</label>
                <span className="val" style={{ textTransform: 'uppercase' }}>
                  {sel?.estado ?? '—'}
                </span>
              </div>
            </div>
          </div>
          <button className="btn btn--ghost" onClick={cargar} title="Refrescar">
            <RefreshCw size={16} style={{ verticalAlign: '-3px' }} /> Actualizar
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <div style={{ padding: 20 }}><Loader texto="Cargando solicitudes…" /></div>}
        {error && <div className="alert alert--error" style={{ margin: 16 }}>{error}</div>}

        {!loading && !error && (
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th className="num">Monto</th>
                <th className="num">Plazo</th>
                <th className="num">RDS</th>
                <th>Score</th>
                <th>Nivel Aprobación</th>
                <th>Semáforo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr
                  key={s.id}
                  className={sel?.id === s.id ? 'sel' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSel(s)}
                  onDoubleClick={() => abrir(s.id)}
                >
                  <td><span style={{ fontSize: '11px', color: 'var(--c-text-soft)' }}>{s.id.split('-')[0]}</span></td>
                  <td style={{ fontWeight: '600', color: 'var(--c-primary-dark)' }}>{s.cliente}</td>
                  <td className="num">{money(s.monto)}</td>
                  <td className="num">{s.plazo_meses}</td>
                  <td className="num">{s.rds}%</td>
                  <td style={{ fontWeight: '700' }}>{s.score}</td>
                  <td><RoleBadge role={s.nivel_aprobacion} /></td>
                  <td><RiskBadge semaforo={s.semaforo_rds} /></td>
                  <td><StatusBadge estado={s.estado} /></td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={9} className="page-subtitle" style={{ padding: 20 }}>
                    No hay solicitudes pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <BBVAButton disabled={!sel} onClick={() => abrir(sel?.id)}>
          <ClipboardList size={18} style={{ marginRight: '8px', verticalAlign: '-3px' }} />
          Revisar y Decidir
        </BBVAButton>
      </div>
    </div>
  )
}

