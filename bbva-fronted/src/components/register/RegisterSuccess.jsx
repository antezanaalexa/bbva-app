import { Check, Copy, Info } from "lucide-react";

export default function RegisterSuccess({ cuenta, cuentaCreada, moneda, email, onGoDashboard }) {
  return (
    <div className="max-w-7xl mx-auto">
      <section className="bg-[#eaf4ff] rounded-[40px] px-10 py-16 text-center mb-10">
        <div className="w-24 h-24 rounded-full bg-[#0726B4] mx-auto flex items-center justify-center mb-7">
          <Check size={56} className="text-white" />
        </div>

        <h1 className="text-5xl font-black text-[#072146] mb-4">
          ¡Felicidades!
        </h1>

        <h2 className="text-4xl font-black text-[#072146]">
          Ya tienes tu {cuenta.nombre} BBVA
        </h2>

        <p className="text-[#374151] text-xl mt-5">
          Tu cuenta fue creada correctamente y ya puedes verla en tu Banca por Internet.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-black text-[#072146] mb-5">
            Próximos pasos
          </h3>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Te enviaremos los documentos contractuales a tu correo. En esta simulación,
            la aceptación se realizó mediante firma electrónica simplificada.
          </p>

          <div className="space-y-5">
            <StepText text="Ingresa a Banca por Internet con tu DNI y contraseña." />
            <StepText text="Consulta el número de cuenta y CCI." />
            <StepText text="Abre cuentas adicionales si lo necesitas." />
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-black text-[#072146] mb-8">
            Datos de la cuenta
          </h3>

          <InfoRow label="Producto" value={`${cuenta.nombre} BBVA`} />
          <InfoRow label="Número de cuenta" value={cuentaCreada?.numero_cuenta} copy />
          <InfoRow label="CCI" value={cuentaCreada?.cci} copy />
          <InfoRow label="Moneda" value={moneda === "PEN" ? "Soles" : "Dólares"} />
          <InfoRow label="Saldo inicial" value={moneda === "PEN" ? "S/ 0.00" : "US$ 0.00"} />
          <InfoRow label="Correo" value={email} />

          <div className="flex items-start gap-3 text-sm text-gray-500 mt-8">
            <Info size={18} />
            <p>Te enviaremos los documentos contractuales de esta contratación por este correo.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 mt-10">
        <button
          onClick={onGoDashboard}
          className="bg-[#0726B4] hover:bg-[#051D80] text-white px-10 py-5 rounded-2xl font-bold text-lg transition"
        >
          Ir a Banca por Internet
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, copy }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="text-[#072146] text-base">{label}</p>
        <p className="font-bold text-[#072146] text-lg break-all">
          {value || "---"}
        </p>
      </div>

      {copy && <Copy className="text-[#0726B4] shrink-0" />}
    </div>
  );
}

function StepText({ text }) {
  return (
    <div className="bg-[#f4f8ff] rounded-2xl p-5 flex gap-4 items-start">
      <div className="w-8 h-8 rounded-full bg-[#0726B4] flex items-center justify-center shrink-0">
        <Check size={18} className="text-white" />
      </div>
      <p className="text-[#072146] text-lg">{text}</p>
    </div>
  );
}