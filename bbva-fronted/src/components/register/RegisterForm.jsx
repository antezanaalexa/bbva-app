import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import piggyDefault from "../../assets/piggy-bbva.avif";
import piggyDigital from "../../assets/piggy-dig.avif";
import piggyGanadora from "../../assets/piggy-gana.avif";
import piggyIndependencia from "../../assets/piggy-indep.avif";
import piggySueldo from "../../assets/piggy-sueldo.avif";
import piggyVip from "../../assets/piggy-vip.avif";

import MoneyCard from "./MoneyCard";
import AccountDetail from "./AccountDetail";
import ContractItem from "./ContractItem";
import RegisterSuccess from "./RegisterSuccess";

const cuentasInfo = {
  digital: {
    nombre: "Cuenta Digital",
    titulo: "Abre tu Cuenta Digital BBVA",
    desc: "¡Empieza a ahorrar sin costo de mantenimiento!",
    mantenimiento: "S/ 0 sin importar el saldo que tengas.",
    tea: "0%",
    trea: "0%",
    img: piggyDigital,
  },
  independencia: {
    nombre: "Cuenta Independencia",
    titulo: "Abre tu Cuenta Independencia BBVA",
    desc: "Realiza operaciones sin costo por canales digitales.",
    mantenimiento: "Gratis si mantienes saldo promedio desde S/ 100 o US$ 30.",
    tea: "Según saldo",
    trea: "Según saldo",
    img: piggyIndependencia,
  },
  ganadora: {
    nombre: "Cuenta Ganadora",
    titulo: "Abre tu Cuenta Ganadora BBVA",
    desc: "Ahorra y participa por premios y beneficios.",
    mantenimiento: "Gratis cumpliendo saldo promedio requerido.",
    tea: "Según campaña",
    trea: "Según saldo",
    img: piggyGanadora,
  },
  vip_wellness: {
    nombre: "Cuenta VIP Wellness",
    titulo: "Abre tu Cuenta VIP Wellness BBVA",
    desc: "Una cuenta pensada para clientes con beneficios exclusivos.",
    mantenimiento: "Sujeto a condiciones del producto.",
    tea: "Según condiciones",
    trea: "Según condiciones",
    img: piggyVip,
  },
  sueldo: {
    nombre: "Cuenta Sueldo",
    titulo: "Abre tu Cuenta Sueldo BBVA",
    desc: "Recibe tu sueldo y accede a beneficios preferenciales.",
    mantenimiento: "Sin mantenimiento al recibir tu sueldo.",
    tea: "0%",
    trea: "0%",
    img: piggySueldo,
  },
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cuentaCreada, setCuentaCreada] = useState(null);

  const [form, setForm] = useState({
    tipo_cuenta: "digital",
    moneda: "PEN",
    nombres: "",
    apellidos: "",
    dni: "",
    email: "",
    password: "",
    confirm: "",
    acepta: false,
  });

  const cuenta = cuentasInfo[form.tipo_cuenta] || cuentasInfo.digital;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const dniToEmail = (dni) => `${dni}@bbva.pe`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!form.acepta) {
      setError("Debes aceptar los documentos contractuales.");
      return;
    }

    setLoading(true);

    const { data, error } = await signUp(dniToEmail(form.dni), form.password, {
      nombres: form.nombres,
      apellidos: form.apellidos,
      dni: form.dni,
      email_real: form.email,
      tipo_cuenta: form.tipo_cuenta,
      moneda: form.moneda,
    });

    setLoading(false);

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Ya existe una cuenta asociada a este DNI. Inicia sesión para continuar."
          : error.message
      );
      return;
    }

    setCuentaCreada(data?.cuenta);
  };

  if (cuentaCreada) {
    return (
      <RegisterSuccess
        cuenta={cuenta}
        cuentaCreada={cuentaCreada}
        moneda={form.moneda}
        email={form.email}
        onGoDashboard={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <>
          <section className="bg-[#f7f8fa] rounded-[32px] px-10 py-10 mb-8 grid md:grid-cols-[260px_1fr] gap-8 items-center">
            <div className="flex justify-center">
              <img
                src={cuenta.img || piggyDefault}
                alt={cuenta.nombre}
                className="w-52 h-auto object-contain"
              />
            </div>

            <div>
              <h1 className="text-5xl font-black text-[#072146] leading-tight mb-4">
                {cuenta.titulo}
              </h1>

              <p className="text-xl text-[#072146] mb-3">{cuenta.desc}</p>

              <p className="text-[#0726B4] font-bold">
                Aplica términos y condiciones
              </p>
            </div>
          </section>

          <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-8">
            <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-200">
              <span className="bg-[#f4f5f7] px-5 py-2 rounded-full text-[#072146] italic">
                1 de 2
              </span>

              <h2 className="text-4xl font-black text-[#072146] mt-8 mb-4">
                Configura tu {cuenta.nombre}
              </h2>

              <p className="text-gray-600 text-lg mb-8">{cuenta.desc}</p>

              <label className="block text-xl font-bold text-[#072146] mb-4">
                Selecciona tu cuenta
              </label>

              <select
                name="tipo_cuenta"
                value={form.tipo_cuenta}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-5 py-5 text-lg mb-8 bg-white"
              >
                <option value="digital">Cuenta Digital</option>
                <option value="independencia">Cuenta Independencia</option>
                <option value="ganadora">Cuenta Ganadora</option>
                <option value="vip_wellness">Cuenta VIP Wellness</option>
                <option value="sueldo">Cuenta Sueldo</option>
              </select>

              <label className="block text-xl font-bold text-[#072146] mb-5">
                Selecciona la moneda de tu cuenta
              </label>

              <div className="flex flex-wrap gap-5 mb-8">
                <MoneyCard
                  active={form.moneda === "PEN"}
                  label="Soles"
                  flag="🇵🇪"
                  onClick={() => setForm({ ...form, moneda: "PEN" })}
                />

                <MoneyCard
                  active={form.moneda === "USD"}
                  label="Dólares"
                  flag="🇺🇸"
                  onClick={() => setForm({ ...form, moneda: "USD" })}
                />
              </div>

              <div className="bg-[#eaf4ff] rounded-2xl p-5 text-[#072146] mb-8">
                Luego de abrir tu cuenta, podrás consultar el número de cuenta y CCI
                desde tu Banca por Internet.
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#0726B4] hover:bg-[#051D80] text-white px-12 py-5 rounded-2xl text-xl font-bold"
              >
                Continuar
              </button>
            </section>

            <AccountDetail cuenta={cuenta} moneda={form.moneda} />
          </div>
        </>
      )}

      {step === 2 && (
        <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-200 max-w-5xl">
          <span className="bg-[#f4f5f7] px-5 py-2 rounded-full text-[#072146] italic">
            2 de 2
          </span>

          <h2 className="text-4xl font-black text-[#072146] mt-8 mb-8">
            Ya casi abres tu {cuenta.nombre} BBVA
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <Input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} />
            <Input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
          </div>

          <Input name="dni" placeholder="Número de DNI" value={form.dni} onChange={handleChange} maxLength={8} />
          <Input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />

          <div className="relative mb-5">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Contraseña de Banca por Internet"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl px-5 py-5 text-lg"
              required
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0726B4]"
            >
              {showPass ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <Input name="confirm" type="password" placeholder="Confirmar contraseña" value={form.confirm} onChange={handleChange} />

          <h3 className="text-2xl font-bold text-[#072146] mt-8 mb-5">
            Revisa los documentos contractuales
          </h3>

          <ContractItem title="Cláusulas Generales de Contratación" />
          <ContractItem title="Condiciones Específicas y Cartilla de Información" />
          <ContractItem title={`Cartilla informativa de ${cuenta.nombre}`} />

          <label className="bg-[#f4f5f7] rounded-2xl p-6 flex gap-4 items-start mt-6 text-[#072146]">
            <input
              type="checkbox"
              name="acepta"
              checked={form.acepta}
              onChange={handleChange}
              className="w-6 h-6 mt-1"
            />

            <span className="text-lg">
              He leído y acepto los documentos contractuales de la {cuenta.nombre} BBVA.
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mt-6">
              {error}
            </div>
          )}

          <div className="flex gap-5 mt-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-white border border-gray-300 text-[#072146] px-10 py-5 rounded-2xl font-bold"
            >
              Volver
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0726B4] hover:bg-[#051D80] disabled:bg-gray-300 text-white px-12 py-5 rounded-2xl text-xl font-bold"
            >
              {loading ? "Abriendo cuenta..." : "Abrir cuenta"}
            </button>
          </div>
        </section>
      )}
    </form>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border border-gray-300 rounded-2xl px-5 py-5 text-lg mb-5 focus:outline-none focus:border-[#004481]"
      required
    />
  );
}