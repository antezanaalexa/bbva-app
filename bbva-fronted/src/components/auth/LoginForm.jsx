import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { error } = await signIn(documento, password);

      if (error) {
        alert(error.message);
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales incorrectas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-[28px] shadow-sm border border-gray-200 px-10 py-9 w-full">
      <h1 className="text-[48px] leading-none font-black text-[#072146] mb-6">
        ¡Hola!
      </h1>

      <p className="text-[#072146] text-lg mb-9 max-w-[520px]">
        Completa tus datos y disfruta de tu Banca por Internet
      </p>

      <div className="space-y-5 max-w-[460px]">
        <label className="block">
          <span className="block text-[#072146] text-sm font-semibold mb-2">
            Tipo de documento
          </span>

          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="w-full h-[58px] border border-[#5b6b82] rounded-xl px-5 text-lg bg-white focus:outline-none focus:border-[#0726B4]"
          >
            <option>DNI</option>
            <option>CE</option>
            <option>Pasaporte</option>
          </select>
        </label>

        <input
          type="text"
          placeholder="Número de documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          className="w-full h-[58px] border border-[#5b6b82] rounded-xl px-5 text-lg focus:outline-none focus:border-[#0726B4]"
        />

        <label className="h-[74px] border border-gray-200 bg-[#f7f8fa] rounded-2xl px-5 flex items-center gap-4">
          <input type="checkbox" className="w-8 h-8 accent-[#0726B4]" />
          <span className="text-[#072146] text-lg">Recordar documento</span>
          <HelpCircle size={22} className="text-[#0726B4]" />
        </label>

        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña de Banca por Internet"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[58px] border border-[#5b6b82] rounded-xl px-5 pr-14 text-lg focus:outline-none focus:border-[#0726B4]"
          />

          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0726B4]"
          >
            {mostrarPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        <button
          type="button"
          className="text-[#0726B4] text-base font-bold hover:underline"
        >
          ¿Olvidaste o bloqueaste tu contraseña?
        </button>

        <div className="flex gap-5 pt-3">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#0726B4] hover:bg-[#051D80] text-white h-[56px] px-10 rounded-xl text-lg font-bold transition shadow-md"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <Link
            to="/registro"
            className="h-[56px] px-10 rounded-xl bg-white border border-gray-200 shadow-sm text-[#0726B4] text-lg font-bold flex items-center justify-center hover:bg-[#f4f8ff] transition"
          >
            Afíliate
          </Link>
        </div>
      </div>
    </section>
  );
}