export default function RegisterHero() {
  return (
    <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 flex flex-col justify-center">

      <h2 className="text-5xl font-black text-[#072146] leading-tight mb-6">
        Abre tu cuenta BBVA
      </h2>

      <p className="text-gray-600 text-xl leading-relaxed mb-10">
        Elige tu cuenta, completa tus datos y empieza a usar tu banca digital.
      </p>

      <div className="bg-[#f4f8ff] rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-[#072146] mb-4">
          Beneficios
        </h3>

        <ul className="space-y-3 text-gray-600">
          <li>✓ Cuenta en soles o dólares</li>
          <li>✓ Acceso desde Banca por Internet</li>
          <li>✓ Transferencias entre cuentas</li>
          <li>✓ Apertura inmediata</li>
        </ul>
      </div>

    </div>
  );
}