import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { RoleBadge } from '../ui/Badges.jsx'
import Logo from '../ui/Logo.jsx'

export default function Navbar() {
  const { user, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    cerrarSesion()
    navigate('/')
  }

  return (
    <nav className="navbar" style={{ background: '#fff', color: 'var(--c-primary-dark)', borderBottom: '1px solid var(--c-border)', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
      <div className="navbar__brand">
        <Logo size={46} wordmark={true} variant="dark" />
      </div>
      <div className="navbar__user">
        <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.nombres} {user?.apellidos}</div>
        </div>
        <RoleBadge role={user?.rol || 'Usuario'} />
        <button 
          onClick={handleLogout} 
          className="navbar__logout"
          style={{ background: '#F3F4F6', color: 'var(--c-primary-dark)', marginLeft: '16px', fontWeight: '600' }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
