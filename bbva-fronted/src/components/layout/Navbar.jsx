import logoBBVA from '../../assets/bbva-logo.png'
import { Search, Menu } from 'lucide-react'
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="w-full px-8 py-5">
            <div className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl bg-white px-10 py-5 shadow-sm">

                {/* Logo */}
                <div className="flex items-center">
                    <img
                        src={logoBBVA}
                        alt="BBVA"
                        className="h-12 w-auto"
                    />
                </div>

                {/* Menu */}
                <nav className="hidden items-center gap-10 text-[17px] font-medium text-[#072146] lg:flex">
                    <a href="#" className="border-b-2 border-[#072146] pb-1">
                        Personas
                    </a>

                    <a href="#" className="hover:text-[#004481]">
                        Empresas
                    </a>

                    <a href="#" className="hover:text-[#004481]">
                        Obtén tu Tarjeta
                    </a>

                    <a href="#" className="hover:text-[#004481]">
                        Abre tu cuenta
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-6">

                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center bg-[#0726B4] hover:bg-[#051D80] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] shadow-md"
                    >
                        Banca por Internet
                    </Link>

                    <Search className="cursor-pointer text-[#072146]" />

                    <div className="flex cursor-pointer items-center gap-2 text-[#072146]">
                        <Menu size={22} />
                        <span className="font-medium">Menú</span>
                    </div>

                </div>
            </div>
        </header>
    )
}