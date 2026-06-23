function Row({ label, value }) {
  return (
    <div className="flex justify-between py-3">
      <span className="text-[#072146]">{label}</span>
      <span className="font-bold text-[#072146] text-right">{value}</span>
    </div>
  );
}

export default function AccountDetail({ cuenta, moneda }) {
  return (
    <aside className="bg-[#f7f8fa] rounded-[28px] p-8 h-fit">
      <h3 className="text-2xl font-bold text-[#072146] mb-5">
        Detalle de tu cuenta
      </h3>

      <div className="bg-white rounded-2xl p-7">
        <h4 className="text-2xl font-bold text-[#072146] mb-6">
          {cuenta.nombre}
        </h4>

        <Row label="Moneda" value={moneda === "PEN" ? "Soles" : "Dólares"} />
        <Row label="Tipo de Tarjeta" value="Débito" />
        <Row label="Mantenimiento" value={cuenta.mantenimiento} />
        <Row label="TEA" value={cuenta.tea} />
        <Row label="TREA" value={cuenta.trea} />
      </div>
    </aside>
  );
}