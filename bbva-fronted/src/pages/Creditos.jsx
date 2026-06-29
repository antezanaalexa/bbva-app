import { useEffect, useState } from "react";
import {
  CreditCard,
  Calculator,
  FileText,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import DashboardShell from "../components/dashboard/DashboardShell";

export default function Creditos() {
  const { user } = useAuth();

  const [tab, setTab] = useState("activos");
  const [solicitudes, setSolicitudes] = useState([]);
  const [cronograma, setCronograma] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [simMonto, setSimMonto] = useState(10000);
  const [simPlazo, setSimPlazo] = useState(24);
  const [simProposito, setSimProposito] = useState("consumo");
  const [simResultado, setSimResultado] = useState(null);
  const [simCargando, setSimCargando] = useState(false);
  const [simMoneda, setSimMoneda] = useState("PEN");
  const simSimbolo = simMoneda === "USD" ? "US$" : "S/";

  const nombreUsuario =
    user?.user_metadata?.nombres || user?.email?.split("@")[0] || "Cliente";

  const cargarSolicitudes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await api.get(`/api/creditos/solicitudes/${user.id}`);
      setSolicitudes(res.data.data || []);
    } catch (err) {
      console.error("Error cargando créditos:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarCuentas = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/api/cuentas/${user.id}`);
      setCuentas(res.data.data || []);
    } catch (err) {
      console.error("Error cargando cuentas:", err);
    }
  };

  const simular = async () => {
    try {
      setSimCargando(true);

      const res = await api.post("/api/creditos/simular", {
        monto: simMonto,
        plazo_meses: simPlazo,
        proposito: simProposito,
      });

      setSimResultado(res.data.data);

      const cronRes = await api.post("/api/creditos/cronograma", {
        monto: simMonto,
        plazo_meses: simPlazo,
        proposito: simProposito,
      });

      setCronograma(cronRes.data.data || []);
    } catch (err) {
      console.error("Error simulando:", err);
    } finally {
      setSimCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
    cargarCuentas();
  }, [user]);

  useEffect(() => {
    simular();
  }, [simMonto, simPlazo, simProposito]);

  return (
    <DashboardShell title="Créditos" nombreUsuario={nombreUsuario}>
      <section className="mb-10">
        <span className="text-[#1464A0] font-bold text-sm uppercase tracking-widest">
          Financiamiento
        </span>

        <h1 className="text-5xl font-black text-[#072146] mt-2">
          Créditos BBVA
        </h1>

        <p className="text-gray-500 text-xl mt-3">
          Simula préstamos, revisa solicitudes y evalúa tus cuotas.
        </p>
      </section>

      <div className="bg-white rounded-[28px] p-3 shadow-sm border border-gray-100 inline-flex gap-2 mb-8">
        <TabButton active={tab === "activos"} onClick={() => setTab("activos")}>
          Préstamos activos
        </TabButton>

        <TabButton active={tab === "simulador"} onClick={() => setTab("simulador")}>
          Simulador
        </TabButton>

        <TabButton active={tab === "solicitar"} onClick={() => setTab("solicitar")}>
          Solicitar crédito
        </TabButton>
      </div>

      {tab === "activos" && (
        <section>
          {loading ? (
            <div className="bg-white rounded-[32px] p-12 text-center text-gray-500">
              Cargando solicitudes...
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="grid lg:grid-cols-[1.3fr_0.8fr] gap-8">
              <div className="bg-white rounded-[32px] p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 rounded-full bg-[#eaf4ff] text-[#0726B4] flex items-center justify-center mx-auto mb-6">
                  <FileText size={48} />
                </div>

                <h2 className="text-3xl font-black text-[#072146] mb-3">
                  No tienes préstamos activos
                </h2>

                <p className="text-gray-500 text-lg mb-8">
                  Usa el simulador para solicitar tu primer crédito.
                </p>

                <button
                  onClick={() => setTab("simulador")}
                  className="bg-[#0726B4] hover:bg-[#051D80] text-white px-10 py-5 rounded-2xl font-bold text-lg transition"
                >
                  Simular crédito
                </button>
              </div>

              <CreditInfoCard />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-7">
              {solicitudes.map((sol) => (
                <SolicitudCard key={sol.id} sol={sol} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "simulador" && (
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black text-[#072146] mb-8">
              Simulador de crédito
            </h2>

            <div className="block mb-8">
              <span className="block text-[#072146] font-bold mb-2">Moneda</span>
              <select
                value={simMoneda}
                onChange={(e) => setSimMoneda(e.target.value)}
                className="input-bbva w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-bold outline-none"
              >
                <option value="PEN">Soles (S/)</option>
                <option value="USD">Dólares (US$)</option>
              </select>
            </div>

            <RangeField
              label="Monto del préstamo"
              value={simMonto}
              min={1000}
              max={50000}
              step={500}
              prefix={simSimbolo}
              onChange={(e) => setSimMonto(Number(e.target.value))}
            />

            <RangeField
              label="Plazo"
              value={simPlazo}
              min={6}
              max={60}
              step={6}
              suffix="meses"
              onChange={(e) => setSimPlazo(Number(e.target.value))}
            />

            <div className="block mb-8">
              <span className="block text-[#072146] font-bold mb-2">Propósito del crédito</span>
              <select
                value={simProposito}
                onChange={(e) => setSimProposito(e.target.value)}
                className="input-bbva w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-bold outline-none"
              >
                <option value="consumo">Consumo / Libre disponibilidad (TEA 41.20%)</option>
                <option value="educacion">Educación (TEA 28.00% simulada)</option>
                <option value="salud">Salud (TEA 30.00% simulada)</option>
                <option value="vivienda">Vivienda (TEA 11.50% simulada)</option>
                <option value="negocio">Negocio (TEA 35.00% simulada)</option>
              </select>
            </div>

            {simResultado && (
              <div className="bg-[#f4f8ff] rounded-3xl p-6 mb-8 grid md:grid-cols-2 gap-5">
                <ResultBox label="Cuota mensual" value={`${simSimbolo} ${Number(simResultado.cuota_mensual).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`} />
                <ResultBox label="Total a pagar" value={`${simSimbolo} ${Number(simResultado.total_pagar).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`} />
                <ResultBox label="Interés total" value={`${simSimbolo} ${Number(simResultado.total_interes).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`} />
                <ResultBox label="TEA referencial" value={`${simResultado.tasa_anual}%`} />
              </div>
            )}

            <p className="text-xs text-gray-400 mb-6 italic text-center">
              Esta simulación es referencial y está sujeta a evaluación crediticia. El cálculo de cuota mensual se realiza con la fórmula de amortización francesa (criterio SBS) y no incluye ITF ni seguro de desgravamen.
            </p>

            <button
              onClick={() => setTab("solicitar")}
              className="w-full bg-[#0726B4] hover:bg-[#051D80] text-white py-5 rounded-2xl text-lg font-bold transition"
            >
              Solicitar este crédito
            </button>
          </section>

          <section className="bg-[#072146] rounded-[32px] p-10 text-white h-fit">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Calculator size={32} />
            </div>

            <h2 className="text-3xl font-black mb-6">
              Cronograma estimado
            </h2>

            {simCargando ? (
              <p className="text-white/60">Calculando...</p>
            ) : (
              <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">
                {cronograma.slice(0, 12).map((row) => (
                  <div key={row.cuota} className="bg-white/10 rounded-2xl p-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60">Cuota {row.cuota}</span>
                      <strong>{simSimbolo} {row.total}</strong>
                    </div>
                    <p className="text-white/50 text-sm">
                      Capital {simSimbolo} {row.capital} · Interés {simSimbolo} {row.interes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "solicitar" && (
        <SolicitarCredito
          user={user}
          cuentas={cuentas}
          simMonto={simMonto}
          simPlazo={simPlazo}
          simMoneda={simMoneda}
          onExito={async () => {
            await cargarSolicitudes();
            setTab("activos");
          }}
        />
      )}
    </DashboardShell>
  );
}

function SolicitarCredito({ user, cuentas, simMonto, simPlazo, simMoneda, onExito }) {
  const [form, setForm] = useState({
    monto: simMonto,
    plazo: simPlazo,
    motivo: "consumo",
    ingresos: "",
    cuenta_destino_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (cuentas.length > 0 && !form.cuenta_destino_id) {
      const match = cuentas.find((c) => c.moneda === (simMoneda || "PEN"));
      if (match) {
        setForm((prev) => ({ ...prev, cuenta_destino_id: match.id }));
      } else {
        setForm((prev) => ({ ...prev, cuenta_destino_id: cuentas[0].id }));
      }
    }
  }, [cuentas, simMoneda]);

  const cuentaDestino = cuentas.find((c) => c.id === form.cuenta_destino_id);
  const moneda = cuentaDestino ? cuentaDestino.moneda : (simMoneda || "PEN");
  const simboloMoneda = moneda === "USD" ? "US$" : "S/";

  const enviar = async () => {
    if (!form.monto || !form.ingresos || !form.motivo || !form.cuenta_destino_id) {
      setError("Completa todos los campos, incluyendo la cuenta de depósito.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/api/creditos/solicitar", {
        user_id: user.id,
        monto: Number(form.monto),
        plazo_meses: Number(form.plazo),
        proposito: form.motivo,
        ingresos_mensuales: Number(form.ingresos),
        cuenta_destino_id: form.cuenta_destino_id,
      });

      if (response.data.success === false) {
        setError(response.data.message || "No se pudo enviar la solicitud.");
        return;
      }

      setEnviado(true);
    } catch (err) {
      console.error("Error solicitando crédito:", err);
      setError("Error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <section className="bg-white rounded-[32px] p-12 shadow-sm border border-gray-100 text-center">
        <div className="w-24 h-24 rounded-full bg-[#eaf4ff] text-[#0726B4] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={56} />
        </div>

        <h2 className="text-4xl font-black text-[#072146] mb-4">
          Solicitud enviada
        </h2>

        <p className="text-gray-500 text-lg mb-8">
          Tu crédito está en evaluación.
        </p>

        <button
          onClick={onExito}
          className="bg-[#0726B4] hover:bg-[#051D80] text-white px-10 py-5 rounded-2xl font-bold"
        >
          Ver mis solicitudes
        </button>
      </section>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
      <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
        <h2 className="text-3xl font-black text-[#072146] mb-8">
          Solicitar crédito
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6">
            {error}
          </div>
        )}

        <InputLabel label={`Monto solicitado (${simboloMoneda})`}>
          <input
            name="monto"
            type="number"
            value={form.monto}
            onChange={handleChange}
            className="input-bbva"
            placeholder="Ej: 5000"
          />
        </InputLabel>

        <InputLabel label="Plazo">
          <select name="plazo" value={form.plazo} onChange={handleChange} className="input-bbva">
            {[6, 12, 18, 24, 36, 48, 60].map((p) => (
              <option key={p} value={p}>
                {p} meses
              </option>
            ))}
          </select>
        </InputLabel>

        <InputLabel label={`Ingresos mensuales (${simboloMoneda})`}>
          <input
            name="ingresos"
            type="number"
            value={form.ingresos}
            onChange={handleChange}
            className="input-bbva"
            placeholder="Ej: 3000"
          />
        </InputLabel>

        <InputLabel label="Cuenta de depósito para desembolso">
          <select
            name="cuenta_destino_id"
            value={form.cuenta_destino_id}
            onChange={handleChange}
            className="input-bbva"
          >
            <option value="">Selecciona una cuenta activa</option>
            {cuentas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tipo_cuenta} - {c.numero_cuenta} ({c.moneda})
              </option>
            ))}
          </select>
        </InputLabel>

        <InputLabel label="Propósito del crédito">
          <select name="motivo" value={form.motivo} onChange={handleChange} className="input-bbva">
            <option value="consumo">Consumo / Libre disponibilidad (TEA 41.20%)</option>
            <option value="educacion">Educación (TEA 28.00% simulada)</option>
            <option value="salud">Salud (TEA 30.00% simulada)</option>
            <option value="vivienda">Vivienda (TEA 11.50% simulada)</option>
            <option value="negocio">Negocio (TEA 35.00% simulada)</option>
          </select>
        </InputLabel>

        <div className="mb-6 flex items-start gap-3">
          <input
            type="checkbox"
            id="acepta_contratos"
            className="mt-1"
            defaultChecked={true}
          />
          <label htmlFor="acepta_contratos" className="text-sm text-gray-500">
            Acepto los términos y condiciones de la Solicitud y el Contrato de Préstamo BBVA.
          </label>
        </div>

        <button
          onClick={enviar}
          disabled={loading}
          className="w-full bg-[#0726B4] hover:bg-[#051D80] disabled:bg-gray-300 text-white py-5 rounded-2xl text-lg font-bold transition"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </section>

      <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
        <h3 className="text-3xl font-black text-[#072146] mb-6">
          Revisión rápida
        </h3>

        <div className="space-y-5">
          <Step icon={CheckCircle} text="Registramos tu solicitud." />
          <Step icon={Clock} text="Tu solicitud queda en estado pendiente." />
          <Step icon={ShieldCheck} text="Podrás verla en préstamos activos." />
        </div>
      </section>
    </div>
  );
}

function SolicitudCard({ sol }) {
  const simboloMoneda = sol.moneda === "USD" ? "US$" : "S/";
  return (
    <article className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between gap-5 mb-8">
        <div>
          <p className="text-[#1464A0] text-sm font-bold uppercase tracking-widest mb-2">
            Préstamo personal
          </p>

          <h3 className="text-2xl font-black text-[#072146]">
            Solicitud #{sol.id.slice(0, 8).toUpperCase()}
          </h3>
        </div>

        <span className="bg-[#fff4d6] text-[#8a6500] text-xs font-bold px-4 py-2 rounded-full h-fit capitalize">
          {sol.estado}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <ResultBox label="Monto" value={`${simboloMoneda} ${Number(sol.monto).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`} />
        <ResultBox label="Plazo" value={`${sol.plazo_meses} meses`} />
        <ResultBox label="Cuota" value={`${simboloMoneda} ${Number(sol.cuota_mensual).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`} />
      </div>

      <p className="text-gray-500">
        Propósito: <strong>{sol.proposito || "consumo"}</strong>
      </p>
    </article>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-7 py-4 rounded-2xl font-bold transition ${
        active ? "bg-[#0726B4] text-white" : "text-[#072146] hover:bg-[#f4f8ff]"
      }`}
    >
      {children}
    </button>
  );
}

function CreditInfoCard() {
  return (
    <aside className="bg-[#072146] rounded-[32px] p-10 text-white">
      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
        <CreditCard size={32} />
      </div>

      <h2 className="text-3xl font-black mb-4">
        Crédito personal BBVA
      </h2>

      <p className="text-white/70 leading-relaxed mb-8">
        Simula cuotas y registra solicitudes de préstamo desde tu banca.
      </p>

      <div className="bg-white/10 rounded-2xl p-5">
        <p className="text-white/50 text-sm mb-1">Tasa referencial</p>
        <p className="text-3xl font-black">TCEA Máxima 42.15%</p>
      </div>
    </aside>
  );
}

function RangeField({ label, value, min, max, step, prefix = "", suffix = "", onChange }) {
  return (
    <label className="block mb-8">
      <div className="flex justify-between mb-3">
        <span className="text-[#072146] font-bold">{label}</span>
        <span className="text-[#072146] font-black">
          {prefix} {Number(value).toLocaleString()} {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-[#0726B4]"
      />
    </label>
  );
}

function ResultBox({ label, value }) {
  return (
    <div className="bg-[#f7f8fa] rounded-2xl p-5">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-[#072146] font-black text-xl">{value}</p>
    </div>
  );
}

function InputLabel({ label, children }) {
  return (
    <label className="block mb-6">
      <span className="block text-[#072146] font-bold mb-2">{label}</span>
      {children}
    </label>
  );
}

function Step({ icon: Icon, text }) {
  return (
    <div className="bg-[#f4f8ff] rounded-2xl p-5 flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl bg-[#eaf4ff] text-[#0726B4] flex items-center justify-center shrink-0">
        <Icon size={22} />
      </div>

      <p className="text-[#072146] font-bold">{text}</p>
    </div>
  );
}