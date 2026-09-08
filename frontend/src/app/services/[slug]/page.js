import Link from "next/link";
import { notFound } from "next/navigation";
import { ISSUES_DATA } from "@/data/issuesData";
import { LOCATION, CONTACT } from "@/lib/seo-config";
import { generateFAQSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

// Generate static params for build time optimization
export async function generateStaticParams() {
  return Object.keys(ISSUES_DATA).map((slug) => ({ slug }));
}

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const issue = ISSUES_DATA[slug];

  if (!issue) {
    return {
      title: "Service Not Found | Mobitel",
      description: "Mobile repair service page not found."
    };
  }

  const canonicalUrl = `https://www.mobitel.in/services/${slug}`;

  return {
    title: issue.metaTitle,
    description: issue.metaDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: issue.metaTitle,
      description: issue.metaDesc,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function ServiceIssuePage({ params }) {
  const { slug } = await params;
  const issue = ISSUES_DATA[slug];

  if (!issue) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: `Mobile Repair in ${LOCATION.city}`, url: "https://www.mobitel.in/mobile-repair-in-faridabad" },
    { name: issue.title, url: `https://www.mobitel.in/services/${slug}` },
  ];

  const repairShopSchema = {
    "@context": "https://schema.org",
    "@type": "RepairShop",
    "name": `Mobitel ${issue.title}`,
    "image": "https://www.mobitel.in/logo.png",
    "telephone": CONTACT.phone,
    "priceRange": issue.priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": LOCATION.fullAddress,
      "addressLocality": LOCATION.city,
      "addressRegion": LOCATION.state,
      "postalCode": LOCATION.pincode,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.3415,
      "longitude": 77.3194
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:30",
      "closes": "20:30"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "340"
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden">
      {/* Schema Injection */}
      <JsonLd data={repairShopSchema} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <JsonLd data={generateFAQSchema(issue.faqs)} />

      {/* Background Subtle Gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/60 to-transparent pointer-events-none" />

      {/* Breadcrumb */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 w-full">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
          <li><span>/</span></li>
          <li><Link href="/mobile-repair-in-faridabad" className="hover:text-blue-600 transition-colors">Faridabad</Link></li>
          <li><span>/</span></li>
          <li className="text-gray-900 font-medium">{issue.title}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-8 pb-14 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
            📍 Fast Doorstep & Shop Repair in {LOCATION.city}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            {issue.h1}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto mb-8">
            {issue.shortDesc}
          </p>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <span className="block text-xs text-gray-500 font-medium">Starting Price</span>
              <span className="text-base md:text-lg font-bold text-blue-600">{issue.priceRange}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <span className="block text-xs text-gray-500 font-medium">Estimated Time</span>
              <span className="text-base md:text-lg font-bold text-gray-800">{issue.estimatedTime}</span>
            </div>
            <div className="col-span-2 md:col-span-1 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <span className="block text-xs text-gray-500 font-medium">Warranty</span>
              <span className="text-base md:text-lg font-bold text-emerald-600">{issue.warranty}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="/#brand-grid" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-colors w-full sm:w-auto shadow-md">
              Book {issue.title} Now
            </a>
            <a href={`tel:${CONTACT.phone}`} className="bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-3.5 rounded-full font-semibold text-sm transition-colors w-full sm:w-auto shadow-sm">
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Symptoms & Signs Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100 z-10 relative">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Signs Your Phone Needs {issue.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issue.symptoms.map((symptom, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className="text-gray-700 text-sm font-medium leading-snug">{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Brands */}
      <section className="py-12 px-4 max-w-4xl mx-auto z-10 relative">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Supported Brands for {issue.title} in {LOCATION.city}
        </h2>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {issue.brandsSupported.map((brand, idx) => (
            <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg border border-gray-200">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Service Areas in Faridabad */}
      <section className="py-12 bg-blue-900 text-white z-10 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Free Doorstep Pickup Across All {LOCATION.city} Sectors
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Our certified technicians visit your location anywhere in {LOCATION.city}. Get your phone repaired at your home or office with genuine parts and 90 days warranty.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm text-blue-200">
            {LOCATION.areasServed.map((area, idx) => (
              <span key={idx} className="bg-blue-800/60 border border-blue-700/60 px-3 py-1.5 rounded-full">
                📍 {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-14 px-4 max-w-4xl mx-auto z-10 relative">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions ({issue.title})
        </h2>
        <div className="space-y-4">
          {issue.faqs.map((faq, idx) => (
            <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Q: {faq.question}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-10 bg-gray-50 border-t border-gray-200 text-center z-10 relative">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Get Your Phone Fixed Today in {LOCATION.city}
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Book online now or call us for instant price quotation and doorstep pickup scheduling.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="/#brand-grid" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full font-semibold text-sm transition-colors">
              Book Online Repair
            </a>
            <a href={`tel:${CONTACT.phone}`} className="bg-white border border-gray-300 text-gray-900 hover:bg-gray-100 px-7 py-3 rounded-full font-semibold text-sm transition-colors">
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
