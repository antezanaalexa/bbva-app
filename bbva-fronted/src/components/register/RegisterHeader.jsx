import { Link } from "react-router-dom";
import logoBBVA from "../../assets/bbva-logo.png";

export default function RegisterHeader() {
  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <img src={logoBBVA} alt="BBVA" className="h-10" />

        <div className="flex items-center gap-8">
          <span className="text-[#072146] text-2xl">Abre tu cuenta</span>
          <Link to="/login" className="text-[#072146] font-semibold hover:text-[#004481]">
            ¿Ya tienes cuenta? Ingresar
          </Link>
        </div>
      </div>
    </header>
  );
}