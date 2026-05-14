import { useState } from 'react'
import PageShell from '../layouts/PageShell'

export default function Transferencias() {
    const [form, setForm] = useState({ origen: 'ahorros', destino: '', monto: '', concepto: '' })
    const [paso, setPaso] = useState(1)
    const [exito, setExito] = useState(false)
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    if (exito) return (
        <PageShell title="Transferencias y Pagos">
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '48px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '480px' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#00a859', fontWeight: 700, fontSize: '22px', marginBottom: '8px' }}>¡Transferencia exitosa!</h3>
                <p style={{ color: '#555', marginBottom: '4px' }}>Se transfirió <strong>S/ {parseFloat(form.monto).toFixed(2)}</strong></p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Hacia la cuenta: {form.destino}</p>
                <button
                    onClick={() => { setExito(false); setPaso(1); setForm({ origen: 'ahorros', destino: '', monto: '', concepto: '' }) }}
                    style={{ backgroundColor: '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                >
                    Nueva transferencia
                </button>
            </div>
        </PageShell>
    )

    return (
        <PageShell title="Transferencias y Pagos">
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '520px' }}>

                {/* Steps */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', gap: '8px' }}>
                    {['Datos', 'Confirmar'].map((s, i) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: paso > i ? '#004481' : '#e0e0e0', color: paso > i ? '#fff' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>{i + 1}</div>
                            <span style={{ fontSize: '13px', color: paso > i ? '#004481' : '#888', fontWeight: paso === i + 1 ? 700 : 400 }}>{s}</span>
                            {i === 0 && <div style={{ width: '40px', height: '2px', backgroundColor: paso > 1 ? '#004481' : '#e0e0e0', margin: '0 4px' }} />}
                        </div>
                    ))}
                </div>

                {paso === 1 && (
                    <div>
                        <label style={lbl}>Cuenta origen</label>
                        <select name="origen" value={form.origen} onChange={handleChange} style={inp}>
                            <option value="ahorros">Cuenta Ahorros — S/ 3,250.80</option>
                            <option value="corriente">Cuenta Corriente — S/ 1,480.50</option>
                        </select>

                        <label style={lbl}>Número de cuenta destino</label>
                        <input name="destino" placeholder="Ej: 0011-0816-01-00999999" value={form.destino} onChange={handleChange} style={inp} />

                        <label style={lbl}>Monto (S/)</label>
                        <input name="monto" type="number" min="1" placeholder="0.00" value={form.monto} onChange={handleChange} style={inp} />

                        <label style={lbl}>Concepto (opcional)</label>
                        <input name="concepto" placeholder="Ej: Pago alquiler" value={form.concepto} onChange={handleChange} style={inp} />

                        <button
                            onClick={() => form.destino && form.monto && setPaso(2)}
                            style={{ width: '100%', backgroundColor: '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}
                        >
                            Continuar
                        </button>
                    </div>
                )}

                {paso === 2 && (
                    <div>
                        <h4 style={{ color: '#072146', marginBottom: '16px' }}>Confirmar transferencia</h4>
                        {[
                            ['Desde', form.origen === 'ahorros' ? 'Cuenta Ahorros' : 'Cuenta Corriente'],
                            ['Hacia', form.destino],
                            ['Monto', `S/ ${parseFloat(form.monto).toFixed(2)}`],
                            ['Concepto', form.concepto || '(Sin concepto)'],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' }}>
                                <span style={{ color: '#888' }}>{k}</span>
                                <span style={{ color: '#072146', fontWeight: 600 }}>{v}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={() => setPaso(1)} style={{ flex: 1, backgroundColor: '#fff', color: '#004481', border: '2px solid #004481', borderRadius: '4px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                Editar
                            </button>
                            <button onClick={() => setExito(true)} style={{ flex: 1, backgroundColor: '#004481', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageShell>
    )
}

const inp = { width: '100%', padding: '12px 16px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', color: '#333', boxSizing: 'border-box', marginBottom: '16px', outline: 'none', backgroundColor: '#fff' }
const lbl = { display: 'block', fontSize: '12px', color: '#555', marginBottom: '6px' }