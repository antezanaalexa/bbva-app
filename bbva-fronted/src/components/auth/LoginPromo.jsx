export default function LoginPromo() {
  return (
    <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 flex flex-col justify-center">

      <div className="mb-8">
        <img
          src="/phone.png"
          alt="BBVA"
          className="w-40 mx-auto"
        />
      </div>

      <h2 className="text-5xl font-black text-[#072146] leading-tight mb-6">
        Hazte cliente BBVA,
        <br />
        sin trámites ni colas.
      </h2>

      <p className="text-gray-600 text-xl leading-relaxed mb-10">
        Abre tu Cuenta Digital en minutos y empieza a ahorrar desde donde estés.
      </p>

      <button className="bg-[#0726B4] hover:bg-[#051D80] text-white py-5 rounded-2xl text-xl font-bold transition">
        Descarga aquí
      </button>

    </div>
  );
}