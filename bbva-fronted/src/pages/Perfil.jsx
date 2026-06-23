import { useNavigate } from "react-router-dom";
import { LogOut, User, Mail, MapPin, Phone, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/dashboard/DashboardShell";

export default function Perfil() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const nombre = user?.user_metadata?.nombres || "Cliente";
  const apellido = user?.user_metadata?.apellidos || "BBVA";
  const dni = user?.user_metadata?.dni || "--------";
  const emailReal = user?.user_metadata?.email_real || user?.email || "---";

  const nombreCompleto = `${nombre} ${apellido}`;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <DashboardShell title="Mi Perfil" nombreUsuario={nombre}>
      <section className="mb-10">
        <span className="text-[#1464A0] font-bold text-sm uppercase tracking-widest">
          Datos del cliente
        </span>

        <h1 className="text-5xl font-black text-[#072146] mt-2">
          Mi perfil
        </h1>

        <p className="text-gray-500 text-xl mt-3">
          Consulta y revisa la información asociada a tu cuenta BBVA.
        </p>
      </section>

      <div className="grid lg:grid-cols-[0.8fr_1.6fr] gap-8">
        <aside className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 h-fit">
          <div className="w-28 h-28 rounded-full bg-[#0726B4] text-white flex items-center justify-center text-5xl font-black mx-auto mb-6">
            {nombre.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-2xl font-black text-[#072146] text-center">
            {nombreCompleto}
          </h2>

          <p className="text-gray-500 text-center mt-2">
            DNI: {dni}
          </p>

          <div className="bg-[#f4f8ff] rounded-2xl p-5 mt-8">
            <p className="text-[#1464A0] text-sm font-bold uppercase mb-1">
              Estado
            </p>
            <p className="text-[#072146] font-black text-xl">
              Cliente activo
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full border-2 border-red-500 text-red-600 hover:bg-red-50 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </aside>

        <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-black text-[#072146] mb-8">
            Datos personales
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <ProfileField icon={User} label="Nombres" value={nombre} />
            <ProfileField icon={User} label="Apellidos" value={apellido} />
            <ProfileField icon={CreditCard} label="DNI" value={dni} />
            <ProfileField icon={Mail} label="Correo electrónico" value={emailReal} />
            <ProfileField icon={Phone} label="Teléfono" value="(01) 595-0000" />
            <ProfileField icon={MapPin} label="Dirección" value="Lima, Perú" />
          </div>

          <div className="mt-8 bg-[#eaf4ff] rounded-2xl p-6">
            <p className="text-[#072146] font-bold">
              Esta información forma parte de tu perfil de cliente BBVA simulado.
            </p>
            <p className="text-gray-600 mt-2">
              Más adelante puedes habilitar edición de datos personales si tu proyecto lo requiere.
            </p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#f7f8fa] rounded-2xl p-5 flex gap-4 items-start">
      <div className="w-11 h-11 rounded-xl bg-[#eaf4ff] text-[#0726B4] flex items-center justify-center shrink-0">
        <Icon size={21} />
      </div>

      <div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className="text-[#072146] font-black text-lg break-all">{value}</p>
      </div>
    </div>
  );
}