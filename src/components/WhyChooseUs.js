export default function WhyChooseUs() {
  const features = [
    { title: "Certified Technicians", desc: "Background verified & skilled experts.", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "90-Day Warranty", desc: "Hassle-free coverage on all repairs.", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Genuine Parts", desc: "100% original or OEM-grade components.", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Doorstep Service", desc: "We come to you. No travel required.", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Top Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            The smartest way to fix it
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-dark leading-tight tracking-tight mb-6">
            Why choose <span className="font-bold text-primary italic">Mobitel?</span>
          </h2>
          <p className="text-body text-lg leading-relaxed">
            We combine certified expertise, genuine parts, and an incredibly seamless doorstep experience so you never have to stress about a broken device again.
          </p>
        </div>

        {/* Minimalist Horizontal Features Array */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 lg:gap-12 relative">

          {/* Connecting line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0"></div>

          {features.map((f, i) => (
            <div key={i} className="flex-1 relative z-10 flex flex-col items-center text-center group">

              <div className="w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-primary group-hover:text-primary transition-all duration-300 text-dark">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
              <p className="text-body text-sm leading-relaxed max-w-[250px] mx-auto">{f.desc}</p>

            </div>
          ))}
        </div>

        {/* Bottom Call to Action area */}
        <div className="mt-24 w-full bg-surface border border-border rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center text-primary shrink-0">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-black text-dark mb-1">4.8/5 <span className="text-lg font-medium text-body ml-2">Average Rating</span></div>
              <div className="text-sm font-medium text-muted">Based on 50,000+ repairs across India</div>
            </div>
          </div>

          <button className="whitespace-nowrap bg-primary text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-dark transition-all duration-300 shadow-md hover:shadow-xl w-full md:w-auto">
            Book a Repair Now
          </button>
        </div>

      </div>
    </section>
  );
}
