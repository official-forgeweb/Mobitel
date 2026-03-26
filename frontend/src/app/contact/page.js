import Link from "next/link";
import { LOCATION, CONTACT, WORKING_HOURS } from "@/lib/seo-config";
import { generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

export const metadata = {
  title: `Contact Mobitel | Mobile Repair Shop in ${LOCATION.city} | Call/Visit`,
  description: `Contact Mobitel for phone repair in ${LOCATION.city}. Call: ${CONTACT.phoneDisplay}. Visit: ${LOCATION.fullAddress}. Working hours: ${WORKING_HOURS.display}. Book online or walk in.`,
  alternates: { canonical: 'https://www.mobitel.in/contact' },
  openGraph: {
    title: `Contact Mobitel | Mobile Repair Shop in ${LOCATION.city}`,
    description: `Get in touch with Mobitel ${LOCATION.city} for expert phone repair. Call, visit, or book online.`,
    url: 'https://www.mobitel.in/contact',
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "Contact", url: "https://www.mobitel.in/contact" },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium">Contact</li>
        </ol>
      </nav>

      <section className="relative pt-8 pb-16 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-semibold text-dark mb-6 tracking-tight">Contact Mobitel {LOCATION.city}</h1>
          <p className="text-body text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Need phone repair in {LOCATION.city}? Reach out to us via phone, email, or visit our shop. We're happy to help with any smartphone issue.
          </p>
        </div>
      </section>

      <section className="pb-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-surface rounded-2xl border border-border p-8">
                <h2 className="text-xl font-semibold text-dark mb-6">Get In Touch</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark mb-1">Our Address</h3>
                      <p className="text-sm text-body leading-relaxed">{LOCATION.fullAddress}</p>
                      <a href={LOCATION.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline mt-1 inline-block">View on Google Maps →</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark mb-1">Phone</h3>
                      <a href={`tel:${CONTACT.phone}`} className="text-sm text-primary font-medium hover:underline">{CONTACT.phoneDisplay}</a>
                      <p className="text-xs text-muted mt-1">Tap to call directly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark mb-1">Email</h3>
                      <a href={`mailto:${CONTACT.email}`} className="text-sm text-primary font-medium hover:underline">{CONTACT.email}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark mb-1">Working Hours</h3>
                      <p className="text-sm text-body">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                      <p className="text-sm text-body">Sunday: 10:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Areas Served */}
              <div className="bg-surface rounded-2xl border border-border p-8">
                <h2 className="text-xl font-semibold text-dark mb-4">Areas We Serve in {LOCATION.city}</h2>
                <div className="flex flex-wrap gap-2">
                  {LOCATION.areasServed.map((area) => (
                    <span key={area} className="bg-white border border-border text-dark text-xs font-medium px-3 py-1.5 rounded-full">{area}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-border shadow-lg h-[400px]">
                <iframe
                  src={LOCATION.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mobitel ${LOCATION.city} Location Map`}
                ></iframe>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <a href={`tel:${CONTACT.phone}`} className="bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-2xl font-medium text-sm transition-colors text-center shadow-md">
                  📞 Call Now
                </a>
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-medium text-sm transition-colors text-center shadow-md">
                  💬 WhatsApp
                </a>
                <a href={LOCATION.googleMapsLink} target="_blank" rel="noopener noreferrer" className="bg-dark hover:bg-black text-white px-6 py-4 rounded-2xl font-medium text-sm transition-colors text-center shadow-md">
                  📍 Get Directions
                </a>
                <a href="/#brand-grid" className="bg-white border border-border text-dark hover:bg-surface px-6 py-4 rounded-2xl font-medium text-sm transition-colors text-center shadow-sm">
                  🔧 Book Repair
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
