import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cuentaGanadoraBBVA from "../../assets/cuenta-ganadora-bbva.jpg";

const slides = [
    {
        title: "Gana hasta S/10 millones con Cuenta Ganadora",
        text: "Ahorra desde S/1,500 y participa en \"Atrapa tus Sueños\". Gana premios increíbles, experiencias únicas, viajes y más!",
        button: "Abrir cuenta",
        secondaryButton: "Mira el programa",
        image: cuentaGanadoraBBVA,
        link: "/registro"
    },

    {
        title: "Tu primera tarjeta, sin costo de membresía",
        text: "Obtén tu Tarjeta de Crédito BBVA y empieza tu historial financiero hoy mismo.",
        button: "Solicítala aquí",
        image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200",
        link: "/registro"
    },

    {
        title: "Cuenta Digital BBVA sin mantenimiento",
        text: "Abre tu cuenta 100% online y sin costo. Maneja tu dinero sin comisiones.",
        button: "Abrir cuenta",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200",
        link: "/registro"
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
        <section className="py-6 px-6">
            <div
                className="
                    max-w-7xl
                    mx-auto
                    bg-white
                    rounded-[32px]
                    overflow-hidden
                    relative
                    shadow-lg
                    border border-gray-100
                "
            >
                {/* SLIDE - key={current} resets animation and prevents text overlay */}
                <div
                    key={current}
                    className="
                        grid
                        lg:grid-cols-2
                        items-center
                        px-10
                        py-12
                        lg:px-16
                        lg:py-16
                        gap-8
                        transition-all
                        duration-700
                    "
                >
                    {/* LEFT COLUMN: Text and Buttons */}
                    <div className="space-y-6 animate-fade">
                        <div>
                            <span
                                className="
                                    bg-gray-100
                                    px-4 py-1.5
                                    rounded-full
                                    text-[#072146]
                                    font-semibold
                                    text-xs
                                    shadow-sm
                                "
                            >
                                Haz más con tu dinero
                            </span>
                        </div>

                        <h1
                            className="
                                text-5xl
                                lg:text-[54px]
                                font-extrabold
                                text-[#072146]
                                leading-tight
                                tracking-tight
                            "
                        >
                            {slides[current].title}
                        </h1>

                        <p
                            className="
                                text-[17px]
                                lg:text-[18px]
                                text-[#4A5568]
                                leading-relaxed
                                max-w-lg
                            "
                        >
                            {slides[current].text}
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                onClick={() => navigate(slides[current].link || "/registro")}
                                className="
                                    bg-[#0726B4]
                                    hover:bg-[#051D80]
                                    text-white
                                    px-6 py-3.5
                                    rounded-xl
                                    font-bold
                                    text-[15px]
                                    transition-all
                                    duration-300
                                    hover:scale-[1.02]
                                    cursor-pointer
                                "
                            >
                                {slides[current].button}
                            </button>
                            {slides[current].secondaryButton && (
                                <button
                                    onClick={() => navigate(slides[current].link || "/registro")}
                                    className="
                                        bg-[#E9EEF5]
                                        hover:bg-[#DEE5F0]
                                        text-[#072146]
                                        px-6 py-3.5
                                        rounded-xl
                                        font-bold
                                        text-[15px]
                                        transition-all
                                        duration-300
                                        hover:scale-[1.02]
                                        cursor-pointer
                                    "
                                >
                                    {slides[current].secondaryButton}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Image */}
                    <div className="flex justify-center lg:justify-end">
                        <img
                            src={slides[current].image}
                            alt=""
                            className="
                                w-full
                                max-w-md
                                h-[280px]
                                lg:h-[360px]
                                rounded-[24px]
                                object-cover
                                shadow-md
                                border border-gray-100
                            "
                        />
                    </div>
                </div>

                {/* CONTROLES Y PAGINACIÓN FORMATO < 1 de 3 > */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-100/50">
                    <button 
                        onClick={prevSlide} 
                        className="hover:scale-110 transition cursor-pointer p-1 text-[#072146] focus:outline-none"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    <span className="text-[12px] font-bold text-[#072146] min-w-[42px] text-center select-none">
                        {current + 1} de {slides.length}
                    </span>

                    <button 
                        onClick={nextSlide} 
                        className="hover:scale-110 transition cursor-pointer p-1 text-[#072146] focus:outline-none"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}