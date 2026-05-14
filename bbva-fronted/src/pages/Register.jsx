import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ nombres: '', apellidos: '', dni: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const dniToEmail = (dni) => `${dni}@bbva.pe`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    // Usamos el DNI como email ficticio para Supabase Auth
    const { error } = await signUp(dniToEmail(form.dni), form.password, {
      nombres: form.nombres,
      apellidos: form.apellidos,
      dni: form.dni,
      email_real: form.email
    })
    setLoading(false)
    if (error) {
      setError(error.message === 'User already registered' ? 'Este DNI ya está registrado.' : 'Ocurrió un error. Intenta nuevamente.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: '#fff', padding: '16px 32px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BBVALogo />
        <Link to="/login" style={{ color: '#004481', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
          ¿Ya tienes cuenta? Ingresar
        </Link>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '32px 16px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#072146', marginBottom: '8px' }}>Afíliate a BBVA</h1>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '28px' }}>Crea tu cuenta y accede a la Banca por Internet</p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} style={inputStyle} required />
              <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} style={inputStyle} required />
            </div>

            <input name="dni" placeholder="DNI (8 dígitos)" value={form.dni} onChange={handleChange} maxLength={8} style={{ ...inputStyle, marginBottom: '16px' }} required />

            <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} style={{ ...inputStyle, marginBottom: '16px' }} required />

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Contraseña (mínimo 6 caracteres)" value={form.password} onChange={handleChange} style={{ ...inputStyle, paddingRight: '48px' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#004481' }}>
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <input name="confirm" type="password" placeholder="Confirmar contraseña" value={form.confirm} onChange={handleChange} style={{ ...inputStyle, marginBottom: '24px' }} required />

            {error && (
              <div style={{ backgroundColor: '#ffeaea', border: '1px solid #ffb3b3', borderRadius: '4px', padding: '12px', marginBottom: '16px', color: '#cc0000', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: loading ? '#ccc' : '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: '#004481', fontWeight: 600, textDecoration: 'none' }}>Ingresar</Link>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#004481', padding: '24px 32px', color: 'rgba(255,255,255,0.8)', fontSize: '12px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <span>Llámanos (01) 595-0000</span>
        <span>Banco BBVA Perú - RUC 20100130204</span>
        <span>Av. República de Panamá 3055, San Isidro</span>
      </footer>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '14px 16px', border: '1px solid #ccc', borderRadius: '4px',
  fontSize: '14px', color: '#333', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff'
}

function BBVALogo() {
  return (
    <svg width="80" height="32" viewBox="0 0 80 32">
      <text x="0" y="26" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="28" fill="#004481" letterSpacing="-1">BBVA</text>
    </svg>
  )
}