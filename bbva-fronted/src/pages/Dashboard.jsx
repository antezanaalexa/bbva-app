import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import DashboardShell from "../components/dashboard/DashboardShell";
import BalanceSummary from "../components/dashboard/BalanceSummary";
import AccountCard from "../components/dashboard/AccountCard";
import MovementsList from "../components/dashboard/MovementsList";

export default function Dashboard() {
  const { user } = useAuth();

  const [showSaldo, setShowSaldo] = useState(true);
  const [cuentas, setCuentas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const nombreUsuario =
    user?.user_metadata?.nombres || user?.email?.split("@")[0] || "Cliente";

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError("");

        const cuentasRes = await api.get(`/api/cuentas/${user.id}`);
        setCuentas(cuentasRes.data.data || []);

        const movimientosRes = await api.get(`/api/transacciones/${user.id}`);
        const movimientosAdaptados = (movimientosRes.data.data || []).map((m) => ({
          ...m,
          tipo: m.tipo === "credito" ? "ingreso" : "egreso",
        }));

        setMovimientos(movimientosAdaptados);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setError("No se pudo cargar tu información bancaria.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  const saldoPEN = cuentas
    .filter((c) => c.moneda === "PEN")
    .reduce((sum, c) => sum + Number(c.saldo || 0), 0);

  const saldoUSD = cuentas
    .filter((c) => c.moneda === "USD")
    .reduce((sum, c) => sum + Number(c.saldo || 0), 0);

  return (
    <DashboardShell title="Banca por Internet" nombreUsuario={nombreUsuario}>
      <section className="mb-10">
        <h1 className="text-5xl font-black text-[#072146] mb-3">
          Hola, {nombreUsuario}
        </h1>

        <p className="text-gray-500 text-xl">
          Este es el resumen de tus productos BBVA.
        </p>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-8">
          {error}
        </div>
      )}

      <BalanceSummary
        saldoPEN={saldoPEN}
        saldoUSD={saldoUSD}
        showSaldo={showSaldo}
        onToggle={() => setShowSaldo(!showSaldo)}
      />

      <section className="mb-10">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="text-[#1464A0] font-bold text-sm uppercase tracking-widest">
              Productos
            </span>

            <h2 className="text-4xl font-black text-[#072146] mt-2">
              Mis cuentas
            </h2>
          </div>

          <button className="bg-[#0726B4] hover:bg-[#051D80] text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition">
            <Plus size={20} />
            Abrir nueva cuenta
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-[28px] p-12 text-center text-gray-500">
            Cargando tus productos...
          </div>
        ) : cuentas.length === 0 ? (
          <div className="bg-white rounded-[28px] p-12 text-center">
            <h3 className="text-2xl font-black text-[#072146] mb-3">
              Aún no tienes cuentas registradas
            </h3>
            <p className="text-gray-500">
              Abre una cuenta para empezar a usar tu Banca por Internet.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-7">
            {cuentas.map((cuenta) => (
              <AccountCard
                key={cuenta.id}
                cuenta={cuenta}
                showSaldo={showSaldo}
              />
            ))}
          </div>
        )}
      </section>

      <MovementsList movimientos={movimientos} loading={loading} />
    </DashboardShell>
  );
}