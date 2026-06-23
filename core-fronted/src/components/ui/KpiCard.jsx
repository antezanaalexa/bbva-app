import BBVACard from './BBVACard.jsx'

export default function KpiCard({ label, valor, color = 'var(--c-primary-dark)', Icon }) {
  return (
    <BBVACard style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--c-text-soft)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        {Icon && <Icon size={20} style={{ color: color, opacity: 0.8 }} />}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--c-primary-dark)' }}>
        {valor}
      </div>
    </BBVACard>
  )
}
