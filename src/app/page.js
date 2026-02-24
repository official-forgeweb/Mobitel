import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import BrandCategories from "@/components/BrandCategories";
import QuickActions from "@/components/QuickActions";
import HowItWorks from "@/components/HowItWorks";
import PopularServices from "@/components/PopularServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <QuickActions />
      <BannerCarousel />
      <BrandCategories />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <HowItWorks />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <PopularServices />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <WhyChooseUs />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <Testimonials />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <FAQ />
      <Footer />
    </div>
  );
}
