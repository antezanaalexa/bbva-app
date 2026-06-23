export default function BBVAButton({ children, variant = 'primary', onClick, disabled, type = 'button', className = '', style = {} }) {
  const getStyles = () => {
    const base = {
      padding: '12px 24px',
      borderRadius: 'var(--radius-sm)',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      border: 'none',
      transition: 'all 0.2s ease',
      ...style
    }

    switch (variant) {
      case 'primary':
        return { ...base, background: 'var(--c-primary)', color: '#fff' }
      case 'secondary':
        return { ...base, background: 'transparent', color: 'var(--c-primary)', border: '1px solid var(--c-primary)' }
      case 'success':
        return { ...base, background: 'var(--c-verde)', color: '#fff' }
      case 'danger':
        return { ...base, background: 'var(--c-rojo)', color: '#fff' }
      case 'outline-light':
        return { ...base, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.5)' }
      default:
        return { ...base, background: 'var(--c-primary)', color: '#fff' }
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={getStyles()}
    >
      {children}
    </button>
  )
}
