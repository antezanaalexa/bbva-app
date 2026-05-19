// components/home/BenefitsSection.jsx
import { Shield, Zap, Smartphone, HeadphonesIcon } from "lucide-react";

const benefits = [
  {
    icon: Smartphone,
    titulo: "100% Digital",
    desc: "Abre tu cuenta, pide préstamos y gestiona todo desde la app BBVA.",
    color: "bg-blue-50",
    iconColor: "text-[#004481]",
  },
  {
    icon: Zap,
    titulo: "Rápido y fácil",
    desc: "Operaciones en segundos. Sin filas, sin esperas, sin complicaciones.",
    color: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    icon: Shield,
    titulo: "100% Seguro",
    desc: "Tu dinero protegido con los más altos estándares de seguridad bancaria.",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: HeadphonesIcon,
    titulo: "Soporte 24/7",
    desc: "Atención personalizada todos los días del año para ayudarte.",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 px-6 bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#1464A0] font-semibold text-sm uppercase tracking-widest">
            ¿Por qué BBVA?
          </span>
          <h2 className="text-5xl font-black text-[#072146] mt-2">
            Tu banco de confianza
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 ${b.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={28} className={b.iconColor} />
                </div>
                <h3 className="text-xl font-bold text-[#072146] mb-3">
                  {b.titulo}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}