import LoginForm from "../components/auth/LoginForm";
import LoginPromo from "../components/auth/LoginPromo";
import Footer from "../components/layout/Footer";
import logoBBVA from "../assets/bbva-logo.png";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto h-[92px] px-8 flex items-center justify-between">
          <img src={logoBBVA} alt="BBVA" className="h-12 w-auto" />

          <a
            href="/"
            className="text-[#072146] font-bold text-base hover:text-[#004481] transition"
          >
            Ir a BBVA Perú
          </a>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-[1150px] mx-auto grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-start">
          <LoginForm />
          <LoginPromo />
        </div>
      </main>

      <Footer />
    </div>
  );
}