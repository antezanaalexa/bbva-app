import Navbar from "../components/layout/Navbar";
import HeroSlider from "../components/home/HeroSlider";
import QuickActions from "../components/home/QuickActions";
import ProductsSection from "../components/home/ProductsSection";
import BenefitsSection from "../components/home/BenefitsSection";
import AppDownloadSection from "../components/home/AppDownloadSection";
import PromoSection from "../components/home/PromoSection";
import Footer from "../components/layout/Footer";
import ChatButton from "../components/layout/ChatButton";

export default function Home() {
  return (
    <div className="bg-[#F4F6F9] min-h-screen">
      <Navbar />
      <HeroSlider />
      <QuickActions />
      <ProductsSection />
      <BenefitsSection />
      <AppDownloadSection />
      <PromoSection />
      <Footer />
      <ChatButton />
    </div>
  );
}