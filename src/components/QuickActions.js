"use client";
const actions = [
  { label: "Screen Repair", href: "#" },
  { label: "Battery Replace", href: "#" },
  { label: "Water Damage", href: "#" },
  { label: "Charging Port", href: "#" },
  { label: "Camera Fix", href: "#" },
  { label: "Track Repair", href: "#track" },
];
export default function QuickActions() {
  return (
    <>
      {/* Desktop floating right panel */}
      <div className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col bg-white shadow-2xl border border-border border-r-0 rounded-l-2xl overflow-hidden">
        <div className="bg-primary px-3 py-2">
          <p className="text-white text-[10px] font-bold uppercase tracking-widest text-center">Quick Fix</p>
        </div>
        {actions.map((a) => (
          <a key={a.label} href={a.href} className="group flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-body hover:bg-primary-light hover:text-primary border-b border-border last:border-0 transition-all duration-150 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-muted group-hover:bg-primary transition-colors shrink-0" />
            {a.label}
          </a>
        ))}
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center px-4 py-3 gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted leading-none">Need your phone fixed?</p>
            <p className="text-sm font-bold text-dark mt-0.5">Book a repair in 60 seconds</p>
          </div>
          <a href="#book" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors shrink-0">
            Book Now
          </a>
        </div>
      </div>
    </>
  );
}
