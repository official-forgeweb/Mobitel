import Link from "next/link";
import { LOCATION, CONTACT } from "@/lib/seo-config";
import { generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

export const metadata = {
  title: `6-months Repair Warranty | Mobitel ${LOCATION.city}`,
  description: `Every phone repair at Mobitel ${LOCATION.city} comes with a 6-months warranty on parts and labor. Learn what's covered, how to claim warranty, and our commitment to quality.`,
  alternates: { canonical: 'https://www.mobitel.in/warranty' },
  openGraph: {
    title: `6-months Repair Warranty | Mobitel ${LOCATION.city}`,
    description: `Every repair backed by 6-months warranty. Parts and labor covered.`,
    url: 'https://www.mobitel.in/warranty',
  },
};

export default function WarrantyPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "Warranty", url: "https://www.mobitel.in/warranty" },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium">Warranty</li>
        </ol>
      </nav>

      <section className="relative pt-8 pb-16 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-3xl md:text-5xl font-semibold text-dark mb-6 tracking-tight">6-months Repair Warranty</h1>
          <p className="text-body text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Every repair at Mobitel {LOCATION.city} is backed by our comprehensive 6-months warranty. We stand behind the quality of our work and the parts we use.
          </p>
        </div>
      </section>

      {/* What's Covered */}
      <section className="pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 rounded-2xl border border-green-200 p-8 mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-dark mb-6 flex items-center gap-2">
              <span className="text-green-600">✅</span> What's Covered
            </h2>
            <ul className="space-y-4">
              {[
                "Manufacturing defects in replacement parts (dead pixels, touch sensitivity issues, color abnormalities)",
                "Battery defects (unusual drain, swelling, or failure to hold charge properly)",
                "Charging port connection issues caused by repair work",
                "Speaker/microphone quality issues in replaced components",
                "Software issues directly resulting from our repair process",
                "Camera clarity or focus problems in replaced camera modules",
                "Any functional issues that arise due to our repair workmanship",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-body">
                  <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-200 p-8 mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-dark mb-6 flex items-center gap-2">
              <span className="text-red-600">❌</span> What's NOT Covered
            </h2>
            <ul className="space-y-4">
              {[
                "Physical damage after repair (new drops, cracks, bends, or pressure damage)",
                "Water or liquid damage occurring after the repair",
                "Damage caused by unauthorized third-party repairs or modifications after our service",
                "Software issues unrelated to our repair (new app installations, OS updates, virus/malware)",
                "Cosmetic wear and tear (minor scratches, discoloration from normal use)",
                "Damage caused by using incompatible chargers or accessories",
                "Issues with parts of the phone that were not part of the original repair",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-body">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* How to Claim */}
          <div className="bg-surface rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-dark mb-6">How to Claim Warranty</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Contact Us", desc: `Call ${CONTACT.phoneDisplay} or visit our shop with your repair invoice/receipt.` },
                { step: "2", title: "Inspection", desc: "Our technician inspects the phone to verify the issue falls under warranty coverage." },
                { step: "3", title: "Free Repair", desc: "If covered, we repair or replace the part completely free of charge — no questions asked." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">{item.step}</div>
                  <h3 className="text-sm font-semibold text-dark mb-1">{item.title}</h3>
                  <p className="text-xs text-body leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty Period */}
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-dark mb-4">Warranty Period Details</h2>
            <div className="space-y-3 text-sm text-body">
              <p><strong>Duration:</strong> 6-months from the date of repair completion.</p>
              <p><strong>Proof Required:</strong> Original repair invoice or digital receipt (sent via SMS/email).</p>
              <p><strong>Number of Claims:</strong> Unlimited claims within the 6-months warranty period for the same repair.</p>
              <p><strong>Transferable:</strong> Warranty stays with the device, not the owner. If you sell your phone, the warranty transfers to the new owner.</p>
              <p><strong>Location:</strong> Warranty can be claimed at our {LOCATION.city} shop or via doorstep pickup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark text-white relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Repair with Confidence</h2>
          <p className="text-gray-300 mb-8 font-light">Every repair backed by our 6-months warranty. Book your repair today.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="/#brand-grid" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md">
              Book Repair Now
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
