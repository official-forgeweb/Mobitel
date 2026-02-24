import BannerCarousel from "@/components/BannerCarousel";
import BrandCategories from "@/components/BrandCategories";
import HowItWorks from "@/components/HowItWorks";
import PopularServices from "@/components/PopularServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import AppDownload from "@/components/AppDownload";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="bg-background">
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

      <AppDownload />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <FAQ />
    </div>
  );
}
