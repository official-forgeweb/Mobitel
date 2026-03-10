import BannerCarousel from "@/components/BannerCarousel";
import BrandCategories from "@/components/BrandCategories";
import dynamic from "next/dynamic";

const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: true });
const PopularServices = dynamic(() => import("@/components/PopularServices"), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true });
const AppDownload = dynamic(() => import("@/components/AppDownload"), { ssr: true });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: true });

export const revalidate = 60;

async function getCmsData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/cms`, { next: { revalidate: 60 } });
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
