import { getServiceBySlug, getRelatedServices } from "@/lib/seo-config";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";
import ServicePageContent from "@/components/ServicePageContent";

const slug = "camera-repair";
const service = getServiceBySlug(slug);
const content = SERVICE_CONTENT[slug];
const relatedServices = getRelatedServices(slug, 4);

export const metadata = {
  title: service.metaTitle,
  description: service.metaDesc,
  alternates: { canonical: `https://www.mobitel.in/services/${slug}` },
  openGraph: {
    title: service.metaTitle,
    description: service.metaDesc,
    url: `https://www.mobitel.in/services/${slug}`,
    images: [{ url: 'https://www.mobitel.in/banners/banner1.png' }],
  },
};

export default function CameraRepairPage() {
  const serviceData = { ...service, whatIsContent: content.whatIsContent };
  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "Services", url: "https://www.mobitel.in/services" },
    { name: service.name, url: `https://www.mobitel.in/services/${slug}` },
  ];

  return (
    <>
      <JsonLd data={generateServiceSchema(service)} />
      <JsonLd data={generateFAQSchema(content.faqs)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <ServicePageContent service={serviceData} relatedServices={relatedServices} faqs={content.faqs} />
    </>
  );
}
