import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'

export default function Login() {
  const [tipoDoc, setTipoDoc] = useState('DNI')
  const [documento, setDocumento] = useState('')
  const [password, setPassword] = useState('')
  const [recordar, setRecordar] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()
  const navigate = useNavigate()

  // BBVA usa DNI como usuario → mapeamos a email ficticio para Supabase
  const dniToEmail = (dni) => `${dni}@bbva.pe`

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(dniToEmail(documento), password)
    setLoading(false)
    if (error) {
      setError('DNI o contraseña incorrectos. Verifica tus datos.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: '#fff', padding: '16px 32px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BBVALogo />
        <a href="/" style={{ color: '#004481', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
          Ir a BBVA Perú
        </a>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '32px 16px', gap: '24px', flexWrap: 'wrap' }}>

        {/* Login card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#072146', marginBottom: '8px' }}>¡Hola!</h1>
          <p style={{ color: '#333', fontSize: '14px', marginBottom: '28px' }}>Completa tus datos y disfruta de tu Banca por Internet</p>

          <form onSubmit={handleLogin}>
            {/* Tipo de documento */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <label style={labelStyle}>Tipo de documento</label>
              <select
                value={tipoDoc}
                onChange={(e) => setTipoDoc(e.target.value)}
                style={inputStyle}
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carnet de Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            {/* Número de documento */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Número de documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                maxLength={8}
                style={inputStyle}
                required
              />
            </div>

            {/* Recordar documento */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <input
                type="checkbox"
                id="recordar"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#004481', cursor: 'pointer' }}
              />
              <label htmlFor="recordar" style={{ fontSize: '14px', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Recordar documento
                <HelpCircle size={16} color="#999" />
              </label>
            </div>

            {/* Contraseña */}
            <div style={{ marginBottom: '12px', position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña de Banca por Internet"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '48px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#004481' }}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Link olvidaste */}
            <div style={{ marginBottom: '28px' }}>
              <Link to="/recuperar" style={{ color: '#004481', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
                ¿Olvidaste o bloqueaste tu contraseña?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div style={{ backgroundColor: '#ffeaea', border: '1px solid #ffb3b3', borderRadius: '4px', padding: '12px', marginBottom: '16px', color: '#cc0000', fontSize: '13px' }}>
                {error}
              </div>
            )}

            {/* Botones */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#ccc' : '#004481',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flex: 1
                }}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
              <Link
                to="/registro"
                style={{
                  backgroundColor: '#fff',
                  color: '#004481',
                  border: '2px solid #004481',
                  borderRadius: '4px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  textAlign: 'center',
                  flex: 1
                }}
              >
                Afíliate
              </Link>
            </div>
          </form>
        </div>

        {/* Card lateral - Hazte cliente */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '360px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#FFD700', color: '#333', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
            ¡Nuevo!
          </span>

          {/* Ícono celular */}
          <div style={{ fontSize: '80px', marginBottom: '24px', filter: 'drop-shadow(0 8px 16px rgba(0,100,220,0.3))' }}>📱</div>

          <h2 style={{ color: '#072146', fontSize: '22px', fontWeight: '700', marginBottom: '12px', lineHeight: 1.3 }}>
            Hazte cliente BBVA, sin trámites ni colas.
          </h2>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>
            Abre tu Cuenta Digital en minutos y empieza a ahorrar desde donde estés.
          </p>
          <Link
            to="/registro"
            style={{ backgroundColor: '#004481', color: '#fff', borderRadius: '4px', padding: '14px 32px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}
          >
            Descarga aquí
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#004481', padding: '32px', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <BBVALogoWhite />
          <div style={{ display: 'flex', gap: '16px' }}>
            {['f', '𝕏', '📷', 'in', '▶'].map((icon, i) => (
              <div key={i} style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer' }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '16px auto 0', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px', display: 'flex', gap: '32px', flexWrap: 'wrap', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
          <span>Llámanos (01) 595-0000</span>
          <span>Banco BBVA Perú - RUC 20100130204</span>
          <span>Av. República de Panamá 3055, San Isidro</span>
        </div>
      </footer>
    </div>
  )
}

// Estilos reutilizables
const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  color: '#333',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  appearance: 'auto'
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#666',
  marginBottom: '4px'
}

// Logo BBVA azul
function BBVALogo() {
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="26" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="28" fill="#004481" letterSpacing="-1">BBVA</text>
    </svg>
  )
}

// Logo BBVA blanco
function BBVALogoWhite() {
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="26" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="28" fill="#ffffff" letterSpacing="-1">BBVA</text>
    </svg>
  )
}