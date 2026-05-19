// components/home/ProductsSection.jsx
import { Link } from "react-router-dom";

const products = [
  {
    categoria: "Tarjetas",
    titulo: "Tarjetas de Crédito",
    desc: "Elige la tarjeta que se adapta a ti y gana puntos en cada compra.",
    img: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80",
    link: "#",
    badge: "Más solicitada",
  },
  {
    categoria: "Cuentas",
    titulo: "Cuenta Digital BBVA",
    desc: "Abre tu cuenta en minutos desde tu celular, sin ir al banco.",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80",
    link: "#",
    badge: null,
  },
  {
    categoria: "Préstamos",
    titulo: "Préstamo Online",
    desc: "Dinero en tu cuenta en minutos. Sin trámites presenciales.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    link: "#",
    badge: "Nuevo",
  },
  {
    categoria: "Seguros",
    titulo: "Seguro de Vida BBVA",
    desc: "Protege lo que más importa con las mejores coberturas del mercado.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    link: "#",
    badge: null,
  },
];

export default function ProductsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#1464A0] font-semibold text-sm uppercase tracking-widest">
              Nuestros productos
            </span>
            <h2 className="text-5xl font-black text-[#072146] mt-2 leading-tight">
              Todo lo que necesitas,<br />en un solo lugar
            </h2>
          </div>
          <a
            href="#"
            className="hidden lg:block text-[#004481] font-semibold text-sm hover:underline"
          >
            Ver todos los productos →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Imagen */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={p.img}
                  alt={p.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {p.badge && (
                  <span className="absolute top-3 left-3 bg-[#0726B4] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Contenido */}
              <div className="p-6">
                <span className="text-xs font-semibold text-[#1464A0] uppercase tracking-wider">
                  {p.categoria}
                </span>
                <h3 className="text-lg font-bold text-[#072146] mt-1 mb-2">
                  {p.titulo}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {p.desc}
                </p>
                <a
                  href={p.link}
                  className="text-sm font-bold text-[#004481] hover:underline"
                >
                  Conoce más →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}