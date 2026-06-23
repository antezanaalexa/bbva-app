import mobileGlass from "../../assets/mobile-glass.avif";

export default function LoginPromo() {
  return (
    <section className="bg-white rounded-[28px] px-8 py-10 shadow-sm border border-gray-200 relative overflow-hidden min-h-[470px]">
      <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-[#FFE45C] text-[#072146] font-black flex items-center justify-center">
        ¡Nuevo!
      </div>

      <img
        src={mobileGlass}
        alt="BBVA"
        className="w-[180px] mx-auto mb-8 object-contain"
      />

      <h2 className="text-[38px] leading-[1.1] font-black text-[#072146] mb-5">
        Hazte cliente BBVA,
        <br />
        sin trámites ni colas.
      </h2>

      <p className="text-[#072146] text-lg leading-relaxed mb-8 max-w-[380px]">
        Abre tu Cuenta Digital en minutos y empieza a ahorrar desde donde estés.
      </p>

      <button className="bg-[#0726B4] hover:bg-[#051D80] text-white h-[56px] px-10 rounded-xl text-lg font-bold shadow-md transition">
        Descarga aquí
      </button>
    </section>
  );
}