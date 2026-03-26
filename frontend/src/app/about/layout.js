import { LOCATION } from "@/lib/seo-config";
import { generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

export const metadata = {
  title: `About Us | Mobitel Mobile Repair ${LOCATION.city}`,
  description: `Since 2014, Mobitel has been the trusted name in mobile repair in ${LOCATION.city}. Certified micro-soldering experts, genuine parts, and transparent pricing.`,
  alternates: {
    canonical: 'https://www.mobitel.in/about',
  },
  openGraph: {
    title: `About Mobitel | Best Phone Repair in ${LOCATION.city}`,
    description: `Trusted mobile repair experts in ${LOCATION.city} since 2014.`,
    url: 'https://www.mobitel.in/about',
    images: [{ url: 'https://www.mobitel.in/banners/banner2.png' }]
  }
};

export default function AboutLayout({ children }) {
  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "About Us", url: "https://www.mobitel.in/about" },
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
