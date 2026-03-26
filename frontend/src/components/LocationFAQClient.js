"use client";

import { useState } from "react";

export default function LocationFAQClient({ faqs }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div key={i} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${open === i ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border"}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
          >
            <span className="text-sm font-semibold text-dark">{faq.question}</span>
            <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all duration-300 ${open === i ? "bg-primary text-white rotate-180" : "bg-surface text-body"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </button>
          <div className={`transition-all duration-300 ease-in-out ${open === i ? "max-h-40 pb-5" : "max-h-0"}`}>
            <p className="text-body text-sm leading-relaxed px-6">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
