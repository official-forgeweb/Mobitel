export default function StatsBar() {
  const stats = [
    { value: "50,000+", label: "Repairs Done" },
    { value: "200+", label: "Cities Covered" },
    { value: "4.8 / 5", label: "Avg Rating" },
    { value: "90 Days", label: "Warranty" },
    { value: "~30 Min", label: "Avg Repair Time" },
  ];
  return (
    <section className="w-full bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left flex flex-col items-center sm:items-start sm:border-r sm:border-white/20 sm:last:border-0 sm:px-4 sm:first:pl-0 sm:last:pr-0">
              <span className="text-white font-black text-xl leading-none">{stat.value}</span>
              <span className="text-white/70 text-xs mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
