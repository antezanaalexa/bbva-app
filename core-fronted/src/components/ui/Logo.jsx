/**
 * Logo de marca de Banco Andino.
 * Isotipo: flor andina multicolor — pétalos con los colores del textil
 * (magenta, naranja, amarillo, verde, turquesa, morado) y centro cálido.
 *
 * @param {Object} props
 * @param {number} [props.size=44]      Tamaño del isotipo en px.
 * @param {boolean} [props.wordmark=true] Mostrar el texto "Banco Andino".
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
  const subColor = variant === 'light' ? 'rgba(255,255,255,.8)' : '#1464A0'
  // El texto escala con el tamaño del isotipo.
  const nameSize = Math.round(size * 0.5)
  const subSize = Math.max(9, Math.round(size * 0.23))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="BBVA Perú"
        role="img"
      >
        {/* Logo de BBVA simple o dejar una abstracción */}
        <text x="2" y="32" fontFamily="Arial" fontSize="24" fill={textColor} fontWeight="bold">BBVA</text>
      </svg>

      {wordmark && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.04 }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: nameSize,
              color: textColor,
              letterSpacing: '-0.5px',
            }}
          >
            BBVA Perú
          </span>
          <span
            style={{
              fontSize: subSize,
              fontWeight: 700,
              color: subColor,
              letterSpacing: '1.2px',
            }}
          >
            CORE BANCARIO
          </span>
        </span>
      )}
    </span>
  )
}
