import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import BrandCategories from "@/components/BrandCategories";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BannerCarousel />
      <BrandCategories />
    </div>
  );
}
