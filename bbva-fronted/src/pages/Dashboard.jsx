import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import {
  Home, PiggyBank, CreditCard, ArrowLeftRight,
  User, LogOut, Bell, ChevronRight, Eye, EyeOff, Menu, X
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home, label: 'Inicio', path: '/dashboard' },
  { icon: PiggyBank, label: 'Mis Ahorros', path: '/ahorros' },
  { icon: CreditCard, label: 'Créditos', path: '/creditos' },
  { icon: ArrowLeftRight, label: 'Transferencias', path: '/transferencias' },
  { icon: User, label: 'Mi Perfil', path: '/perfil' },
]

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSaldo, setShowSaldo] = useState(true)
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo (en tu proyecto real vendrán de Supabase)
  const cuentas = [
    { tipo: 'Cuenta de Ahorros', numero: '0011-0816-01-00123456', saldo: 3250.80, moneda: 'S/' },
    { tipo: 'Cuenta Corriente', numero: '0011-0816-01-00654321', saldo: 1480.50, moneda: 'S/' },
  ]

  useEffect(() => {
    // Aquí cargarías los movimientos reales de Supabase
    const mockMovimientos = [
      { id: 1, descripcion: 'Transferencia recibida', fecha: '12/05/2026', monto: +500.00, tipo: 'ingreso' },
      { id: 2, descripcion: 'Pago servicios - Luz del Sur', fecha: '11/05/2026', monto: -89.50, tipo: 'egreso' },
      { id: 3, descripcion: 'Compra en supermercado', fecha: '10/05/2026', monto: -230.00, tipo: 'egreso' },
      { id: 4, descripcion: 'Depósito en efectivo', fecha: '09/05/2026', monto: +1000.00, tipo: 'ingreso' },
      { id: 5, descripcion: 'Pago BBVA - Tarjeta crédito', fecha: '08/05/2026', monto: -350.00, tipo: 'egreso' },
    ]
    setMovimientos(mockMovimientos)
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const nombreUsuario = user?.user_metadata?.nombres || user?.email?.split('@')[0] || 'Cliente'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '240px', backgroundColor: '#072146', color: '#fff', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : window.innerWidth < 768 ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontFamily: 'Arial Black, Arial', fontWeight: 900, fontSize: '24px', letterSpacing: '-1px', color: '#fff' }}>BBVA</span>
        </div>

        {/* User info */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#004481', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', fontSize: '18px', fontWeight: 700 }}>
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Bienvenido,</p>
          <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{nombreUsuario}</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px',
                color: location.pathname === path ? '#fff' : 'rgba(255,255,255,0.7)',
                backgroundColor: location.pathname === path ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none', fontSize: '14px', fontWeight: location.pathname === path ? 600 : 400,
                borderLeft: location.pathname === path ? '3px solid #1464A0' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '10px', width: '100%' }}>
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <header style={{ backgroundColor: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#072146' }}>
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}>
              <Bell size={20} />
            </button>
            <span style={{ fontSize: '13px', color: '#555' }}>Banca por Internet</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '32px', flex: 1 }}>
          <h1 style={{ color: '#072146', fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Mis productos</h1>

          {/* Cuentas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {cuentas.map((cuenta, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #004481' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>{cuenta.tipo}</p>
                    <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>{cuenta.numero}</p>
                  </div>
                  <button onClick={() => setShowSaldo(!showSaldo)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#004481' }}>
                    {showSaldo ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Saldo disponible</p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#072146', margin: '0 0 16px' }}>
                  {showSaldo ? `${cuenta.moneda} ${cuenta.saldo.toFixed(2)}` : '****'}
                </p>
                <Link to="/transferencias" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#004481', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                  Transferir <ChevronRight size={14} />
                </Link>
              </div>
            ))}

            {/* Tarjeta crédito */}
            <div style={{ backgroundColor: '#004481', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#fff' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 4px' }}>Tarjeta de Crédito</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>**** **** **** 4521</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 4px' }}>Línea disponible</p>
              <p style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 16px' }}>
                {showSaldo ? 'S/ 2,800.00' : '****'}
              </p>
              <Link to="/creditos" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                Ver detalle <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Últimos movimientos */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#072146', fontSize: '18px', fontWeight: 700, margin: 0 }}>Últimos movimientos</h2>
              <Link to="/ahorros" style={{ color: '#004481', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Ver todos</Link>
            </div>

            {loading ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '24px' }}>Cargando...</p>
            ) : (
              <div>
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
            )}
          </div>
        </main>
      </div>
    </div>
  )
}