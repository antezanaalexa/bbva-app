// components/home/AppDownloadSection.jsx
import { Smartphone, Star, Download } from "lucide-react";

export default function AppDownloadSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#072146] rounded-[40px] px-16 py-16 grid lg:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <div>
            <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">
              App BBVA Perú
            </span>
            <h2 className="text-5xl font-black text-white mt-3 mb-6 leading-tight">
              Tu banco en el bolsillo, siempre contigo
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-10">
              Descarga la app y gestiona tu dinero donde estés. Transferencias, pagos, préstamos y mucho más.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-10">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-white font-bold">4.8</span>
              <span className="text-blue-300 text-sm">+500,000 descargas</span>
            </div>

            {/* Botones */}
            <div className="flex gap-4 flex-wrap">
              <button className="flex items-center gap-3 bg-white text-[#072146] px-6 py-4 rounded-2xl font-bold hover:bg-gray-100 transition">
                <Smartphone size={22} />
                App Store
              </button>
              <button className="flex items-center gap-3 bg-white text-[#072146] px-6 py-4 rounded-2xl font-bold hover:bg-gray-100 transition">
                <Download size={22} />
                Google Play
              </button>
            </div>
          </div>

          {/* Imagen / Mock */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Teléfono simulado */}
              <div className="w-64 h-[480px] bg-white rounded-[40px] shadow-2xl border-4 border-white flex flex-col overflow-hidden">
                {/* Header app */}
                <div className="bg-[#004481] px-6 py-8">
                  <p className="text-blue-200 text-xs mb-1">Bienvenido</p>
                  <p className="text-white font-bold text-lg">Mi BBVA</p>
                  <p className="text-white text-3xl font-black mt-4">S/ 3,250.80</p>
                  <p className="text-blue-200 text-xs mt-1">Saldo disponible</p>
                </div>
                {/* Acciones */}
                <div className="flex justify-around py-5 border-b border-gray-100">
                  {["Pagar", "Transferir", "Recargar"].map((a) => (
                    <div key={a} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#004481] rounded-sm"></div>
                      </div>
                      <span className="text-xs text-gray-500">{a}</span>
                    </div>
                  ))}
                </div>
                {/* Movimientos */}
                <div className="px-4 py-4 flex-1">
                  <p className="text-xs font-bold text-gray-400 mb-3">ÚLTIMOS MOVIMIENTOS</p>
                  {[
                    { desc: "Transferencia recibida", monto: "+S/ 500", color: "text-green-600" },
                    { desc: "Pago Luz del Sur", monto: "-S/ 89.50", color: "text-red-500" },
                    { desc: "Compra Plaza Vea", monto: "-S/ 230", color: "text-red-500" },
                  ].map((m, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-600 truncate max-w-[120px]">{m.desc}</span>
                      <span className={`text-xs font-bold ${m.color}`}>{m.monto}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decoración */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}