import Link from "next/link";
import { LOCATION, CONTACT, WORKING_HOURS, SERVICE_LIST, BRANDS_SERVED } from "@/lib/seo-config";
import { generateFAQSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

export const metadata = {
  title: `Mobile Repair in Faridabad | Same Day Phone Fix | Doorstep Service | Mobitel`,
  description: `Best mobile repair in Faridabad. Screen replacement, battery change, water damage repair & more. Serving Ballabhgarh, NIT, Sector 4, Sector 15 & all areas. 90-day warranty. ₹499 onwards. Call: ${CONTACT.phoneDisplay}`,
  alternates: { canonical: 'https://www.mobitel.in/mobile-repair-in-faridabad' },
  openGraph: {
    title: `Mobile Repair in Faridabad — Same Day Service | Mobitel`,
    description: `Professional phone repair in Faridabad. All brands, all issues. Same-day fix with 90-day warranty.`,
    url: 'https://www.mobitel.in/mobile-repair-in-faridabad',
  },
};

const locationFaqs = [
  { question: `Where is Mobitel located in ${LOCATION.city}?`, answer: `Mobitel is located at ${LOCATION.fullAddress}. We're easily accessible from Ballabhgarh, NIT, and all major sectors of ${LOCATION.city}. You can also use our doorstep pickup service — we'll come to your location.` },
  { question: `Do you offer doorstep phone repair in ${LOCATION.city}?`, answer: `Yes! We offer free doorstep pickup and delivery across all areas of ${LOCATION.city} including ${LOCATION.areasServed.slice(0, 5).join(', ')} and more. Book online or call ${CONTACT.phoneDisplay} to schedule a pickup.` },
  { question: `What are the working hours of Mobitel ${LOCATION.city}?`, answer: `We are open ${WORKING_HOURS.display}. You can book online 24/7 and we'll confirm your appointment. Walk-ins are also welcome during working hours.` },
  { question: `Which phone brands do you repair in ${LOCATION.city}?`, answer: `We repair all major smartphone brands including Apple iPhone, Samsung Galaxy, Xiaomi/Redmi, OnePlus, Vivo, Oppo, Realme, Google Pixel, Motorola, Nothing, and more. If your brand isn't listed, call us — we likely service it.` },
  { question: `What is the cheapest phone repair available in ${LOCATION.city}?`, answer: `Our most affordable repairs start from just ₹499 — this includes charging port cleaning, software troubleshooting, and basic microphone/speaker repairs. Screen replacements start from ₹999 and battery replacements from ₹499.` },
  { question: `How long do phone repairs take at Mobitel ${LOCATION.city}?`, answer: `Most repairs are completed same-day. Screen replacement takes 30-60 minutes, battery replacement 20-30 minutes, and charging port repair 30-45 minutes. Complex repairs like water damage or motherboard repair may take 2-6 hours.` },
  { question: `Is there parking available at your ${LOCATION.city} repair center?`, answer: `Yes, street parking is available near our shop in Sector 4, Ballabhgarh. Alternatively, you can use our doorstep service and we'll pick up your phone from your location.` },
  { question: `Do you provide warranty on repairs in ${LOCATION.city}?`, answer: `Every repair at Mobitel comes with a 90-day warranty covering parts and labor. If the same issue recurs within the warranty period, we fix it free of charge. Visit our warranty page for full details.` },
];

export default function MobileRepairInFaridabad() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: `Mobile Repair in ${LOCATION.city}`, url: "https://www.mobitel.in/mobile-repair-in-faridabad" },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      <JsonLd data={generateFAQSchema(locationFaqs)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      {/* Breadcrumb */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium">Mobile Repair in {LOCATION.city}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative pt-8 pb-16 md:pb-20 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-dark mb-6 tracking-tight leading-tight">
            Mobile Repair in {LOCATION.city} — <span className="text-primary">Same Day Service</span>
          </h1>
          <p className="text-body text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-8">
            Mobitel is {LOCATION.city}'s trusted mobile phone repair center. From cracked screens to dead batteries, water damage to motherboard issues — we fix every smartphone problem with genuine parts, expert technicians, and a 90-day warranty. Available at our {LOCATION.city} shop or via doorstep pickup across the city.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="/#brand-grid" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md">
              Book Repair Now
            </a>
            <a href={`tel:${CONTACT.phone}`} className="bg-white border border-border text-dark hover:bg-gray-50 px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-sm">
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 md:py-20 bg-surface border-y border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8 text-center">Our Services in {LOCATION.city}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICE_LIST.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="group bg-white rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-sm font-semibold text-dark group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="text-xs text-muted mt-1">From ₹{service.startingPrice.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-muted mt-1">{service.repairTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-4 text-center">Areas We Serve in {LOCATION.city}</h2>
          <p className="text-body text-center mb-8 max-w-2xl mx-auto">We provide doorstep phone repair across all major areas and localities of {LOCATION.city}. Our technicians come to your home, office, or any preferred location.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {LOCATION.areasServed.map((area) => (
              <span key={area} className="bg-surface border border-border text-dark text-sm font-medium px-4 py-2 rounded-full">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-surface border-y border-border relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-10 text-center">Why Choose Mobitel for Phone Repair in {LOCATION.city}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🛡️", title: "90-Day Warranty", desc: "Every repair backed by a full 90-day warranty on parts and labor." },
              { icon: "✨", title: "Genuine Parts", desc: "OEM-grade components sourced from certified suppliers." },
              { icon: "⚡", title: "Same-Day Service", desc: "85% of repairs completed within the same day." },
              { icon: "🏠", title: "Doorstep Pickup", desc: `Free pickup & delivery across all ${LOCATION.city} areas.` },
              { icon: "💰", title: "Transparent Pricing", desc: "Upfront quotes. No hidden charges. Pay only after repair." },
              { icon: "👨‍🔧", title: "Expert Technicians", desc: "Certified micro-soldering professionals with 10+ years experience." },
              { icon: "📱", title: "Live Tracking", desc: "Track your repair status in real-time online." },
              { icon: "🏆", title: "250+ Happy Customers", desc: "Rated 4.8★ on Google. Faridabad's most trusted repair service." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-semibold text-dark mb-2">{item.title}</h3>
                <p className="text-xs text-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8 text-center">Pricing for Mobile Repair in {LOCATION.city}</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-dark text-white">
                  <th className="text-left px-6 py-4 text-sm font-semibold">Service</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Starting Price</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_LIST.map((service, index) => (
                  <tr key={service.slug} className={index % 2 === 0 ? "bg-white" : "bg-surface"}>
                    <td className="px-6 py-4 text-sm font-medium text-dark">
                      <Link href={`/services/${service.slug}`} className="hover:text-primary transition-colors">{service.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary font-semibold">₹{service.startingPrice.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-muted hidden sm:table-cell">{service.repairTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted mt-4 italic text-center">Exact price depends on your phone brand and model. <a href="/#brand-grid" className="text-primary hover:underline">Book free diagnosis</a> for accurate quote.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-surface border-y border-border relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-10 text-center">How Phone Repair Works at Mobitel {LOCATION.city}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Book Online or Call", desc: "Schedule via our website or call us. Choose shop visit or doorstep pickup." },
              { step: "2", title: "Free Diagnosis", desc: "Our technician examines your phone and provides an upfront, transparent quote." },
              { step: "3", title: "Expert Repair", desc: "Using genuine parts and professional tools. Most repairs done within an hour." },
              { step: "4", title: "Quality Testing", desc: "Comprehensive testing to ensure everything works perfectly post-repair." },
              { step: "5", title: "Return with Warranty", desc: "Phone returned good as new with 90-day warranty card." },
              { step: "6", title: "Track Online", desc: "Real-time status updates via SMS and our website tracking page." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-border p-6 text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="text-sm font-semibold text-dark mb-2">{item.title}</h3>
                <p className="text-xs text-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8 text-center">Find Us in {LOCATION.city}</h2>
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
            <iframe
              src={LOCATION.googleMapsEmbed}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mobitel Mobile Repair ${LOCATION.city} Location`}
            ></iframe>
          </div>
          <div className="mt-6 text-center">
            <p className="text-body mb-2">{LOCATION.fullAddress}</p>
            <p className="text-muted text-sm">{WORKING_HOURS.display}</p>
            <a href={LOCATION.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium mt-2 inline-block">
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-surface border-y border-border relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8 text-center">Frequently Asked Questions — Mobile Repair in {LOCATION.city}</h2>
          <LocationFAQAccordion faqs={locationFaqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-dark text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Get Your Phone Fixed in {LOCATION.city} Today</h2>
          <p className="text-gray-300 text-lg font-light mb-8">
            Same-day service. 90-day warranty. Genuine parts. Trusted by {LOCATION.city} residents since {2014}.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="/#brand-grid" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md">
              Book Repair Now
            </a>
            <a href={`tel:${CONTACT.phone}`} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto">
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-6">Visit us: {LOCATION.fullAddress}</p>
        </div>
      </section>
    </div>
  );
}

// Client-side FAQ accordion (inline since this page is server component)
function LocationFAQAccordion({ faqs }) {
  return <LocationFAQClient faqs={faqs} />;
}

// We need a client import for interactivity
import LocationFAQClient from "@/components/LocationFAQClient";
