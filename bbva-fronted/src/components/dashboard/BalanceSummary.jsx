import { Eye, EyeOff } from "lucide-react";

export default function BalanceSummary({ saldoPEN, saldoUSD, showSaldo, onToggle }) {
  return (
    <section className="bg-[#072146] rounded-[32px] p-10 text-white mb-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-lg mb-3">Saldo total disponible</p>

          <div className="flex flex-wrap gap-10">
            <div>
              <p className="text-white/50 text-sm mb-1">Soles</p>
              <h2 className="text-5xl font-black">
                {showSaldo ? `S/ ${saldoPEN.toFixed(2)}` : "S/ ****"}
              </h2>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-1">Dólares</p>
              <h2 className="text-5xl font-black">
                {showSaldo ? `US$ ${saldoUSD.toFixed(2)}` : "US$ ****"}
              </h2>
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition"
        >
          {showSaldo ? <Eye /> : <EyeOff />}
        </button>
      </div>
    </section>
  );
}