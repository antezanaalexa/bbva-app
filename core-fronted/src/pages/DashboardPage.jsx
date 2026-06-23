import { useState, useEffect } from 'react'
import { bbvaCoreService } from '../services/svc_bbva_core.js'
import { useAuth } from '../hooks/useAuth.js'
import { puede } from '../utils/permisos.js'
import KpiCard from '../components/ui/KpiCard.jsx'
import Semaforo from '../components/ui/Semaforo.jsx'
import GraficoTorta from '../components/ui/GraficoTorta.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num } from '../utils/format.js'

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
          <h1 className="page-title">Dashboard Institucional BBVA</h1>
          <p className="page-subtitle">Indicadores principales de solicitudes de crédito.</p>
        </div>
      </div>

      {loading && (
        <div className="card">
          <Loader texto="Cargando indicadores…" />
        </div>
      )}

      {!loading && kpis && (
        <>
          <div className="grid grid-kpi" style={{ marginBottom: 20 }}>
            <KpiCard label="Total Solicitudes" valor={num(kpis.total_solicitudes)} />
            <KpiCard label="Pendientes" valor={num(kpis.pendientes)} color="var(--c-amarillo)" />
            <KpiCard label="Aprobadas" valor={num(kpis.aprobadas)} color="var(--c-verde)" />
            <KpiCard label="Rechazadas" valor={num(kpis.rechazadas)} color="var(--c-rojo)" />
            <KpiCard label="Desembolsadas" valor={num(kpis.desembolsadas)} color="var(--c-primary)" />
            <KpiCard label="Monto Solicitado" valor={money(kpis.monto_solicitado)} />
            <KpiCard label="Monto Desembolsado" valor={money(kpis.monto_desembolsado)} color="var(--c-verde)" />
          </div>

          <div className="grid grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Estado de Solicitudes</h3>
              <GraficoTorta data={[
                { name: 'Pendientes', value: kpis.pendientes },
                { name: 'Aprobadas', value: kpis.aprobadas },
                { name: 'Rechazadas', value: kpis.rechazadas },
                { name: 'Desembolsadas', value: kpis.desembolsadas }
              ]} />
            </div>
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
  return puede(user?.rol, 'ver_dashboard_institucional') ? (
    <DashboardInstitucional />
  ) : (
    <MiCarteraDashboard />
  )
}
