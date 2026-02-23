import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import BrandCategories from "@/components/BrandCategories";
import QuickActions from "@/components/QuickActions";
import HowItWorks from "@/components/HowItWorks";
import PopularServices from "@/components/PopularServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import StatsBar from "@/components/StatsBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <QuickActions />
      <BannerCarousel />
      <StatsBar />
      <BrandCategories />
      <HowItWorks />
      <PopularServices />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
