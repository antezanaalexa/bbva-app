export default function AccountHero({ cuenta }) {
  return (
    <section className="bg-[#f7f8fa] rounded-[32px] px-12 py-12 mb-10 grid lg:grid-cols-[280px_1fr] gap-10 items-center">

      <div className="flex justify-center">
        <div className="w-44 h-44 rounded-full bg-blue-100 flex items-center justify-center text-7xl">
          🐷
        </div>
      </div>

      <div>
        <h1 className="text-5xl font-black text-[#072146] leading-tight mb-4">
          {cuenta.titulo}
        </h1>

        <p className="text-xl text-[#072146] mb-3">
          {cuenta.desc}
        </p>

        <p className="text-[#0726B4] font-bold">
          Aplica términos y condiciones
        </p>
      </div>

    </section>
  );
}