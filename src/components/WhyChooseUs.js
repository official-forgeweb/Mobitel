export default function WhyChooseUs() {
  const features = [
    { title: "Certified Technicians", desc: "Every engineer is trained, background-verified and certified to handle 100+ phone models.", color: "text-primary", bg: "bg-primary-light" },
    { title: "90-Day Warranty", desc: "Same issue recurs within 90 days? We fix it again � free of charge. Zero excuses.", color: "text-green-700", bg: "bg-green-50" },
    { title: "Genuine Parts Only", desc: "We source original or OEM-grade components to ensure longevity and peak performance.", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Free Doorstep Service", desc: "Our executives pick up and drop off your phone. No travel, no waiting, no hassle.", color: "text-orange-500", bg: "bg-orange-50" },
    { title: "Transparent Pricing", desc: "Price shown is price paid. No surprise charges, hidden fees or last-minute additions.", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "60-Min Turnaround", desc: "Most common repairs are done in under an hour. Same-day service guaranteed.", color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <section className="w-full py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left � text */}
          <div className="lg:w-2/5 shrink-0">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full mb-4">Why Mobitel</span>
            <h2 className="text-3xl sm:text-4xl font-black text-dark leading-tight mb-4">
              The Smartest Way to<br className="hidden sm:block" /> Get Your Phone Fixed
            </h2>
            <p className="text-body text-sm leading-relaxed mb-6">
              We combine certified expertise, genuine parts and a seamless doorstep experience so you never have to stress about your broken phone again.
            </p>
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white rounded-2xl px-5 py-4 text-center border border-border">
                <div className="text-2xl font-black text-primary">50K+</div>
                <div className="text-xs text-muted mt-0.5">Happy Customers</div>
              </div>
              <div className="bg-white rounded-2xl px-5 py-4 text-center border border-border">
                <div className="text-2xl font-black text-primary">200+</div>
                <div className="text-xs text-muted mt-0.5">Cities Served</div>
              </div>
              <div className="bg-white rounded-2xl px-5 py-4 text-center border border-border">
                <div className="text-2xl font-black text-primary">4.8</div>
                <div className="text-xs text-muted mt-0.5">Avg. Rating</div>
              </div>
            </div>
          </div>

          {/* Right � grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className={`inline-flex w-9 h-9 ${f.bg} ${f.color} rounded-xl items-center justify-center mb-3`}>
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-dark mb-1">{f.title}</h3>
                <p className="text-body text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
