import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  PiggyBank,
  CreditCard,
  ArrowLeftRight,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoBBVA from "../../assets/bbva-logo.png";

const NAV_ITEMS = [
  { icon: Home, label: "Inicio", path: "/dashboard" },
  { icon: PiggyBank, label: "Mis Ahorros", path: "/ahorros" },
  { icon: CreditCard, label: "Créditos", path: "/creditos" },
  { icon: ArrowLeftRight, label: "Transferencias", path: "/transferencias" },
  { icon: User, label: "Mi Perfil", path: "/perfil" },
];

export default function DashboardShell({
  title,
  nombreUsuario = "Cliente",
  children,
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const inicial = nombreUsuario.charAt(0).toUpperCase();
  const primerNombre = nombreUsuario.split(" ")[0];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white fixed left-0 top-0 h-screen flex flex-col border-r border-gray-200">

        {/* LOGO */}
        <div className="px-8 pt-8 pb-8">
          <img
            src={logoBBVA}
            alt="BBVA"
            className="h-12 w-auto"
          />
        </div>

        {/* USER CARD */}
        <div className="mx-5 mb-8 rounded-[28px] bg-[#F5F8FF] p-6">
          <div className="w-20 h-20 rounded-full bg-[#0726B4] text-white flex items-center justify-center text-3xl font-black mb-5">
            {inicial}
          </div>

          <p className="text-gray-500 text-sm mb-1">
            Bienvenido,
          </p>

          <p className="font-black text-[#072146] text-xl truncate">
            {primerNombre}
          </p>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                  active
                    ? "bg-[#0726B4] text-white font-semibold shadow-md"
                    : "text-[#4A5A73] hover:bg-[#F4F8FF] hover:text-[#072146]"
                }`}
              >
                <Icon size={22} />
                <span className="text-[16px]">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[16px] text-[#4A5A73] hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut size={22} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="ml-[280px] flex-1 min-h-screen">

        {/* HEADER */}
        <header className="h-[88px] bg-white border-b border-gray-200 px-12 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-[#072146] font-black text-3xl">
            {title}
          </h1>

          <button className="w-12 h-12 rounded-full hover:bg-[#F4F8FF] flex items-center justify-center transition">
            <Bell
              size={22}
              className="text-[#072146]"
            />
          </button>
        </header>

        {/* MAIN */}
        <main className="px-12 py-10 w-full max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}