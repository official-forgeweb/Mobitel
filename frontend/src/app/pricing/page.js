import Link from "next/link";
import { LOCATION, CONTACT, SERVICE_LIST } from "@/lib/seo-config";
import { generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

export const metadata = {
  title: `Mobile Repair Pricing in ${LOCATION.city} | Transparent Rates | Mobitel`,
  description: `Transparent mobile phone repair pricing in ${LOCATION.city}. Screen replacement from ₹999, battery from ₹499, charging port from ₹499. All brands. No hidden charges. Free diagnosis. Mobitel.`,
  alternates: { canonical: 'https://www.mobitel.in/pricing' },
  openGraph: {
    title: `Mobile Repair Pricing in ${LOCATION.city} | Mobitel`,
    description: `Transparent phone repair prices. Screen from ₹999, battery from ₹499. All brands serviced.`,
    url: 'https://www.mobitel.in/pricing',
  },
};

export default function PricingPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "Pricing", url: "https://www.mobitel.in/pricing" },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium">Pricing</li>
        </ol>
      </nav>

      <section className="relative pt-8 pb-16 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-semibold text-dark mb-6 tracking-tight">Mobile Repair Pricing in {LOCATION.city}</h1>
          <p className="text-body text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Transparent pricing with no hidden charges. The prices shown are starting prices — exact cost depends on your phone brand and model. Book a <span className="text-primary font-medium">free diagnosis</span> for an accurate quote.
          </p>
        </div>
      </section>

      {/* Service-wise Pricing */}
      {SERVICE_LIST.filter(s => ['screen-replacement', 'battery-replacement', 'charging-port-repair', 'camera-repair'].includes(s.slug)).map((service) => (
        <section key={service.slug} className="pb-12 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-dark flex items-center gap-3">
                <span className="text-2xl">{service.icon}</span>
                {service.name}
              </h2>
              <Link href={`/services/${service.slug}`} className="text-primary text-sm hover:underline hidden sm:inline">Learn more →</Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Brand</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Price Range</th>
                  </tr>
                </thead>
                <tbody>
                  {service.pricingByBrand.map((item, index) => (
                    <tr key={item.brand} className={index % 2 === 0 ? "bg-white" : "bg-surface/50"}>
                      <td className="px-6 py-3 text-sm font-medium text-dark">{item.brand}</td>
                      <td className="px-6 py-3 text-sm text-primary font-medium">{item.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href={`/services/${service.slug}`} className="text-primary text-sm hover:underline mt-2 inline-block sm:hidden">Learn more about {service.name} →</Link>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 bg-dark text-white relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Get an Exact Quote</h2>
          <p className="text-gray-300 mb-8 font-light">Prices depend on your specific phone model. Book a free diagnosis for an accurate, no-obligation quote.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="/#brand-grid" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md">
              Book Free Diagnosis
            </a>
            <a href={`tel:${CONTACT.phone}`} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto">
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
