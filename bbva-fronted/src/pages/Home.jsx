import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'

const slides = [
  {
    tag: 'Cuenta de Ahorros BBVA',
    title: 'Abre tu cuenta 100% digital en minutos',
    desc: 'Sin papeleos, sin colas. Empieza a ahorrar desde donde estés.',
    emoji: '🏦',
    bg: '#e8f0fe'
  },
  {
    tag: 'Tarjeta de Crédito Mastercard BBVA',
    title: 'Mastercard y BBVA te llevan a Viajando Por El Mundo Tropitour',
    desc: 'Aprovecha la preventa exclusiva con tu Tarjeta de Crédito Mastercard BBVA para comprar tus entradas y verla en vivo',
    emoji: '🌍',
    bg: '#fff3e0'
  },
  {
    tag: 'Crédito Efectivo BBVA',
    title: 'Obtén tu crédito en minutos y sin salir de casa',
    desc: 'Dinero directo a tu cuenta. Aprobación inmediata.',
    emoji: '💳',
    bg: '#f3e5f5'
  },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const prev = () => setSlide((s) => (s - 1 + slides.length) % slides.length)
  const next = () => setSlide((s) => (s + 1) % slides.length)

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", minHeight: '100vh' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '64px', gap: '32px' }}>

          {/* Logo */}
          <span style={{ fontFamily: 'Arial Black, Arial', fontWeight: 900, fontSize: '24px', letterSpacing: '-1px', color: '#004481', flexShrink: 0 }}>BBVA</span>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: '24px', flex: 1 }}>
            {['Personas', 'Empresas'].map((item, i) => (
              <a key={item} href="#" style={{ color: i === 0 ? '#004481' : '#333', textDecoration: 'none', fontSize: '15px', fontWeight: 500, borderBottom: i === 0 ? '2px solid #004481' : 'none', paddingBottom: '2px' }}>
                {item}
              </a>
            ))}
            <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px' }}>💳</span> Obtén tu Tarjeta de Crédito
            </a>
            <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '15px' }}>Abre tu cuenta ∨</a>
          </nav>

          {/* CTA */}
          <Link
            to="/login"
            style={{ backgroundColor: '#004481', color: '#fff', padding: '10px 24px', borderRadius: '4px', textDecoration: 'none', fontSize: '15px', fontWeight: 600, flexShrink: 0 }}
          >
            Banca por Internet
          </Link>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}><Search size={20} /></button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px' }}>
            <Menu size={20} /> Menú
          </button>
        </div>
      </header>

      {/* Hero carousel */}
      <section style={{ backgroundColor: slides[slide].bg, padding: '48px 0', transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', fontStyle: 'italic' }}>{slides[slide].tag}</p>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#072146', lineHeight: 1.2, marginBottom: '16px' }}>
              {slides[slide].title}
            </h1>
            <p style={{ color: '#555', fontSize: '15px', marginBottom: '28px' }}>{slides[slide].desc}</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/login" style={{ backgroundColor: '#004481', color: '#fff', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>
                Lo quiero
              </Link>
              <a href="#" style={{ color: '#333', padding: '12px 28px', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>
                Conoce más
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', fontSize: '120px', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.1))' }}>
            {slides[slide].emoji}
          </div>
        </div>

        {/* Carousel controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '32px' }}>
          <button onClick={prev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><ChevronLeft size={22} /></button>
          <span style={{ fontSize: '14px', color: '#555' }}>{slide + 1} de {slides.length}</span>
          <button onClick={next} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><ChevronRight size={22} /></button>
        </div>
      </section>

      {/* Tagline */}
      <section style={{ backgroundColor: '#fff', padding: '48px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#072146', maxWidth: '600px', margin: '0 auto 40px' }}>
          Tú decides el ritmo. Nosotros te damos las herramientas
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { icon: '💰', title: 'Cuentas de Ahorro', desc: 'Ahorra con la mejor tasa del mercado' },
            { icon: '🏠', title: 'Crédito Hipotecario', desc: 'Compra tu casa con cuotas accesibles' },
            { icon: '💳', title: 'Tarjetas de Crédito', desc: 'Beneficios exclusivos en cada compra' },
            { icon: '📱', title: 'App BBVA', desc: 'Gestiona todo desde tu celular' },
          ].map((item) => (
            <div key={item.title} style={{ padding: '28px 20px', borderRadius: '8px', border: '1px solid #e8e8e8', textAlign: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,68,129,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ color: '#072146', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ backgroundColor: '#004481', padding: '48px 40px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>¿Aún no eres cliente BBVA?</h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '28px' }}>Abre tu Cuenta 100% Digital en minutos y empieza a operar al instante.</p>
        <Link to="/registro" style={{ backgroundColor: '#fff', color: '#004481', padding: '14px 36px', borderRadius: '4px', textDecoration: 'none', fontSize: '16px', fontWeight: 700 }}>
          Abrir mi cuenta
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#072146', padding: '40px', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontFamily: 'Arial Black, Arial', fontWeight: 900, fontSize: '24px', letterSpacing: '-1px' }}>BBVA</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(s => (
                <div key={s} style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer' }}>
                  {s[0]}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px', display: 'flex', gap: '32px', flexWrap: 'wrap', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            <span>Llámanos (01) 595-0000</span>
            <span>Banco BBVA Perú - RUC 20100130204</span>
            <span>Av. República de Panamá 3055, San Isidro</span>
          </div>
        </div>
      </footer>

      {/* Chat flotante */}
      <div style={{ position: 'fixed', right: '24px', bottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          <MessageCircle size={22} color="#004481" />
        </div>
        <span style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>Chat</span>
      </div>

      {/* Banner popup */}
      {showBanner && (
        <div style={{ position: 'fixed', right: '24px', bottom: '88px', backgroundColor: '#004481', color: '#fff', borderRadius: '8px', padding: '20px', width: '240px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 200 }}>
          <button onClick={() => setShowBanner(false)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>¿Aún no eres cliente BBVA?</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>Abre tu Cuenta 100% Digital en minutos y empieza a operar al instante.</p>
          <Link to="/registro" style={{ display: 'block', backgroundColor: '#fff', color: '#004481', textAlign: 'center', padding: '10px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
            Conoce más
          </Link>
        </div>
      )}
    </div>
  )
}