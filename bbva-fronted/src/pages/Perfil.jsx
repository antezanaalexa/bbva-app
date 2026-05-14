import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import PageShell from '../layouts/PageShell'

export default function Perfil() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const nombre = user?.user_metadata?.nombres || 'Cliente'
  const apellido = user?.user_metadata?.apellidos || 'BBVA'
  const dni = user?.user_metadata?.dni || '--------'
  const emailReal = user?.user_metadata?.email_real || user?.email || '---'

  return (
    <PageShell title="Mi Perfil">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'flex-start' }}>

        {/* Avatar card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#004481', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', color: '#fff', fontWeight: 700 }}>
            {nombre.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ color: '#072146', fontWeight: 700, margin: '0 0 4px', fontSize: '16px' }}>{nombre} {apellido}</h3>
          <p style={{ color: '#888', fontSize: '13px', margin: '0 0 24px' }}>DNI: {dni}</p>
          <button
            onClick={async () => { await signOut(); navigate('/login') }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', color: '#cc0000', background: 'none', border: '1px solid #cc0000', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>

        {/* Info card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#072146', fontWeight: 700, marginBottom: '20px', fontSize: '18px' }}>Datos personales</h3>
          {[
            ['Nombres', nombre],
            ['Apellidos', apellido],
            ['DNI', dni],
            ['Email', emailReal],
            ['Teléfono', '(01) 595-0000'],
            ['Dirección', 'Lima, Perú'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>{label}</span>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
          <button style={{ marginTop: '20px', backgroundColor: '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Editar datos
          </button>
        </div>
      </div>
    </PageShell>
  )
}