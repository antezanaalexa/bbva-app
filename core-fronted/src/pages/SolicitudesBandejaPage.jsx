import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, ClipboardList
} from 'lucide-react'
import { bbvaCoreService } from '../services/svc_bbva_core.js'
import { useAuth } from '../hooks/useAuth.js'
import Loader from '../components/ui/Loader.jsx'
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
      <h1 className="page-title">Bandeja de Evaluación Crediticia</h1>
      <p className="page-subtitle">
        Consulta y gestiona las solicitudes de crédito provenientes de Homebanking.
      </p>

      <div className="wb-top">
        <div className="wb-panel" style={{ flex: 1 }}>
          <h3 className="wb-panel__title">Datos del usuario</h3>
          <div className="wb-fields">
            <div className="wb-field">
              <label>Usuario</label>
              <span className="val">{user?.nombre || '—'}</span>
            </div>
            <div className="wb-field">
              <label>Rol</label>
              <span className="val">{user?.rol || '—'}</span>
            </div>
            <div className="wb-field">
              <label>Agencia</label>
              <span className="val">{user?.codagencia || '—'}</span>
            </div>
          </div>
        </div>
      </div>

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
                  <td><strong>{s.id}</strong></td>
                  <td>{s.cliente}</td>
                  <td className="num">{money(s.monto)}</td>
                  <td className="num">{s.plazo_meses}</td>
                  <td className="num">{s.rds}%</td>
                  <td>{s.score}</td>
                  <td style={{ textTransform: 'capitalize' }}>{s.nivel_aprobacion.replace('_', ' ')}</td>
                  <td>
                    <span style={{
                      display: 'inline-block', width: 12, height: 12, borderRadius: '50%',
                      backgroundColor: getSemaforoColor(s.semaforo_rds)
                    }}></span>
                  </td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 600 }}>{s.estado}</td>
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

      <div className="wb-toolbar">
        <button className="wb-tool" disabled={!sel} onClick={() => abrir(sel?.id)}>
          <ClipboardList size={20} />
          Revisar y Decidir
        </button>
      </div>
    </div>
  )
}

