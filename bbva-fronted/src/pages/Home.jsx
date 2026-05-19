import Navbar from "../components/layout/Navbar";
import HeroSlider from "../components/home/HeroSlider";
import QuickActions from "../components/home/QuickActions";
import ProductsSection from "../components/home/ProductsSection";
import BenefitsSection from "../components/home/BenefitsSection";
import AppDownloadSection from "../components/home/AppDownloadSection";
import PromoSection from "../components/home/PromoSection";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSlider />
      <QuickActions />
      <ProductsSection />
      <BenefitsSection />
      <AppDownloadSection />
      <PromoSection />
      <Footer />
    </>
  );
}