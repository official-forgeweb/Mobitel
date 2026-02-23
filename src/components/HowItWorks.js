export default function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Select Your Device",
      desc: "Pick your phone brand and model from our list of 100+ supported devices.",
      color: "bg-[#FDEEF0]",
      text: "text-primary",
    },
    {
      n: "02",
      title: "Choose the Problem",
      desc: "Tell us what is wrong � cracked screen, bad battery, water damage and more.",
      color: "bg-[#FFF7ED]",
      text: "text-orange-500",
    },
    {
      n: "03",
      title: "Schedule Pickup",
      desc: "Pick a time slot and our executive arrives at your doorstep to collect the device.",
      color: "bg-[#EFF6FF]",
      text: "text-blue-500",
    },
    {
      n: "04",
      title: "Repaired and Returned",
      desc: "Certified technicians fix it, run quality checks, and deliver it back to you.",
      color: "bg-[#F0FDF4]",
      text: "text-green-500",
    },
  ];

  return (
    <section id="how" className="w-full py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full mb-3">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-dark">How It Works</h2>
          <p className="text-body text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Getting your phone repaired has never been easier � no store visit needed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, i) => (
            <div key={i} className="relative group">
              <div className="bg-white rounded-2xl p-7 h-full border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <span className={`text-2xl font-black ${s.text}`}>{s.n}</span>
                </div>
                <h3 className="text-base font-bold text-dark mb-2">{s.title}</h3>
                <p className="text-body text-sm leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 -right-3 z-10">
                  <svg className="w-6 h-6 text-border" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
