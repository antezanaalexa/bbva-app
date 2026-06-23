export function StatusBadge({ estado }) {
  const normalized = estado?.toLowerCase()
  let bg = 'var(--c-bg)'
  let color = 'var(--c-text-soft)'

  if (normalized === 'pendiente') {
    bg = 'var(--c-badge-orange)'
    color = 'var(--c-badge-orange-text)'
  } else if (normalized === 'aprobado') {
    bg = 'var(--c-badge-blue)'
    color = 'var(--c-badge-blue-text)'
  } else if (normalized === 'rechazado') {
    bg = '#FEE2E2'
    color = 'var(--c-rojo)'
  } else if (normalized === 'desembolsado') {
    bg = '#DCFCE7'
    color = 'var(--c-verde)'
  } else if (normalized === 'mora' || normalized === 'castigado' || normalized === 'judicial') {
    bg = '#FEE2E2'
    color = 'var(--c-rojo)'
  } else if (normalized === 'aldia' || normalized === 'al dia' || normalized === 'al día') {
    bg = '#DCFCE7'
    color = 'var(--c-verde)'
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '99px',
      fontSize: '12px',
      fontWeight: '700',
      background: bg,
      color: color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {estado}
    </span>
  )
}

export function RiskBadge({ semaforo }) {
  const s = semaforo?.toLowerCase()
  let bg = '#E5E7EB'
  let color = '#4B5563'

  if (s === 'verde') {
    bg = '#DCFCE7'
    color = 'var(--c-verde)'
  } else if (s === 'amarillo') {
    bg = 'var(--c-badge-orange)'
    color = 'var(--c-amarillo)'
  } else if (s === 'rojo') {
    bg = '#FEE2E2'
    color = 'var(--c-rojo)'
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '99px',
      fontSize: '12px',
      fontWeight: '700',
      background: bg,
      color: color,
      textTransform: 'uppercase'
    }}>
      {semaforo}
    </span>
  )
}

export function RoleBadge({ role }) {
  const r = role?.toLowerCase()
  let bg = '#E5E7EB'
  let color = '#4B5563'

  if (r === 'asesor') {
    bg = 'var(--c-badge-blue)'
    color = 'var(--c-badge-blue-text)'
  } else if (r === 'administrador') {
    bg = 'var(--c-badge-purple)'
    color = 'var(--c-badge-purple-text)'
  } else if (r === 'jefe_regional') {
    bg = 'var(--c-badge-orange)'
    color = 'var(--c-badge-orange-text)'
  } else if (r === 'riesgos') {
    bg = '#FEE2E2'
    color = 'var(--c-rojo)'
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '99px',
      fontSize: '12px',
      fontWeight: '700',
      background: bg,
      color: color,
      textTransform: 'uppercase'
    }}>
      {role?.replace('_', ' ')}
    </span>
  )
}
