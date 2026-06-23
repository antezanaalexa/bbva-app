import { useState } from 'react'
import { User, Lock, ArrowRight } from 'lucide-react'

/**
 * Formulario de login. En desarrollo, password = numerodni.
 */
export default function LoginForm({ onSubmit, loading, error }) {
  const [numerodni, setNumerodni] = useState('')
  const [password, setPassword] = useState('')
  
  // Focus and hover states for inline style styling
  const [focusDni, setFocusDni] = useState(false)
  const [focusPwd, setFocusPwd] = useState(false)
  const [hoverBtn, setHoverBtn] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(numerodni.trim(), password)
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', fontFamily: 'Outfit, sans-serif' }}>
      <div className="field">
        <label htmlFor="dni" style={{ color: '#072146', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Número de DNI</label>
        <div style={{ position: 'relative' }}>
          <User size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: focusDni ? '#0726B4' : '#9CA3AF', transition: 'color 0.15s' }} />
          <input
            id="dni"
            type="text"
            value={numerodni}
            onChange={(e) => setNumerodni(e.target.value)}
            onFocus={() => setFocusDni(true)}
            onBlur={() => setFocusDni(false)}
            placeholder="Ej. 12345678"
            autoFocus
            required
            style={{ 
              width: '100%', 
              padding: '16px 20px 16px 48px', 
              borderRadius: '24px', 
              border: focusDni ? '1px solid #0726B4' : '1px solid #D2D4D9', 
              outline: 'none', 
              fontSize: '15px', 
              color: '#072146',
              background: '#ffffff',
              transition: 'all 0.15s',
              boxShadow: focusDni ? '0 0 0 4px rgba(7, 38, 180, 0.15)' : 'none'
            }}
          />
        </div>
      </div>
      
      <div className="field" style={{ marginTop: 24 }}>
        <label htmlFor="pwd" style={{ color: '#072146', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Contraseña</label>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: focusPwd ? '#0726B4' : '#9CA3AF', transition: 'color 0.15s' }} />
          <input
            id="pwd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusPwd(true)}
            onBlur={() => setFocusPwd(false)}
            placeholder="(en desarrollo: tu DNI)"
            required
            style={{ 
              width: '100%', 
              padding: '16px 20px 16px 48px', 
              borderRadius: '24px', 
              border: focusPwd ? '1px solid #0726B4' : '1px solid #D2D4D9', 
              outline: 'none', 
              fontSize: '15px', 
              color: '#072146',
              background: '#ffffff',
              transition: 'all 0.15s',
              boxShadow: focusPwd ? '0 0 0 4px rgba(7, 38, 180, 0.15)' : 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: '#072146', fontSize: '13px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
          <input type="checkbox" defaultChecked style={{ accentColor: '#0726B4', width: '16px', height: '16px' }} />
          Recordarme
        </label>
        <a 
          href="#" 
          style={{ color: '#0726B4', textDecoration: 'none', fontWeight: '600' }} 
          onMouseOver={(e) => e.target.style.textDecoration='underline'} 
          onMouseOut={(e) => e.target.style.textDecoration='none'}
        >
          ¿Olvidó su contraseña?
        </a>
      </div>

      {error && <div className="alert alert--error" style={{ marginTop: 20 }}>{error}</div>}

      <button
        className="btn"
        type="submit"
        disabled={loading}
        onMouseEnter={() => setHoverBtn(true)}
        onMouseLeave={() => setHoverBtn(false)}
        style={{ 
          width: '100%', 
          marginTop: 32, 
          background: hoverBtn ? '#051D80' : '#0726B4', 
          color: '#ffffff', 
          border: 'none', 
          borderRadius: '24px', 
          padding: '16px', 
          fontSize: '16px', 
          fontWeight: '800', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px', 
          transition: 'all 0.2s',
          boxShadow: hoverBtn ? '0 6px 16px rgba(7, 38, 180, 0.25)' : '0 4px 12px rgba(7, 38, 180, 0.15)'
        }}
      >
        {loading ? (
          'Iniciando...'
        ) : (
          <>
            <ArrowRight size={18} />
            <span>Iniciar sesión</span>
          </>
        )}
      </button>
    </form>
  )
}
