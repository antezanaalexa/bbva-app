import { useState } from 'react'
import logoBBVA from '../../assets/bbva-logo.png'
import { Search, Menu, CreditCard, ChevronDown } from 'lucide-react'
import { Link } from "react-router-dom";

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownItems = [
        "Afiliación PLIn",
        "Abre tu Depósito a Plazo",
        "Cuenta Ganadora",
        "Abrir Cuenta App",
        "Onboarding Cuentas",
        "Consulta SOAT",
        "Cambio de cookies",
        "Cotizar Seguro Vehicular",
        "Seguro Protección de tarjeta",
        "Términos y Condiciones de Uso de WhatsApp BBVA",
        "Seguro Protección de tarjeta - Seguridad"
    ];

    return (
        <header className="w-full px-6 pt-6 pb-2 relative z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[24px] bg-white px-8 py-4 shadow-md border border-gray-100">

                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/">
                        <img
                            src={logoBBVA}
                            alt="BBVA"
                            className="h-10 w-auto cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Menu */}
                <nav className="hidden items-center gap-10 text-[16px] lg:text-[17px] font-bold text-[#072146] lg:flex">
                    <Link to="/" className="text-[#072146] border-b-2 border-[#072146] pb-1 font-bold">
                        Personas
                    </Link>

                    <a href="#" className="hover:text-[#004481] transition-colors">
                        Empresas
                    </a>

                    <Link to="/registro" className="hover:text-[#004481] transition-colors flex items-center gap-2">
                        <CreditCard size={20} className="text-[#072146]" />
                        <span>Obtén tu Tarjeta de Crédito</span>
                    </Link>

                    {/* Dropdown "Abre tu cuenta" */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button 
                            className="hover:text-[#004481] transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none font-bold"
                        >
                            <span>Abre tu cuenta</span>
                            <ChevronDown size={18} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fade space-y-1 max-h-[380px] overflow-y-auto">
                                <div className="text-[11px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">Servicios y Cuentas</div>
                                {dropdownItems.map((item, idx) => (
                                    <Link 
                                        key={idx}
                                        to="/registro" 
                                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition text-left text-[14px] font-semibold text-[#072146]"
                                    >
                                        <span>{item}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-5">

                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center bg-[#0726B4] hover:bg-[#051D80] text-white px-6 py-3 rounded-xl font-bold text-[15px] transition-all duration-300 hover:scale-[1.02] shadow-sm cursor-pointer"
                    >
                        Banca por Internet
                    </Link>

                    <Search size={22} className="cursor-pointer text-[#072146] hover:text-[#004481] transition-colors" />

                    <div className="flex cursor-pointer items-center gap-1.5 text-[#072146] hover:text-[#004481] transition-colors">
                        <Menu size={22} />
                        <span className="font-bold text-[16px]">Menú</span>
                    </div>

                </div>
            </div>
        </header>
    )
}