import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
    {
        title: "Tu primera tarjeta, sin miedo al crédito",
        text: "Obtén tu Tarjeta de Crédito BBVA y empieza tu historial financiero.",
        button: "Solicítala aquí",
        image:
            "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200",
    },

    {
        title: "Todo con Plin, en un solo toque",
        text: "Paga y recibe dinero fácilmente desde tu celular.",
        button: "Únete a Plin",
        image:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200",
    },

    {
        title: "Tu cuenta sin costo",
        text: "Empieza hoy con una cuenta digital rápida y segura.",
        button: "Abrir cuenta",
        image:
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200",
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    const navigate = useNavigate();

    // AUTOPLAY
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [current]);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    return (
        <section className="py-8 px-6">

            <div
                className="
          max-w-7xl
          mx-auto
          bg-[#f7f7f7]
          rounded-[40px]
          overflow-hidden
          min-h-[700px]
          relative
        "
            >

                {/* SLIDE */}
                <div
                    className="
            grid
            lg:grid-cols-2
            items-center
            h-full
            px-20
            py-20
            gap-10
            transition-all
            duration-700
          "
                >

                    {/* LEFT */}
                    <div className="space-y-10 animate-fade">

                        <span
                            className="
                bg-white
                px-6 py-2
                rounded-full
                text-[#072146]
                italic
                text-lg
              "
                        >
                            Haz más con tu dinero
                        </span>

                        <h1
                            className="
                text-6xl
                lg:text-7xl
                font-black
                text-[#072146]
                leading-tight
              "
                        >
                            {slides[current].title}
                        </h1>

                        <p
                            className="
                text-2xl
                text-gray-700
                leading-relaxed
                max-w-xl
              "
                        >
                            {slides[current].text}
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="
                bg-[#0726B4]
                hover:bg-[#051D80]
                text-white
                px-10 py-5
                rounded-2xl
                font-bold
                text-xl
                transition
                cursor-pointer
              "
                        >
                            {slides[current].button}
                        </button>

                    </div>

                    {/* RIGHT */}
                    <div className="flex justify-center">

                        <img
                            src={slides[current].image}
                            alt=""
                            className="
                w-full
                max-w-2xl
                h-[500px]
                rounded-[40px]
                object-cover
                shadow-xl
                transition-all
                duration-700
              "
                        />

                    </div>
                </div>

                {/* FLECHAS */}
                <button
                    onClick={prevSlide}
                    className="
            absolute
            bottom-8
            left-[45%]
            bg-white
            shadow-md
            p-4
            rounded-full
            hover:scale-110
            transition
          "
                >
                    <ChevronLeft className="text-[#072146]" />
                </button>

                <button
                    onClick={nextSlide}
                    className="
            absolute
            bottom-8
            right-[45%]
            bg-white
            shadow-md
            p-4
            rounded-full
            hover:scale-110
            transition
          "
                >
                    <ChevronRight className="text-[#072146]" />
                </button>

                {/* INDICADORES */}
                <div
                    className="
            absolute
            bottom-10
            left-1/2
            -translate-x-1/2
            flex
            gap-3
          "
                >
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`
                w-3
                h-3
                rounded-full
                transition-all
                ${current === index
                                    ? "bg-[#0726B4] w-8"
                                    : "bg-gray-300"
                                }
              `}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}