import {
  UserPlus,
  Wallet,
  CreditCard,
  Landmark,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

const actions = [
  {
    icon: UserPlus,
    title: "Hazte Cliente",
  },
  {
    icon: Wallet,
    title: "Afiliarse a Plin",
  },
  {
    icon: CreditCard,
    title: "Tarjeta de Crédito",
  },
  {
    icon: Landmark,
    title: "Necesito un préstamo",
  },
  {
    icon: PiggyBank,
    title: "Cuenta de ahorros",
  },
  {
    icon: TrendingUp,
    title: "Invertir dinero",
  },
];

export default function QuickActions() {
  return (
    <section className="py-24 bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-[#072146] leading-tight">
            Tú decides el ritmo.
            <br />
            Nosotros te damos las herramientas
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

          {actions.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  bg-white
                  rounded-3xl
                  p-8
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  duration-300
                  cursor-pointer
                  hover:-translate-y-2
                  border border-gray-100
                  min-h-[240px]
                  flex flex-col
                  justify-between
                "
              >
                <div>
                  <div className="
                    w-16 h-16
                    rounded-2xl
                    bg-blue-50
                    flex items-center justify-center
                    mb-8
                  ">
                    <Icon
                      size={34}
                      className="text-[#1464A0]"
                    />
                  </div>

                  <h3 className="
                    text-[#072146]
                    font-bold
                    text-xl
                    leading-snug
                  ">
                    {item.title}
                  </h3>
                </div>

                <button className="
                  mt-8
                  text-[#1464A0]
                  font-semibold
                  text-sm
                  hover:underline
                ">
                  Ver más →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}