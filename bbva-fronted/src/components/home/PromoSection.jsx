import { Rocket } from "lucide-react";

export default function PromoSection() {
  return (
    <section className="py-20 px-6">

      <div className="
        max-w-7xl
        mx-auto
        bg-[#0726B4]
        rounded-[40px]
        px-16
        py-16
        flex
        items-center
        justify-between
      ">

        <div className="flex items-center gap-10">

          <div className="
            bg-blue-400/20
            p-8
            rounded-3xl
          ">
            <Rocket
              size={70}
              className="text-cyan-300"
            />
          </div>

          <div>
            <h2 className="
              text-white
              text-5xl
              font-black
              mb-4
            ">
              Oportunidades reales
            </h2>

            <p className="
              text-blue-100
              text-xl
              max-w-2xl
            ">
              Soluciones financieras pensadas para ti.
            </p>
          </div>

        </div>

        <button className="
          bg-sky-300
          hover:bg-sky-200
          text-[#072146]
          px-10 py-5
          rounded-2xl
          font-bold
          text-lg
        ">
          Descúbrelas aquí
        </button>

      </div>
    </section>
  );
}