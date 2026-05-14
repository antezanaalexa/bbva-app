import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      await signIn(email, password);

      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales incorrectas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 p-10 w-full max-w-[650px]">
      
      <h1 className="text-6xl font-black text-[#072146] mb-6">
        ¡Hola!
      </h1>

      <p className="text-[#374151] text-xl mb-10">
        Completa tus datos y disfruta de tu Banca por Internet
      </p>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-[#072146] text-sm mb-2 font-medium">
          Correo electrónico
        </label>

        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-2xl px-5 py-5 text-lg focus:outline-none focus:border-[#004481]"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-[#072146] text-sm mb-2 font-medium">
          Contraseña
        </label>

        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-2xl px-5 py-5 text-lg focus:outline-none focus:border-[#004481]"
        />
      </div>

      <button
        type="button"
        className="text-[#0726B4] text-sm font-semibold hover:underline mb-8"
      >
        ¿Olvidaste o bloqueaste tu contraseña?
      </button>

      {/* Botones */}
      <div className="flex flex-col gap-4">
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#0726B4] hover:bg-[#051D80] text-white py-5 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-[1.01] shadow-md"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <Link
          to="/registro"
          className="block text-center w-full border-2 border-[#0726B4] text-[#0726B4] py-5 rounded-2xl text-xl font-bold hover:bg-[#f4f8ff] transition"
        >
          Afíliate
        </Link>
      </div>
    </div>
  );
}