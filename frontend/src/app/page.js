import BannerCarousel from "@/components/BannerCarousel";
import BrandCategories from "@/components/BrandCategories";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LOCATION, CONTACT, SERVICE_LIST } from "@/lib/seo-config";
import { generateFAQSchema, JsonLd } from "@/lib/schema-generator";

const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: true });
const PopularServices = dynamic(() => import("@/components/PopularServices"), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: true });

export const revalidate = 60;

export const metadata = {
  title: `Mobile & Camera Repair in ${LOCATION.city} | Screen & Battery Replacement | Mobitel`,
  description: `Best mobile phone and camera repair service in ${LOCATION.city}. iPhone & Samsung screen replacement from ₹999. Camera lens repair. Same-day doorstep repair. 90-day warranty. Trusted by 250+ customers. Book online now!`,
  alternates: {
    canonical: 'https://www.mobitel.in',
  },
  openGraph: {
    title: `Mobile & Camera Repair in ${LOCATION.city} — Same Day Service | Mobitel`,
    description: `Professional phone and camera repair in ${LOCATION.city}. Screen, battery, camera lens, charging port & more. Starting ₹499. 90-day warranty.`,
    url: 'https://www.mobitel.in',
    images: [{ url: 'https://www.mobitel.in/banners/banner1.png' }]
  }
};

const homepageFaqs = [
  { question: `How long does a typical phone repair take in ${LOCATION.city}?`, answer: `Most common repairs like screen and battery replacements at our ${LOCATION.city} center finish within 30-60 minutes. Complex jobs like water damage or motherboard repair may take 2-4 hours. We offer same-day service for most repairs.` },
  { question: "Do you use genuine parts for phone repairs?", answer: `Yes, always. At Mobitel ${LOCATION.city}, we use original or OEM-grade parts for every repair, ensuring quality and longevity your phone deserves. All parts come with a 90-day warranty.` },
  { question: `How does doorstep phone repair work in ${LOCATION.city}?`, answer: `Simply book online or call us at ${CONTACT.phoneDisplay}. Choose a convenient time slot, and our technician will come to your location across ${LOCATION.city} — whether it's ${LOCATION.areasServed.slice(0, 3).join(', ')} or any other area. No extra charges for doorstep service.` },
  { question: `What is the cost of phone screen replacement in ${LOCATION.city}?`, answer: `Screen replacement at Mobitel ${LOCATION.city} starts from ₹999 for Android phones and ₹2,999 for iPhones. The exact price depends on your phone brand and model. Book a free diagnosis to get an exact quote.` },
  { question: "Is there a warranty on your repairs?", answer: `Every repair at Mobitel comes with a 90-day warranty covering the parts we install and the labor. If the same issue recurs within the warranty period, we fix it completely free of charge.` },
  { question: `Can I track my phone repair status?`, answer: `Yes! Once your device is with us, you get a tracking link via SMS and email. Follow every stage in real-time — from diagnosis to repair, quality check, and delivery. Visit mobitel.in/track-repair to check status anytime.` },
];

async function getCmsData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/cms`, { next: { revalidate: 60 } });
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
      {/* FAQ Schema for homepage */}
      <JsonLd data={generateFAQSchema(homepageFaqs)} />

      <h1 className="sr-only">Professional Mobile Phone & Camera Repair Service in {LOCATION.city} — Mobitel</h1>
      <BannerCarousel data={cmsData?.bannerCarousel} />
      <BrandCategories data={cmsData?.brandCategories} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <HowItWorks data={cmsData?.howItWorks} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <PopularServices data={cmsData?.popularServices} />



      <WhyChooseUs data={cmsData?.whyChooseUs} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <Testimonials data={cmsData?.testimonials} />

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      {/* ── Areas We Serve ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">Areas We Serve in {LOCATION.city}</h2>
            <p className="text-body text-sm mt-2 max-w-lg mx-auto leading-relaxed">
              Doorstep phone and camera repair across all major areas of {LOCATION.city}. Our technicians come to you — no need to travel.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {LOCATION.areasServed.map((area) => (
              <span
                key={area}
                className="bg-surface border border-border text-dark text-sm font-medium px-4 py-2 rounded-full hover:bg-primary/5 hover:border-primary/20 transition-colors"
              >
                {area}
              </span>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/mobile-repair-in-faridabad"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium text-sm transition-colors shadow-md"
            >
              Learn More About Our {LOCATION.city} Service
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-[-1px] relative z-10" />

      <FAQ data={{ items: homepageFaqs, title: "Frequently Asked Questions", subtitle: "Got Questions?" }} />
    </div>
  );
}
