import React, { useState, useEffect } from 'react'
import { bbvaCoreService } from '../services/svc_bbva_core.js'
import { useAuth } from '../hooks/useAuth.js'
import { puede } from '../utils/permisos.js'
import KpiCard from '../components/ui/KpiCard.jsx'
import Semaforo from '../components/ui/Semaforo.jsx'
import GraficoTorta from '../components/ui/GraficoTorta.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num } from '../utils/format.js'
import { FileText, Clock, CheckCircle, XCircle, DollarSign, Wallet, TrendingUp } from 'lucide-react'
import BBVACard from '../components/ui/BBVACard.jsx'
import MiCarteraDashboard from './MiCarteraDashboard.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: '#dc2626', background: '#fef2f2', borderRadius: '16px', border: '1px solid #fee2e2', margin: 20, fontFamily: 'monospace' }}>
          <h3 style={{ marginTop: 0 }}>Error de Renderizado (Frontend)</h3>
          <p style={{ fontWeight: 'bold' }}>{this.state.error?.toString()}</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

function DashboardInstitucional() {
  const { user } = useAuth()
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    bbvaCoreService.getKpis()
      .then(data => {
        setKpis(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Error al cargar KPIs')
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ color: 'var(--c-primary-dark)' }}>Panel de Gestión Crediticia</h1>
          <p className="page-subtitle">Seguimiento de solicitudes, riesgo y desembolsos BBVA</p>
        </div>
      </div>

      {loading && (
        <div className="card">
          <Loader texto="Cargando indicadores…" />
        </div>
      )}

      {!loading && kpis && (
        <>
          <div className="grid grid-kpi" style={{ marginBottom: 24, gap: '20px' }}>
            <KpiCard label="Total Solicitudes" valor={num(kpis.total_solicitudes)} Icon={FileText} />
            <KpiCard label="Pendientes" valor={num(kpis.pendientes)} color="var(--c-amarillo)" Icon={Clock} />
            <KpiCard label="Aprobadas" valor={num(kpis.aprobadas)} color="var(--c-verde)" Icon={CheckCircle} />
            <KpiCard label="Rechazadas" valor={num(kpis.rechazadas)} color="var(--c-rojo)" Icon={XCircle} />
            <KpiCard label="Desembolsadas" valor={num(kpis.desembolsadas)} color="var(--c-primary)" Icon={DollarSign} />
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: 24 }}>
            {/* Massive Dark Card for Monto Solicitado */}
            <section style={{ background: 'var(--c-primary-dark)', borderRadius: '32px', padding: '40px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                Monto Solicitado Total
              </p>
              <h2 style={{ fontSize: '48px', fontWeight: '800', margin: 0, lineHeight: '1.2' }}>
                {money(kpis.monto_solicitado)}
              </h2>
            </section>

            {/* Massive Dark Card for Monto Desembolsado */}
            <section style={{ background: 'var(--c-primary-dark)', borderRadius: '32px', padding: '40px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(10,190,105,0.15) 0%, rgba(10,190,105,0) 70%)', borderRadius: '50%' }}></div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                Monto Desembolsado
              </p>
              <h2 style={{ fontSize: '48px', fontWeight: '800', margin: 0, lineHeight: '1.2' }}>
                {money(kpis.monto_desembolsado)}
              </h2>
            </section>
          </div>

          <div className="grid grid-2" style={{ marginBottom: 20 }}>
            <BBVACard>
              <h3 style={{ marginTop: 0, color: 'var(--c-primary-dark)' }}>Estado de Solicitudes</h3>
              <GraficoTorta data={[
                { name: 'Pendientes', value: kpis.pendientes },
                { name: 'Aprobadas', value: kpis.aprobadas },
                { name: 'Rechazadas', value: kpis.rechazadas },
                { name: 'Desembolsadas', value: kpis.desembolsadas }
              ]} />
            </BBVACard>
          </div>
        </>
      )}
      {!loading && error && (
        <div className="alert alert--error">{error}</div>
      )}
    </div>
  )
}

/**
 * Selector por rol:
 *  - jefaturas/gerencia/operaciones → dashboard institucional (toda la cartera).
 *  - asesor (u otros) → dashboard de su propia cartera.
 */
export default function DashboardPage() {
  const { user } = useAuth()
  
  return (
    <ErrorBoundary>
      {puede(user?.rol, 'ver_dashboard_institucional') ? (
        <DashboardInstitucional />
      ) : (
        <MiCarteraDashboard />
      )}
    </ErrorBoundary>
  )
}
