export default function Footer() {
  const services = ["Screen Repair","Battery Replacement","Water Damage","Charging Port","Camera Repair","Speaker Fix","Back Glass","Software Issues"];
  const brands = ["Apple","Samsung","OnePlus","Xiaomi","Oppo","Vivo","Realme","Google Pixel"];
  const links = ["About Us","How It Works","Pricing","Careers","Blog","Contact","Privacy Policy","Terms of Service"];
  return (
    <footer className="bg-[#111315] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary text-white text-lg font-black px-2.5 py-0.5 rounded-lg">M</span>
            <span className="text-xl font-black tracking-tight">Mobitel</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">Your trusted mobile repair partner. Fast, reliable, and affordable repairs with a 90-day warranty on all services.</p>
          <div className="flex items-center gap-3">
            {["FB","TW","IG","YT"].map((s) => (
              <a key={s} href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-xs font-bold transition-colors">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Our Services</h4>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary shrink-0" />{s}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Supported Brands</h4>
          <ul className="space-y-2.5">
            {brands.map((b) => (
              <li key={b}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary shrink-0" />{b}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h4>
          <ul className="space-y-2.5 mb-8">
            {links.map((l) => (
              <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Mon-Sat / 9am-8pm</p>
            <a href="tel:+919999999999" className="text-base font-bold text-white hover:text-primary transition-colors">+91 99999 99999</a>
            <p className="text-xs text-gray-400 mt-2">support@mobitel.in</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 pb-24 xl:pb-5">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Mobitel. All rights reserved.</p>
          <p className="text-xs text-gray-600">Made with love in India</p>
        </div>
      </div>
    </footer>
  );
}
