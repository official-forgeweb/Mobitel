import Link from "next/link";
import { LOCATION, CONTACT } from "@/lib/seo-config";
import { generateFAQSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";
import LocationFAQClient from "@/components/LocationFAQClient";

export const metadata = {
  title: `FAQ — Mobile Repair Questions Answered | Mobitel ${LOCATION.city}`,
  description: `Common questions about mobile phone repair at Mobitel ${LOCATION.city}. Pricing, warranty, repair time, doorstep service, and more. Find answers instantly.`,
  alternates: { canonical: 'https://www.mobitel.in/faq' },
  openGraph: {
    title: `FAQ — Mobile Repair Questions Answered | Mobitel ${LOCATION.city}`,
    description: `Common questions about mobile phone repair at Mobitel ${LOCATION.city}. Find answers instantly.`,
    url: 'https://www.mobitel.in/faq',
  },
};

const faqCategories = [
  {
    category: "General Questions",
    faqs: [
      { question: `What is Mobitel?`, answer: `Mobitel is ${LOCATION.city}'s trusted mobile phone repair service. We repair all smartphone brands including iPhone, Samsung, Xiaomi, OnePlus, and more. We offer both in-shop and doorstep repair services with a 90-day warranty.` },
      { question: `Where is Mobitel located in ${LOCATION.city}?`, answer: `We are located at ${LOCATION.fullAddress}. We also offer free doorstep pickup and delivery across all areas of ${LOCATION.city}.` },
      { question: `What are your working hours?`, answer: `Our working hours are Monday to Saturday: 9AM-8PM, and Sunday: 10AM-5PM. You can book online 24/7 and we'll confirm your appointment. Walk-ins are welcome during working hours.` },
      { question: `Which phone brands do you repair?`, answer: `We repair all major smartphone brands including Apple iPhone, Samsung Galaxy, Xiaomi/Redmi, OnePlus, Vivo, Oppo, Realme, Google Pixel, Motorola, Nothing, iQOO, Poco, Nokia, and more. If your brand isn't listed, call us — we likely repair it.` },
      { question: `Do you repair tablets and iPads too?`, answer: `Yes! We repair tablets and iPads including screen replacement, battery replacement, and charging port fixes. Pricing varies by model — contact us for a quote.` },
      { question: `How can I book a phone repair?`, answer: `You can book a repair in three ways: (1) Online through our website at mobitel.in, (2) Call us at ${CONTACT.phoneDisplay}, or (3) Walk into our shop during working hours. Online booking is the fastest way.` },
    ],
  },
  {
    category: "Pricing Questions",
    faqs: [
      { question: `How much does phone repair cost?`, answer: `Repair costs depend on the service type and your phone model. Screen replacements start from ₹999, battery replacements from ₹499, charging port repairs from ₹499. We provide a free diagnosis and upfront quote — no hidden charges.` },
      { question: `Is the diagnosis free?`, answer: `Yes, diagnosis is completely free at Mobitel. Our technician will examine your phone, identify the issue, and provide a transparent quote. If you decide not to proceed with the repair, there's no charge at all.` },
      { question: `Do you charge for doorstep pickup?`, answer: `No! Doorstep pickup and delivery is completely free across ${LOCATION.city}. There are no hidden service charges or delivery fees.` },
      { question: `Are your prices fixed or negotiable?`, answer: `Our prices are transparent and competitive. We provide exact quotes based on your phone model before starting any repair. The quoted price is final — no surprise charges added later.` },
      { question: `Do you accept UPI, card payments, or only cash?`, answer: `We accept all payment methods: Cash, Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), and online bank transfers. Pay after your phone is repaired and tested.` },
    ],
  },
  {
    category: "Service Questions",
    faqs: [
      { question: `How long does a phone repair take?`, answer: `Most repairs are completed within the same day. Screen replacement: 30-60 minutes, Battery replacement: 20-30 minutes, Charging port: 30-45 minutes, Water damage: 2-4 hours, Motherboard repair: 2-6 hours.` },
      { question: `Do you use genuine/original parts?`, answer: `We use high-quality OEM-grade parts that match original specifications. These parts offer the same performance, quality, and durability as factory parts. For select iPhone models, we also offer genuine Apple parts at premium pricing.` },
      { question: `Can I track my repair status?`, answer: `Yes! Once your phone is with us, you receive a tracking link via SMS. Use it to follow your repair status in real-time — from diagnosis to completion. You can also visit mobitel.in/track-repair to check status anytime.` },
      { question: `Will I lose my data during repair?`, answer: `For most repairs (screen, battery, charging port, speaker, camera), your data is completely safe and untouched. For software repairs or motherboard repairs, we'll inform you beforehand if there's any risk to data and help you backup if possible.` },
      { question: `Do you offer same-day repair?`, answer: `Yes! About 85% of our repairs are completed on the same day. Screen and battery replacements are usually done within an hour. Complex repairs like water damage may take a few hours. We always try to return your phone as quickly as possible.` },
    ],
  },
  {
    category: "Warranty & Policy Questions",
    faqs: [
      { question: `What warranty do you provide on repairs?`, answer: `Every repair at Mobitel comes with a 90-day warranty covering the parts we installed and our labor. If the same issue recurs within 90 days, we fix it completely free of charge.` },
      { question: `What's covered under your repair warranty?`, answer: `Our warranty covers manufacturing defects in the replacement parts (dead pixels, touch issues, battery drain from defective battery, etc.) and any issues caused by our repair work. Physical damage (new drops, cracks) and water damage to repaired parts are not covered.` },
      { question: `How do I claim the warranty?`, answer: `Simply bring your phone back to our shop or call us to arrange a pickup. Mention your original repair invoice number. Our technician will inspect the issue and if it falls under warranty, the repair is done free of charge.` },
      { question: `What if you can't repair my phone?`, answer: `If we determine your phone cannot be repaired (extremely rare), you won't be charged anything — not even a diagnosis fee. We can also advise on data recovery options or trade-in alternatives.` },
    ],
  },
];

const allFaqs = faqCategories.flatMap((cat) => cat.faqs);

export default function FAQPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "FAQ", url: "https://www.mobitel.in/faq" },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      <JsonLd data={generateFAQSchema(allFaqs)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium">FAQ</li>
        </ol>
      </nav>

      <section className="relative pt-8 pb-16 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-semibold text-dark mb-6 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-body text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about mobile phone repair at Mobitel {LOCATION.city}. Can't find your answer? <a href={`tel:${CONTACT.phone}`} className="text-primary hover:underline">Call us at {CONTACT.phoneDisplay}</a>.
          </p>
        </div>
      </section>

      {faqCategories.map((category) => (
        <section key={category.category} className="pb-12 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl font-semibold text-dark mb-6">{category.category}</h2>
            <LocationFAQClient faqs={category.faqs} />
          </div>
        </section>
      ))}

      <section className="py-16 bg-dark text-white relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 mb-8">Our team is ready to help. Contact us now.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href={`tel:${CONTACT.phone}`} className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto shadow-md">
              Call {CONTACT.phoneDisplay}
            </a>
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors w-full sm:w-auto">
              Contact Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
