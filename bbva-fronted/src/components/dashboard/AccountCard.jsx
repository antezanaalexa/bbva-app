import { Link } from "react-router-dom";
import { ChevronRight, Copy } from "lucide-react";

const monedaLabel = {
  PEN: "Soles",
  USD: "Dólares",
};

const simbolo = {
  PEN: "S/",
  USD: "US$",
};

export default function AccountCard({ cuenta, showSaldo }) {
  return (
    <article className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between gap-5 mb-8">
        <div>
          <p className="text-[#1464A0] text-sm font-bold uppercase tracking-widest mb-2">
            {cuenta.tipo_cuenta || "Cuenta BBVA"}
          </p>

          <h3 className="text-2xl font-black text-[#072146]">
            {monedaLabel[cuenta.moneda] || cuenta.moneda}
          </h3>
        </div>

        <span className="bg-[#eaf4ff] text-[#0726B4] text-xs font-bold px-4 py-2 rounded-full h-fit">
          {cuenta.estado || "activa"}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <Info label="Número de cuenta" value={cuenta.numero_cuenta} />
        <Info label="CCI" value={cuenta.cci || "No registrado"} />
      </div>

      <p className="text-gray-500 text-sm mb-2">Saldo disponible</p>

      <h2 className="text-4xl font-black text-[#072146] mb-8">
        {showSaldo
          ? `${simbolo[cuenta.moneda] || "S/"} ${Number(cuenta.saldo || 0).toFixed(2)}`
          : `${simbolo[cuenta.moneda] || "S/"} ****`}
      </h2>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/transferencias"
          className="bg-[#0726B4] hover:bg-[#051D80] text-white px-5 py-3 rounded-2xl font-bold transition inline-flex items-center gap-2"
        >
          Transferir
          <ChevronRight size={18} />
        </Link>

        <Link
          to="/ahorros"
          className="bg-[#f4f5f7] hover:bg-gray-200 text-[#072146] px-5 py-3 rounded-2xl font-bold transition"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-[#f7f8fa] rounded-2xl px-5 py-4 flex justify-between gap-4">
      <div>
        <p className="text-gray-500 text-xs mb-1">{label}</p>
        <p className="text-[#072146] font-bold break-all">{value}</p>
      </div>
      <Copy size={18} className="text-[#0726B4] shrink-0 mt-4" />
    </div>
  );
}