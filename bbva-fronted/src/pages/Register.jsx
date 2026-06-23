import RegisterForm from "../components/register/RegisterForm";
import RegisterHero from "../components/register/RegisterHero";
import Footer from "../components/layout/Footer";
import logoBBVA from "../assets/bbva-logo.png";

export default function Register() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <img
            src={logoBBVA}
            alt="BBVA"
            className="h-10"
          />

          <a
            href="/login"
            className="text-[#072146] font-semibold hover:text-[#004481] transition"
          >
            ¿Ya tienes cuenta? Ingresar
          </a>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-7xl mx-auto">

          <RegisterHero />

          <RegisterForm />

        </div>
      </main>

      <Footer />
    </div>
  );
}