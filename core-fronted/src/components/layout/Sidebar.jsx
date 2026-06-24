import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Inbox, Gauge, FilePlus2, Users, BadgeCheck, AlertTriangle, PiggyBank } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext.jsx'
import { puede } from '../../utils/permisos.js'

const SECCIONES = [
  {
    titulo: 'Principal',
    items: [{ to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard }],
  },
  {
    titulo: 'Otorgamiento de créditos',
    items: [
      { to: '/solicitudes', label: 'Bandeja de solicitudes', Icon: Inbox, accion: 'ver_bandeja_solicitudes' },
      { to: '/scoring', label: '1. Pre-solicitud', Icon: Gauge, accion: 'crear_solicitud' },
      { to: '/solicitudes/nueva', label: '2. Registro de solicitud', Icon: FilePlus2, accion: 'crear_solicitud' },
      { to: '/solicitudes?estado=6', label: '3. Propuesta y comité', Icon: Users, estado: '6', roles: ['administrador', 'jefe_regional', 'gerencia'] },
      { to: '/solicitudes?estado=2', label: '4. Aprobación y desembolso', Icon: BadgeCheck, estado: '2', roles: ['administrador', 'jefe_regional', 'gerencia'] },
      { to: '/cartera', label: '5. Cartera del Asesor', Icon: AlertTriangle, accion: 'crear_solicitud' },
    ],
  },
  {
    titulo: 'Recuperaciones',
    accion: 'consultar_mora', // asesor/administrador/riesgos/gerencia/analista
    items: [{ to: '/recuperaciones', label: 'Bandeja de mora', Icon: AlertTriangle }],
  },
  {
    titulo: 'Captaciones',
    accion: 'ver_ahorros', // solo administración (no asesores)
    items: [{ to: '/ahorros', label: 'Ahorros', Icon: PiggyBank }],
  },
]

function esActivo(item, location) {
  const estado = new URLSearchParams(location.search).get('estado')
  if (item.estado) {
    return location.pathname === '/solicitudes' && estado === item.estado
  }
  if (item.to === '/solicitudes') {
    return location.pathname === '/solicitudes' && !estado
  }
  return location.pathname === item.to
}

export default function Sidebar() {
  const { user } = useAuthContext()
  const location = useLocation()

  // Oculta secciones cuyo permiso (accion) no tenga el rol del usuario.
  const visibles = SECCIONES.map((sec) => ({
    ...sec,
    items: sec.items.filter((item) => {
      if (item.accion) return puede(user?.rol, item.accion)
      if (item.roles) return item.roles.includes(user?.rol)
      return true
    })
  })).filter((sec) => (!sec.accion || puede(user?.rol, sec.accion)) && sec.items.length > 0)

  return (
    <aside className="sidebar" style={{ background: '#fff', color: 'var(--c-primary-dark)', width: '280px', padding: '24px 16px', borderRight: '1px solid var(--c-border)', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
      <div style={{ padding: '0 14px 24px 14px' }}>
        <img src="/assets/bbva-logo.png" alt="BBVA" style={{ height: '28px', display: 'block' }} />
      </div>

      <div style={{ background: '#F3F4F6', borderRadius: '16px', padding: '16px', margin: '0 14px 24px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--c-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
          {user?.nombre?.[0] || 'U'}
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--c-text-soft)' }}>Bienvenido,</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--c-primary-dark)' }}>{user?.nombre || 'Usuario'}</div>
        </div>
      </div>

      {visibles.map((sec) => (
        <div className="sidebar__section" key={sec.titulo} style={{ marginBottom: '16px' }}>
          <p className="sidebar__title" style={{ color: 'var(--c-text-soft)', fontSize: '11px', paddingLeft: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
            {sec.titulo}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sec.items.map((item) => {
              const active = esActivo(item, location)
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={`sidebar__link ${active ? 'active' : ''}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px',
                    textDecoration: 'none', fontSize: '14px', fontWeight: active ? '600' : '500',
                    background: active ? 'var(--c-primary)' : 'transparent',
                    color: active ? '#fff' : 'var(--c-primary-dark)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <item.Icon size={18} strokeWidth={active ? 2.5 : 2} style={{ minWidth: '18px', color: active ? '#fff' : 'var(--c-text-soft)' }} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      ))}
    </aside>
  )
}
