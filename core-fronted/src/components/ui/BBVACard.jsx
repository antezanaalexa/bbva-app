export default function BBVACard({ children, className = '', style = {} }) {
  return (
    <div
      className={`bbva-card ${className}`}
      style={{
        background: 'var(--c-surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: '24px',
        border: '1px solid var(--c-border)',
        ...style
      }}
    >
      {children}
    </div>
  )
}
