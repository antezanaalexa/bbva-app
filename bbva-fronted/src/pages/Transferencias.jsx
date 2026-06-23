import { useEffect, useState } from "react";
import { ArrowLeftRight, CheckCircle, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import DashboardShell from "../components/dashboard/DashboardShell";

const simbolo = {
  PEN: "S/",
  USD: "US$",
};

const monedaLabel = {
  PEN: "Soles",
  USD: "Dólares",
};

export default function Transferencias() {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    cuenta_id: "",
    destino: "",
    monto: "",
    concepto: "",
  });

  const nombreUsuario =
    user?.user_metadata?.nombres || user?.email?.split("@")[0] || "Cliente";

  useEffect(() => {
    const cargarCuentas = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const res = await api.get(`/api/cuentas/${user.id}`);
        const data = res.data.data || [];

        setCuentas(data);

        if (data.length > 0) {
          setForm((prev) => ({
            ...prev,
            cuenta_id: data[0].id,
          }));
        }
      } catch (err) {
        console.error("Error cargando cuentas:", err);
        setError("No se pudieron cargar tus cuentas.");
      } finally {
        setLoading(false);
      }
    };

    cargarCuentas();
  }, [user]);

  const cuentaOrigen = cuentas.find((c) => c.id === form.cuenta_id);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validar = () => {
    setError("");

    if (!form.cuenta_id) {
      setError("Selecciona una cuenta de origen.");
      return false;
    }

    if (!form.destino.trim()) {
      setError("Ingresa el número de cuenta destino.");
      return false;
    }

    if (!form.monto || Number(form.monto) <= 0) {
      setError("Ingresa un monto válido.");
      return false;
    }

    if (Number(form.monto) > Number(cuentaOrigen?.saldo || 0)) {
      setError("No tienes saldo suficiente para realizar esta transferencia.");
      return false;
    }

    return true;
  };

  const continuar = () => {
    if (!validar()) return;
    setStep(2);
  };

  const confirmarTransferencia = async () => {
    try {
      setProcesando(true);
      setError("");

      const response = await api.post("/api/transacciones/transferir", {
        user_id: user.id,
        cuenta_origen_id: form.cuenta_id,
        cuenta_destino_numero: form.destino,
        monto: Number(form.monto),
        concepto: form.concepto || "Transferencia enviada",
      });

      if (response.data.success === false) {
        setError(response.data.message || "No se pudo realizar la transferencia.");
        return;
      }
      const res = await api.get(`/api/cuentas/${user.id}`);
      setCuentas(res.data.data || []);
      
      setStep(3);
      
    } catch (err) {
      console.error("Error transfiriendo:", err);
      setError("No se pudo realizar la transferencia.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <DashboardShell title="Transferencias y Pagos" nombreUsuario={nombreUsuario}>
      <section className="mb-10">
        <span className="text-[#1464A0] font-bold text-sm uppercase tracking-widest">
          Operaciones
        </span>

        <h1 className="text-5xl font-black text-[#072146] mt-2">
          Transferencias
        </h1>

        <p className="text-gray-500 text-xl mt-3">
          Envía dinero desde tus cuentas BBVA de forma rápida y segura.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
          <Stepper step={step} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500 py-10 text-center">
              Cargando tus cuentas...
            </p>
          ) : cuentas.length === 0 ? (
            <div className="text-center py-12">
              <ArrowLeftRight size={48} className="mx-auto text-[#0726B4] mb-4" />

              <h2 className="text-2xl font-black text-[#072146] mb-2">
                No tienes cuentas disponibles
              </h2>

              <p className="text-gray-500">
                Abre una cuenta para poder transferir.
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <InputLabel label="Cuenta origen">
                    <select
                      name="cuenta_id"
                      value={form.cuenta_id}
                      onChange={handleChange}
                      className="input-bbva"
                    >
                      {cuentas.map((cuenta) => (
                        <option key={cuenta.id} value={cuenta.id}>
                          {cuenta.tipo_cuenta || "Cuenta BBVA"} -{" "}
                          {monedaLabel[cuenta.moneda] || cuenta.moneda} -{" "}
                          {simbolo[cuenta.moneda] || "S/"}{" "}
                          {Number(cuenta.saldo || 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </InputLabel>

                  <InputLabel label="Número de cuenta destino">
                    <input
                      name="destino"
                      value={form.destino}
                      onChange={handleChange}
                      placeholder="Ej: 0011-0814-0000000000"
                      className="input-bbva"
                    />
                  </InputLabel>

                  <InputLabel label="Monto">
                    <input
                      name="monto"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.monto}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="input-bbva"
                    />
                  </InputLabel>

                  <InputLabel label="Concepto opcional">
                    <input
                      name="concepto"
                      value={form.concepto}
                      onChange={handleChange}
                      placeholder="Ej: Pago alquiler"
                      className="input-bbva"
                    />
                  </InputLabel>

                  <button
                    type="button"
                    onClick={continuar}
                    className="w-full bg-[#0726B4] hover:bg-[#051D80] text-white py-5 rounded-2xl text-xl font-bold transition flex justify-center items-center gap-2"
                  >
                    Continuar
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-3xl font-black text-[#072146] mb-6">
                    Confirma tu transferencia
                  </h2>

                  <div className="bg-[#f7f8fa] rounded-3xl p-6 mb-8 space-y-5">
                    <Resumen label="Cuenta origen" value={cuentaOrigen?.numero_cuenta} />
                    <Resumen label="Cuenta destino" value={form.destino} />
                    <Resumen
                      label="Monto"
                      value={`${simbolo[cuentaOrigen?.moneda] || "S/"} ${Number(
                        form.monto
                      ).toFixed(2)}`}
                    />
                    <Resumen
                      label="Concepto"
                      value={form.concepto || "Transferencia enviada"}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-white border border-gray-300 text-[#072146] py-5 rounded-2xl font-bold"
                    >
                      Volver
                    </button>

                    <button
                      type="button"
                      disabled={procesando}
                      onClick={confirmarTransferencia}
                      className="flex-1 bg-[#0726B4] hover:bg-[#051D80] disabled:bg-gray-300 text-white py-5 rounded-2xl font-bold"
                    >
                      {procesando ? "Procesando..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-[#eaf4ff] text-[#0726B4] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={56} />
                  </div>

                  <h2 className="text-4xl font-black text-[#072146] mb-4">
                    Transferencia enviada
                  </h2>

                  <p className="text-gray-500 text-lg mb-8">
                    Tu operación fue registrada correctamente.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setForm({
                        cuenta_id: cuentas[0]?.id || "",
                        destino: "",
                        monto: "",
                        concepto: "",
                      });
                    }}
                    className="bg-[#0726B4] hover:bg-[#051D80] text-white px-10 py-5 rounded-2xl font-bold"
                  >
                    Nueva transferencia
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <aside className="bg-[#072146] rounded-[32px] p-10 text-white h-fit">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <ArrowLeftRight size={32} />
          </div>

          <h2 className="text-3xl font-black mb-4">Opera con seguridad</h2>

          <p className="text-white/70 leading-relaxed">
            Verifica siempre el número de cuenta destino antes de confirmar la operación.
          </p>

          <div className="mt-8 bg-white/10 rounded-2xl p-5">
            <p className="text-white/50 text-sm mb-1">Disponible</p>
            <p className="text-2xl font-black">
              {simbolo[cuentaOrigen?.moneda] || "S/"}{" "}
              {Number(cuentaOrigen?.saldo || 0).toFixed(2)}
            </p>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Stepper({ step }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <Step active={step >= 1} number="1" label="Datos" />
      <div className="h-px bg-gray-200 flex-1" />
      <Step active={step >= 2} number="2" label="Confirmar" />
      <div className="h-px bg-gray-200 flex-1" />
      <Step active={step >= 3} number="3" label="Listo" />
    </div>
  );
}

function Step({ active, number, label }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
          active ? "bg-[#0726B4] text-white" : "bg-gray-200 text-gray-400"
        }`}
      >
        {number}
      </div>

      <span className={active ? "text-[#072146] font-bold" : "text-gray-400"}>
        {label}
      </span>
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

function Resumen({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-[#072146] font-black text-lg break-all">{value}</p>
    </div>
  );
}