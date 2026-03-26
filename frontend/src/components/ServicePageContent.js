"use client";

import { useState } from "react";
import Link from "next/link";
import { LOCATION, CONTACT, WORKING_HOURS, BRANDS_SERVED } from "@/lib/seo-config";

export default function ServicePageContent({ service, relatedServices, faqs }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      {/* ── Breadcrumb ── */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium">{service.name}</li>
        </ol>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-8 pb-16 md:pb-24 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <span>{service.icon}</span>
            <span>Expert Repair Service</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-dark mb-6 tracking-tight leading-tight">
            {service.name} in {LOCATION.city}
          </h1>
          <p className="text-body text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-4">
            {service.shortDesc}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-primary mb-8">
            Starting from ₹{service.startingPrice.toLocaleString('en-IN')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/#brand-grid"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md"
            >
              Book {service.name} Now
            </a>
            <a
              href={`tel:${CONTACT.phone}`}
              className="bg-white border border-border text-dark hover:bg-gray-50 px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-sm"
            >
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* ── What Is This Service ── */}
      <section className="py-16 md:py-20 bg-surface border-y border-border relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-6">What is {service.name}?</h2>
          <div className="prose prose-lg text-body font-light leading-relaxed space-y-4">
            {service.whatIsContent?.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Table ── */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8">{service.name} Price in {LOCATION.city}</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-dark text-white">
                  <th className="text-left px-6 py-4 text-sm font-semibold">Brand</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Price Range</th>
                </tr>
              </thead>
              <tbody>
                {service.pricingByBrand.map((item, index) => (
                  <tr key={item.brand} className={index % 2 === 0 ? "bg-white" : "bg-surface"}>
                    <td className="px-6 py-4 text-sm font-medium text-dark">{item.brand}</td>
                    <td className="px-6 py-4 text-sm text-body font-medium">{item.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted mt-4 italic">
            * Exact price depends on your phone model. <a href="/#brand-grid" className="text-primary hover:underline">Book for free diagnosis</a> to get an accurate quote.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 md:py-20 bg-surface border-y border-border relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-10 text-center">How {service.name} Works at Mobitel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Book Online or Call", desc: `Schedule your ${service.name.toLowerCase()} through our website or call ${CONTACT.phoneDisplay}. Choose doorstep or shop visit.` },
              { step: "2", title: "Free Diagnosis", desc: "Our expert technician examines your device thoroughly and provides a transparent quote — no hidden charges." },
              { step: "3", title: "Expert Repair", desc: `We fix your phone using genuine, high-quality parts. Most ${service.name.toLowerCase()} repairs are completed within ${service.repairTime}.` },
              { step: "4", title: "Quality Testing", desc: "Every repair goes through a comprehensive quality check to ensure everything works perfectly." },
              { step: "5", title: "Return with Warranty", desc: "Your phone is returned good as new with a 90-day warranty on parts and labor." },
              { step: "6", title: "Track Online", desc: "Track your repair status in real-time at mobitel.in/track-repair. Stay updated at every step." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-dark mb-2">{item.title}</h3>
                <p className="text-xs text-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-10 text-center">
            Why Choose Mobitel for {service.name} in {LOCATION.city}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🛡️", title: "90-Day Warranty", desc: "Full warranty on parts and labor." },
              { icon: "✨", title: "Genuine Parts", desc: "High-quality OEM-grade components." },
              { icon: "⚡", title: "Same-Day Service", desc: `Most repairs done in ${service.repairTime}.` },
              { icon: "🏠", title: "Doorstep Repair", desc: `Free pickup in ${LOCATION.city}.` },
              { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges, ever." },
              { icon: "👨‍🔧", title: "Expert Technicians", desc: "Certified repair professionals." },
              { icon: "📱", title: "Track Online", desc: "Real-time repair status updates." },
              { icon: "❤️", title: "250+ Happy Customers", desc: "4.8★ rated on Google." },
            ].map((item) => (
              <div key={item.title} className="text-center p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-sm font-semibold text-dark mb-1">{item.title}</h3>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands We Service ── */}
      <section className="py-16 md:py-20 bg-surface border-y border-border relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8 text-center">
            Brands We Offer {service.name} For
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {BRANDS_SERVED.map((brand) => (
              <span
                key={brand}
                className="bg-white border border-border text-dark text-sm font-medium px-5 py-2.5 rounded-full"
              >
                {brand}
              </span>
            ))}
          </div>
          <p className="text-center text-sm text-muted mt-6">
            We service all major smartphone brands. Don't see yours? <a href={`tel:${CONTACT.phone}`} className="text-primary hover:underline">Call us</a> — we likely repair it too.
          </p>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8 text-center">
            Frequently Asked Questions About {service.name}
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border"}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="text-sm font-semibold text-dark">{faq.question}</span>
                  <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all duration-300 ${openFaq === i ? "bg-primary text-white rotate-180" : "bg-surface text-body"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                  <p className="text-body text-sm leading-relaxed px-6">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 md:py-20 bg-dark text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to Get Your Phone Fixed?</h2>
          <p className="text-gray-300 text-lg font-light mb-8">
            Book {service.name.toLowerCase()} in {LOCATION.city} now. Same-day service available. 90-day warranty included.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <a
              href="/#brand-grid"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md"
            >
              Book {service.name} Now
            </a>
            <a
              href={`tel:${CONTACT.phone}`}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-medium text-sm transition-colors w-full sm:w-auto"
            >
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
          <p className="text-sm text-gray-400">
            Or visit us at: <span className="text-gray-300">{LOCATION.fullAddress}</span>
          </p>
        </div>
      </section>

      {/* ── Related Services ── */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-8 text-center">Other Services You Might Need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedServices.map((rs) => (
              <Link
                key={rs.slug}
                href={`/services/${rs.slug}`}
                className="group bg-white rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all text-center"
              >
                <div className="text-3xl mb-3">{rs.icon}</div>
                <h3 className="text-sm font-semibold text-dark group-hover:text-primary transition-colors mb-1">{rs.name}</h3>
                <p className="text-xs text-muted">From ₹{rs.startingPrice.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
