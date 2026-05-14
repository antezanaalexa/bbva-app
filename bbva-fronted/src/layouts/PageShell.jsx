import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, PiggyBank, CreditCard, ArrowLeftRight, User, LogOut, Bell } from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home, label: 'Inicio', path: '/dashboard' },
  { icon: PiggyBank, label: 'Mis Ahorros', path: '/ahorros' },
  { icon: CreditCard, label: 'Créditos', path: '/creditos' },
  { icon: ArrowLeftRight, label: 'Transferencias', path: '/transferencias' },
  { icon: User, label: 'Mi Perfil', path: '/perfil' },
]

export default function PageShell({ title, children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: '240px', backgroundColor: '#072146', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontFamily: 'Arial Black, Arial', fontWeight: 900, fontSize: '24px', letterSpacing: '-1px' }}>BBVA</span>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 20px',
                color: location.pathname === path ? '#fff' : 'rgba(255,255,255,0.7)',
                backgroundColor: location.pathname === path ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none', fontSize: '14px',
                fontWeight: location.pathname === path ? 600 : 400,
                borderLeft: location.pathname === path ? '3px solid #1464A0' : '3px solid transparent',
              }}
            >
              <Icon size={18} />{label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={async () => { await signOut(); navigate('/login') }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '10px', width: '100%' }}
          >
            <LogOut size={18} />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <header style={{ backgroundColor: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 30 }}>
          <h1 style={{ color: '#072146', fontSize: '20px', fontWeight: 700, margin: 0 }}>{title}</h1>
          <Bell size={20} color="#555" style={{ cursor: 'pointer' }} />
        </header>
        <main style={{ padding: '32px' }}>{children}</main>
      </div>
    </div>
  )
}