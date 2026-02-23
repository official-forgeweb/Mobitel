export default function PopularServices() {
  const services = [
    {
      title: "Screen Replacement",
      desc: "Cracked or shattered display? We use premium-grade panels for a flawless look.",
      price: "From ?999",
      time: "45 min",
      badge: "Most Popular",
      badgeColor: "bg-primary text-white",
      iconBg: "bg-[#FDEEF0]",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
        </svg>
      ),
    },
    {
      title: "Battery Replacement",
      desc: "Draining too fast? Get an original battery with a 6-month replacement warranty.",
      price: "From ?499",
      time: "30 min",
      badge: "Quick Fix",
      badgeColor: "bg-green-100 text-green-700",
      iconBg: "bg-green-50",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
        </svg>
      ),
    },
    {
      title: "Water Damage",
      desc: "Phone got wet? Our micro-soldering experts can bring your device back to life.",
      price: "From ?1,499",
      time: "2-3 hrs",
      badge: "Expert Care",
      badgeColor: "bg-blue-100 text-blue-700",
      iconBg: "bg-blue-50",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
    },
    {
      title: "Charging Port Fix",
      desc: "Loose connector or won't charge at all? We replace it and restore full charging speed.",
      price: "From ?699",
      time: "40 min",
      badge: null,
      iconBg: "bg-orange-50",
      icon: (
        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      title: "Camera Repair",
      desc: "Blurry lens, cracked glass or front-camera issues � we'll restore crystal-clear shots.",
      price: "From ?799",
      time: "1 hr",
      badge: null,
      iconBg: "bg-purple-50",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      ),
    },
    {
      title: "Software & OS Issues",
      desc: "Phone stuck, crashing or running slow? We fix software bugs, resets and OS errors.",
      price: "From ?299",
      time: "30 min",
      badge: null,
      iconBg: "bg-teal-50",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full mb-3">What We Fix</span>
            <h2 className="text-3xl sm:text-4xl font-black text-dark">Popular Repair Services</h2>
            <p className="text-body text-sm mt-2 max-w-md leading-relaxed">
              Professional same-day repairs across all major phone brands.
            </p>
          </div>
          <a href="#" className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline shrink-0">
            See all services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.title} className="group bg-white border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-dark">{s.title}</h3>
                    {s.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badgeColor}`}>{s.badge}</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-body text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-primary font-black text-base">{s.price}</span>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {s.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
