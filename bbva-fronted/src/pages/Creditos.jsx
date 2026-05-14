import { useState } from 'react'
import PageShell from '../layouts/PageShell'

export default function Creditos() {
  const [tab, setTab] = useState('activos')
  const [simMonto, setSimMonto] = useState(10000)
  const [simPlazo, setSimPlazo] = useState(24)

  const tea = 0.018
  const cuota = ((simMonto * tea) / (1 - Math.pow(1 + tea, -simPlazo))).toFixed(2)

  const cronograma = [
    { cuota: 1, fecha: '10/06/2026', capital: 399.50, interes: 250.50, total: 650.00, estado: 'Pendiente' },
    { cuota: 2, fecha: '10/07/2026', capital: 406.68, interes: 243.32, total: 650.00, estado: 'Pendiente' },
    { cuota: 3, fecha: '10/08/2026', capital: 413.99, interes: 236.01, total: 650.00, estado: 'Pendiente' },
  ]

  return (
    <PageShell title="Créditos">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#fff', borderRadius: '8px', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: 'fit-content' }}>
        {[['activos', 'Préstamos activos'], ['simulador', 'Simulador'], ['solicitar', 'Solicitar crédito']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, backgroundColor: tab === key ? '#004481' : 'transparent', color: tab === key ? '#fff' : '#555', transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Activos */}
      {tab === 'activos' && (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ color: '#072146', fontWeight: 700, fontSize: '18px', margin: '0 0 4px' }}>Préstamo Personal</h3>
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>N° PE-2026-001</p>
            </div>
            <span style={{ backgroundColor: '#e6f7ee', color: '#00a859', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Al día</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[['Monto original', 'S/ 15,000'], ['Saldo pendiente', 'S/ 12,400'], ['Próxima cuota', 'S/ 650.00']].map(([lbl, val]) => (
              <div key={lbl}>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>{lbl}</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#072146', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Próximo vencimiento: <strong>10/06/2026</strong></p>

          <h4 style={{ color: '#072146', fontWeight: 700, marginBottom: '12px' }}>Cronograma de pagos</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                {['Cuota', 'Fecha', 'Capital', 'Interés', 'Total', 'Estado'].map(h => (
                  <th key={h} style={{ padding: '10px', textAlign: 'left', color: '#555', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cronograma.map((row) => (
                <tr key={row.cuota} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px' }}>{row.cuota}</td>
                  <td style={{ padding: '10px' }}>{row.fecha}</td>
                  <td style={{ padding: '10px' }}>S/ {row.capital}</td>
                  <td style={{ padding: '10px' }}>S/ {row.interes}</td>
                  <td style={{ padding: '10px', fontWeight: 700 }}>S/ {row.total}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{row.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Simulador */}
      {tab === 'simulador' && (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '500px' }}>
          <h3 style={{ color: '#072146', fontWeight: 700, marginBottom: '24px' }}>Simulador de crédito</h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={lbl}>Monto del préstamo: <strong>S/ {simMonto.toLocaleString()}</strong></label>
            <input type="range" min="1000" max="50000" step="500" value={simMonto} onChange={e => setSimMonto(+e.target.value)} style={{ width: '100%', accentColor: '#004481' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#aaa' }}><span>S/ 1,000</span><span>S/ 50,000</span></div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={lbl}>Plazo: <strong>{simPlazo} meses</strong></label>
            <input type="range" min="6" max="60" step="6" value={simPlazo} onChange={e => setSimPlazo(+e.target.value)} style={{ width: '100%', accentColor: '#004481' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#aaa' }}><span>6 meses</span><span>60 meses</span></div>
          </div>
          <div style={{ backgroundColor: '#f0f4ff', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: '#555', margin: '0 0 4px' }}>Cuota mensual estimada</p>
            <p style={{ fontSize: '36px', fontWeight: 800, color: '#004481', margin: '0 0 4px' }}>S/ {cuota}</p>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>TEA 1.8% mensual • Tasa referencial</p>
          </div>
          <button onClick={() => setTab('solicitar')} style={{ width: '100%', backgroundColor: '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            Solicitar este crédito
          </button>
        </div>
      )}

      {/* Solicitar */}
      {tab === 'solicitar' && <SolicitarCredito />}
    </PageShell>
  )
}

function SolicitarCredito() {
  const [form, setForm] = useState({ monto: '', plazo: '12', motivo: '', ingresos: '' })
  const [enviado, setEnviado] = useState(false)
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  if (enviado) return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '48px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
      <h3 style={{ color: '#00a859', fontWeight: 700, fontSize: '22px', marginBottom: '8px' }}>¡Solicitud enviada!</h3>
      <p style={{ color: '#555', marginBottom: '8px' }}>Tu solicitud está siendo evaluada. Te notificaremos por correo.</p>
      <p style={{ color: '#888', fontSize: '13px' }}>Estado: <strong style={{ color: '#004481' }}>En evaluación</strong></p>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '500px' }}>
      <h3 style={{ color: '#072146', fontWeight: 700, marginBottom: '24px' }}>Solicitar crédito</h3>
      <label style={lbl}>Monto solicitado (S/)</label>
      <input name="monto" placeholder="Ej: 5000" value={form.monto} onChange={handleChange} style={inp} />
      <label style={lbl}>Plazo</label>
      <select name="plazo" value={form.plazo} onChange={handleChange} style={inp}>
        {[6,12,18,24,36,48,60].map(p => <option key={p} value={p}>{p} meses</option>)}
      </select>
      <label style={lbl}>Ingresos mensuales (S/)</label>
      <input name="ingresos" placeholder="Ej: 3000" value={form.ingresos} onChange={handleChange} style={inp} />
      <label style={lbl}>Motivo del crédito</label>
      <select name="motivo" value={form.motivo} onChange={handleChange} style={inp}>
        <option value="">Selecciona un motivo</option>
        <option>Educación</option><option>Salud</option><option>Viaje</option><option>Negocio</option><option>Otro</option>
      </select>
      <button
        onClick={() => form.monto && form.ingresos && form.motivo && setEnviado(true)}
        style={{ width: '100%', backgroundColor: '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}
      >
        Enviar solicitud
      </button>
    </div>
  )
}

const inp = { width: '100%', padding: '12px 16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', color: '#333', boxSizing: 'border-box', marginBottom: '16px', outline: 'none', backgroundColor: '#fff' }
const lbl = { display: 'block', fontSize: '12px', color: '#555', marginBottom: '6px' }