import { Download } from 'lucide-react'
import PageShell from '../layouts/PageShell'

export default function Ahorros() {
  const movimientos = [
    { id: 1, descripcion: 'Transferencia recibida - Juan Pérez', fecha: '12/05/2026', monto: +500.00, tipo: 'ingreso' },
    { id: 2, descripcion: 'Pago servicios - Luz del Sur', fecha: '11/05/2026', monto: -89.50, tipo: 'egreso' },
    { id: 3, descripcion: 'Compra - Plaza Vea', fecha: '10/05/2026', monto: -230.00, tipo: 'egreso' },
    { id: 4, descripcion: 'Depósito en efectivo', fecha: '09/05/2026', monto: +1000.00, tipo: 'ingreso' },
    { id: 5, descripcion: 'Pago BBVA - Tarjeta crédito', fecha: '08/05/2026', monto: -350.00, tipo: 'egreso' },
    { id: 6, descripcion: 'Abono sueldo - Empresa SAC', fecha: '07/05/2026', monto: +2500.00, tipo: 'ingreso' },
  ]

  return (
    <PageShell title="Mis Ahorros">
      {/* Saldo */}
      <div style={{ backgroundColor: '#004481', borderRadius: '12px', padding: '28px', color: '#fff', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Cuenta de Ahorros • 0011-0816-01-00123456</p>
        <p style={{ fontSize: '36px', fontWeight: 700, margin: '8px 0' }}>S/ 3,250.80</p>
        <div style={{ display: 'flex', gap: '32px', marginTop: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>Saldo contable</p>
            <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>S/ 3,250.80</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>Tasa de interés</p>
            <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>1.50% anual</p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[['📤', 'Transferir'], ['📥', 'Depositar'], ['📄', 'Estado cuenta'], ['⬇️', 'Descargar']].map(([ico, lbl]) => (
          <button key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#004481', fontWeight: 600, minWidth: '80px' }}>
            <span style={{ fontSize: '22px' }}>{ico}</span>{lbl}
          </button>
        ))}
      </div>

      {/* Movimientos */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#072146', fontSize: '18px', fontWeight: 700, margin: 0 }}>Estado de cuenta</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
            <Download size={14} /> Descargar PDF
          </button>
        </div>

        {movimientos.map((mov) => (
          <div key={mov.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: mov.tipo === 'ingreso' ? '#e6f7ee' : '#ffeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {mov.tipo === 'ingreso' ? '↓' : '↑'}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 500, color: '#333' }}>{mov.descripcion}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{mov.fecha}</p>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: mov.tipo === 'ingreso' ? '#00a859' : '#cc0000' }}>
              {mov.tipo === 'ingreso' ? '+' : ''}S/ {Math.abs(mov.monto).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </PageShell>
  )
}