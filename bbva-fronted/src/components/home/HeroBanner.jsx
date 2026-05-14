import heroImage from '../assets/hero.png'

export default function HeroBanner() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 rounded-[32px] bg-[#f2f4f7] px-16 py-20 lg:grid-cols-2">

        {/* Texto */}
        <div>

          <span className="rounded-full bg-white px-4 py-2 text-sm text-[#072146] shadow-sm">
            Tarjeta de Crédito BBVA
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight text-[#072146]">
            ¡Queremos verte en la tribuna!
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Gana uno de los dos paquetes dobles a la Copa Mundial de la FIFA 2026™ gracias a Visa.
          </p>

          {/* Botones */}
          <div className="mt-10 flex gap-5">

            <button className="rounded-2xl bg-[#072ac8] px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]">
              Solicítala aquí
            </button>

            <button className="rounded-2xl bg-white px-8 py-4 font-semibold text-[#072146] shadow-sm transition hover:bg-gray-50">
              Inscríbete aquí
            </button>

          </div>
        </div>

        {/* Imagen */}
        <div className="relative">
          <img
            src={heroImage}
            alt="BBVA"
            className="rounded-[28px] shadow-2xl"
          />
        </div>

      </div>
    </section>
  )
}