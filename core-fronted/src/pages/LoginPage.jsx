import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoginForm from '../components/forms/LoginForm.jsx'
import Logo from '../components/ui/Logo.jsx'

export default function LoginPage() {
  const { isAuthenticated, loading, error, iniciarSesion } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header Corporativo */}
      <header style={{ background: '#fff', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid #E5E7EB' }}>
        <Logo size={56} />
        <div style={{ background: '#EAF4FF', color: '#004481', padding: '8px 16px', borderRadius: '24px', fontSize: '12px', fontWeight: '600' }}>
          Sistema interno · Uso exclusivo del personal
        </div>
      </header>

      {/* Split Screen Container */}
      <main style={{ flex: 1, display: 'flex' }}>
        {/* Left Side (Blue Gradient) */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #072146 0%, #004481 100%)', position: 'relative', overflow: 'hidden', padding: '60px 80px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Decorative Circles */}
          <div style={{ position: 'absolute', right: '-10%', top: '20%', width: '400px', height: '400px', border: '30px solid rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', right: '0%', top: '30%', width: '200px', height: '200px', border: '30px solid rgba(255,255,255,0.1)', borderRadius: '50%', pointerEvents: 'none' }}></div>
          
          <div style={{ background: '#fff', color: '#072146', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', alignSelf: 'flex-start', marginBottom: '24px' }}>
            NUESTRA ESENCIA
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.1' }}>Misión</h1>
          <p style={{ fontSize: '20px', lineHeight: '1.5', maxWidth: '400px', marginBottom: '40px', opacity: 0.9 }}>
            Impulsar el desarrollo de los emprendedores del Perú con soluciones financieras inclusivas, ágiles y responsables.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)' }}>Inclusión</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)' }}>Agilidad</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)' }}>Responsabilidad</span>
          </div>
        </div>

        {/* Right Side (White Panel) */}
        <div style={{ flex: 1, background: '#ffffff', borderLeft: '1px solid #E5E7EB', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          {/* Watermark Background Image */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.88) 100%), url("/assets/edificio-bbva-2.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25, pointerEvents: 'none', zIndex: 0 }}></div>
          
          {/* Decorative Lights */}
          <div style={{ position: 'absolute', left: '-5%', bottom: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(2,160,227,0.05) 0%, rgba(2,160,227,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', right: '-10%', top: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(7,38,180,0.05) 0%, rgba(7,38,180,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
          
          <div style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EAF4FF', border: '1px solid #BEE3F8', color: '#004481', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '32px' }}>
              <span>✓</span> Conexión segura
            </div>
            <h2 style={{ color: '#072146', fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Inicia sesión</h2>
            <p style={{ color: '#5b6b82', fontSize: '14px', marginBottom: '32px' }}>Acceso del personal · ingresa con tu DNI.</p>
            
            <LoginForm onSubmit={iniciarSesion} loading={loading} error={error} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#072146', color: 'rgba(255,255,255,0.6)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div>© 2026 BBVA Perú · Core Bancario — Sistema interno</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Términos</span>
          <span>Privacidad</span>
          <span>Soporte</span>
        </div>
      </footer>
    </div>
  )
}
