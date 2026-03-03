import BannerCarousel from "@/components/BannerCarousel";
import BrandCategories from "@/components/BrandCategories";
import HowItWorks from "@/components/HowItWorks";
import PopularServices from "@/components/PopularServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import AppDownload from "@/components/AppDownload";
import FAQ from "@/components/FAQ";

export const revalidate = 0;

async function getCmsData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cms`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch CMS data');
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default async function Home() {
  const cmsData = await getCmsData();

  return (
    <div className="bg-background">
      <BannerCarousel data={cmsData?.bannerCarousel} />
      <BrandCategories data={cmsData?.brandCategories} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <HowItWorks data={cmsData?.howItWorks} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <PopularServices data={cmsData?.popularServices} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <WhyChooseUs data={cmsData?.whyChooseUs} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <Testimonials data={cmsData?.testimonials} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <AppDownload data={cmsData?.appDownload} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <FAQ data={cmsData?.faq} />
    </div>
  );
}
