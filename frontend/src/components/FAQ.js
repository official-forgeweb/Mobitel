"use client";
import { useState } from "react";

const faqs = [
  { q: "How long does a typical repair take?", a: "Most common repairs like screen and battery replacements finish within 30-60 minutes. Complex jobs like water damage may take 2-4 hours." },
  { q: "Do you use genuine parts?", a: "Yes � always. We use original or OEM-grade parts for every repair, ensuring quality and longevity your phone deserves." },
  { q: "Is there a warranty on repairs?", a: "Every repair comes with a 90-day warranty. Same issue recurs? We fix it completely free of charge." },
  { q: "How does doorstep service work?", a: "Book online, choose a slot, and our executive picks up your phone. Once repaired, it is delivered back � no extra cost." },
  { q: "Can I track my repair live?", a: "Yes! You get a tracking link by SMS once your device is with us. Follow every stage � diagnosis, repair, quality check, delivery." },
  { q: "What if my phone cannot be repaired?", a: "You will not be charged if a repair is not possible. We can also guide you on data recovery or trade-in options." },
];

export default function FAQ({ data }) {
  const [open, setOpen] = useState(null);

  const faqsItems = data?.items && data.items.length > 0 ? data.items : faqs;
  const title = data?.title || "Frequently Asked Questions";
  const subtitle = data?.subtitle || "Got Questions?";
  const desc = data?.desc || "Everything you need to know before booking your repair.";

  return (
    <section className="w-full py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full mb-3">{subtitle}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-dark">{title}</h2>
          <p className="text-body text-sm mt-2 max-w-md mx-auto leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqsItems.map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${open === i ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border"}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="text-sm font-semibold text-dark">{item.q || item.question}</span>
                <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all duration-300 ${open === i ? "bg-primary text-white rotate-180" : "bg-surface text-body"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${open === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                <p className="text-body text-sm leading-relaxed px-6">{item.a || item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
