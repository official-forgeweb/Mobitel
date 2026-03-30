import Link from "next/link";
import { LOCATION, CONTACT, WORKING_HOURS, SOCIAL_LINKS, SERVICE_LIST } from "@/lib/seo-config";

const footerServices = SERVICE_LIST.filter(s => ['screen-replacement', 'battery-replacement', 'charging-port-repair', 'camera-repair'].includes(s.slug));
const brands = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Oppo", "Vivo", "Realme", "Google Pixel"];

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Warranty", href: "/warranty" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialIcons = {
  FB: { url: SOCIAL_LINKS.facebook, label: "Facebook" },
  IG: { url: SOCIAL_LINKS.instagram, label: "Instagram" },
  TW: { url: SOCIAL_LINKS.twitter, label: "Twitter" },
  YT: { url: SOCIAL_LINKS.youtube, label: "YouTube" },
};

export default function Footer() {
  return (
    <footer className="bg-[#111315] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand + Address */}
        <div>
          <div className="block relative h-24 w-64 mb-6">
            <img src="/logo/footer_logo(3).png" alt="Mobitel Home" className="object-contain h-full w-full object-left" />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Your trusted mobile repair partner in {LOCATION.city}. Fast, reliable, and affordable repairs with a 90-day warranty on all services.
          </p>

          {/* Full Address */}
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
              </svg>
              <p className="text-sm text-gray-300 leading-relaxed">{LOCATION.fullAddress}</p>
            </div>
            <a
              href={LOCATION.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              View on Google Maps →
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {CONTACT.phoneDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {CONTACT.email}
            </a>
            <p className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {WORKING_HOURS.display}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {Object.entries(socialIcons).map(([abbr, data]) => (
              <a
                key={abbr}
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={data.label}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-xs font-bold transition-colors"
              >
                {abbr}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Services */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Our Services</h4>
          <ul className="space-y-2.5">
            {footerServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-sm text-primary hover:text-white transition-colors flex items-center gap-2 font-medium">
                View All Services →
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Brands */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Supported Brands</h4>
          <ul className="space-y-2.5">
            {brands.map((b) => (
              <li key={b}>
                <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h4>
          <ul className="space-y-2.5 mb-8">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{WORKING_HOURS.display}</p>
            <a href={`tel:${CONTACT.phone}`} className="text-base font-bold text-white hover:text-primary transition-colors">{CONTACT.phoneDisplay}</a>
            <p className="text-xs text-gray-400 mt-2">{CONTACT.supportEmail}</p>
          </div>
        </div>
      </div>

      {/* Areas Served Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="text-gray-400 font-medium">Serving {LOCATION.city}:</span>{" "}
            {LOCATION.areasServed.join(" • ")}
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 pb-24 xl:pb-5">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Mobitel. All rights reserved.</p>
          <p className="text-xs text-gray-600">Mobile Repair in {LOCATION.city}, {LOCATION.state} | Made with love in India</p>
        </div>
      </div>
    </footer>
  );
}
