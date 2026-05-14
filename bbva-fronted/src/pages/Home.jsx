import Navbar from "../components/layout/Navbar";
import HeroSlider from "../components/home/HeroSlider";
import QuickActions from "../components/home/QuickActions";
import PromoSection from "../components/home/PromoSection";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSlider />
      <QuickActions />
      <PromoSection />
      <Footer />
    </>
  );
}