import { useEffect, useState } from "react";
import { Download, ArrowDownLeft, ArrowUpRight, FileText, Wallet } from "lucide-react";
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

export default function Ahorros() {
  const { user } = useAuth();

  const [cuentas, setCuentas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);

  const nombreUsuario =
    user?.user_metadata?.nombres || user?.email?.split("@")[0] || "Cliente";

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const cuentasRes = await api.get(`/api/cuentas/${user.id}`);
        const cuentasData = cuentasRes.data.data || [];

        setCuentas(cuentasData);

        if (cuentasData.length > 0) {
          setCuentaSeleccionada(cuentasData[0].id);
        }

        const movimientosRes = await api.get(`/api/transacciones/${user.id}`);
        setMovimientos(movimientosRes.data.data || []);
      } catch (error) {
        console.error("Error cargando ahorros:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  const cuentaActual = cuentas.find((c) => c.id === cuentaSeleccionada);

  const movimientosCuenta = movimientos.filter(
    (m) => m.cuenta_id === cuentaSeleccionada
  );

  return (
    <DashboardShell title="Mis Ahorros" nombreUsuario={nombreUsuario}>
      <section className="mb-10">
        <span className="text-[#1464A0] font-bold text-sm uppercase tracking-widest">
          Productos de ahorro
        </span>

        <h1 className="text-5xl font-black text-[#072146] mt-2">
          Mis ahorros
        </h1>

        <p className="text-gray-500 text-xl mt-3">
          Consulta tus cuentas, saldos y últimos movimientos.
        </p>
      </section>

      {loading ? (
        <div className="bg-white rounded-[32px] p-12 text-center text-gray-500">
          Cargando tus cuentas...
        </div>
      ) : cuentas.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 text-center">
          <Wallet size={48} className="mx-auto text-[#0726B4] mb-4" />

          <h2 className="text-3xl font-black text-[#072146] mb-3">
            No tienes cuentas de ahorro
          </h2>

          <p className="text-gray-500">
            Abre una cuenta para empezar a ahorrar con BBVA.
          </p>
        </div>
      ) : (
        <>
          <section className="bg-[#072146] rounded-[32px] p-10 text-white mb-8">
            <div className="flex flex-wrap justify-between gap-8">
              <div>
                <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
                  Cuenta seleccionada
                </p>

                <select
                  value={cuentaSeleccionada}
                  onChange={(e) => setCuentaSeleccionada(e.target.value)}
                  className="bg-white text-[#072146] rounded-2xl px-5 py-4 font-bold outline-none mb-8"
                >
                  {cuentas.map((cuenta) => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.tipo_cuenta || "Cuenta BBVA"} -{" "}
                      {monedaLabel[cuenta.moneda] || cuenta.moneda}
                    </option>
                  ))}
                </select>

                <h2 className="text-5xl font-black">
                  {simbolo[cuentaActual?.moneda] || "S/"}{" "}
                  {Number(cuentaActual?.saldo || 0).toFixed(2)}
                </h2>

                <p className="text-white/60 mt-2">
                  Saldo disponible
                </p>
              </div>

              <div className="bg-white/10 rounded-3xl p-6 min-w-[280px]">
                <Info label="Número de cuenta" value={cuentaActual?.numero_cuenta} />
                <Info label="CCI" value={cuentaActual?.cci || "No registrado"} />
                <Info label="Moneda" value={monedaLabel[cuentaActual?.moneda]} />
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-4 gap-5 mb-8">
            <ActionCard icon={ArrowUpRight} title="Transferir" />
            <ActionCard icon={ArrowDownLeft} title="Depositar" />
            <ActionCard icon={FileText} title="Estado de cuenta" />
            <ActionCard icon={Download} title="Descargar" />
          </section>

          <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-[#072146]">
                Estado de cuenta
              </h2>

              <button className="bg-[#0726B4] hover:bg-[#051D80] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition">
                <Download size={18} />
                Descargar PDF
              </button>
            </div>

            {movimientosCuenta.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>

                <p className="text-[#072146] font-bold text-xl">
                  No hay movimientos en esta cuenta
                </p>

                <p className="text-gray-500 mt-2">
                  Cuando realices operaciones aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {movimientosCuenta.map((mov) => (
                  <div key={mov.id} className="py-5 flex justify-between gap-6">
                    <div>
                      <p className="text-[#072146] font-bold">
                        {mov.descripcion}
                      </p>

                      <p className="text-gray-400 text-sm">
                        {new Date(mov.fecha).toLocaleDateString("es-PE")}
                      </p>
                    </div>

                    <p className="font-black text-[#072146]">
                      {mov.tipo === "credito" ? "+" : "-"}
                      {simbolo[cuentaActual?.moneda] || "S/"}{" "}
                      {Math.abs(Number(mov.monto)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </DashboardShell>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="text-white/50 text-sm mb-1">{label}</p>
      <p className="text-white font-bold break-all">{value || "---"}</p>
    </div>
  );
}

function ActionCard({ icon: Icon, title }) {
  return (
    <button className="bg-white hover:bg-[#f4f8ff] rounded-[24px] p-6 shadow-sm border border-gray-100 transition text-left">
      <div className="w-12 h-12 rounded-2xl bg-[#eaf4ff] text-[#0726B4] flex items-center justify-center mb-5">
        <Icon size={24} />
      </div>

      <p className="text-[#072146] font-black">{title}</p>
    </button>
  );
}