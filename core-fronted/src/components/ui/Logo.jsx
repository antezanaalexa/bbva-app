/**
 * Logo de marca de BBVA.
 *
 * @param {Object} props
 * @param {number} [props.size=44]      Tamaño del isotipo en px.
 * @param {boolean} [props.wordmark=true] Mostrar el texto "BBVA".
 * @param {'dark'|'light'} [props.variant='dark'] Color del texto.
 */

// Pétalos: ángulo de rotación + color (paleta de la manta).
const PETALOS = [
  { a: 0, c: '#e6398b' }, // magenta
  { a: 60, c: '#f7941e' }, // naranja
  { a: 120, c: '#fbc02d' }, // amarillo
  { a: 180, c: '#4caf50' }, // verde
  { a: 240, c: '#00a9a5' }, // turquesa
  { a: 300, c: '#8e24aa' }, // morado
]

export default function Logo({ size = 44, wordmark = true, variant = 'dark' }) {
  const textColor = variant === 'light' ? '#ffffff' : '#072146'
  const subColor = variant === 'light' ? 'rgba(255,255,255,.8)' : '#004481'
  
  // Scale heights based on size
  const imgHeight = Math.round(size * 0.45)
  const nameSize = Math.round(size * 0.32)
  const subSize = Math.max(9, Math.round(size * 0.18))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', fontFamily: 'Outfit, sans-serif' }}>
      <img
        src="/assets/bbva-logo.png"
        alt="BBVA"
        style={{
          height: `${imgHeight}px`,
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
          filter: variant === 'dark' ? 'brightness(0) saturate(100%) invert(11%) sepia(35%) saturate(3062%) hue-rotate(205deg) brightness(95%) contrast(97%)' : 'none'
        }}
      />
      
      {wordmark && (
        <>
          <div 
            style={{ 
              width: '1px', 
              height: `${imgHeight}px`, 
              backgroundColor: variant === 'light' ? 'rgba(255,255,255,0.3)' : '#D2D4D9' 
            }} 
          />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: `${nameSize}px`,
                color: textColor,
                letterSpacing: '-0.3px',
              }}
            >
              Perú
            </span>
            <span
              style={{
                fontSize: `${subSize}px`,
                fontWeight: 700,
                color: subColor,
                letterSpacing: '1px',
              }}
            >
              CORE BANCARIO
            </span>
          </span>
        </>
      )}
    </span>
  )
}

