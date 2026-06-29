import { Link } from "react-router-dom";

export default function MovementsList({ movimientos, loading }) {
  return (
    <section className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-2xl font-black text-[#072146]">
          Últimos movimientos
        </h2>

        <Link to="/ahorros" className="text-[#0726B4] font-bold hover:underline">
          Ver todos
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 py-10 text-center">Cargando movimientos...</p>
      ) : movimientos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-[#072146] font-bold text-lg">
            Aún no tienes movimientos
          </p>
          <p className="text-gray-500 mt-2">
            Cuando realices transferencias aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {movimientos.map((mov) => (
            <div key={mov.id} className="py-5 flex justify-between gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#eaf4ff] text-[#0726B4] flex items-center justify-center font-black">
                  {mov.tipo === "ingreso" ? "↓" : "↑"}
                </div>

                <div>
                  <p className="text-[#072146] font-bold">
                    {mov.descripcion}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {new Date(mov.fecha).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <p className="font-black text-[#072146]">
                {mov.tipo === "ingreso" ? "+" : "-"}
                {mov.moneda === "USD" ? "US$ " : "S/ "}
                {Math.abs(Number(mov.monto)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}