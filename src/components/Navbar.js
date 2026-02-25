"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Track Repair", href: "/#track" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [location, setLocation] = useState("Detecting...");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchRef = useRef(null);
  const pathname = usePathname();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // GPS location
  useEffect(() => {
    if (!("geolocation" in navigator)) { setLocation("GPS unavailable"); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`/api/location?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(", ").slice(0, 3);
            setLocation(parts.join(", "));
          } else {
            setLocation("Unknown Location");
          }
        } catch { setLocation("Location error"); }
      },
      () => setLocation("Location denied")
    );
  }, []);

  // Determine if a link is active based on pathname
  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href) && href !== "/#track";
  };

  return (
    <>
      {/* Announcement bar + Mobile Location */}
      <div className="bg-primary font-sans text-white text-xs py-1.5 px-4 font-medium tracking-wide flex items-center justify-between md:justify-center">
        <div className="hidden md:block">
          50% off on all screen repairs this week &nbsp;&nbsp; Free doorstep pickup &amp; delivery &nbsp;&nbsp; Call: <a href="tel:+919876543210" className="text-white hover:text-gray-200 cursor-pointer">9876543210</a>
        </div>

        {/* Mobile-only location topbar */}
        <div className="md:hidden flex items-center gap-1.5 max-w-[200px] cursor-pointer" onClick={() => {/* open location modal logic */ }}>
          <svg className="w-4 h-4 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1 opacity-90">
              <span className="text-[11px] font-medium text-white truncate leading-tight">
                {location === "Unknown Location" ? "Set Location" : location.split(",")[0]}
              </span>
              <svg className="w-2.5 h-2.5 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <span className="text-[9px] text-white/70 truncate leading-tight mt-0.5">
              {location === "Unknown Location" ? "Click to set" : location}
            </span>
          </div>
        </div>

        {/* Mobile-only call to action */}
        <div className="md:hidden">
          <a href="tel:+919876543210" className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-medium cursor-pointer">Call Now</a>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`sticky top-0 z-50 font-sans transition-all duration-300 ${scrolled
          ? "bg-white/90 nav-blur shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
          : "bg-white shadow-sm"
          }`}
      >
        {/* Top row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 shrink-0 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <div className="leading-none">
                <span className="text-lg font-semibold text-dark tracking-tight">Mobi<span className="text-primary">tel</span></span>
                <div className="text-[9px] font-medium text-muted tracking-widest uppercase">Repair Experts</div>
              </div>
            </a>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-[180px] relative">
              <div className="flex items-center w-full bg-surface border border-border rounded-xl px-4 py-2 gap-2 focus-within:border-primary focus-within:bg-white transition-all duration-200 group">
                <svg className="w-4 h-4 text-muted group-focus-within:text-primary shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="flex-1 bg-transparent text-sm w-full text-dark placeholder-muted outline-none"
                />
              </div>
            </div>


            {/* Location block - Zomato style */}
            <button
              className="hidden lg:flex items-center gap-2 hover:bg-surface px-3 py-1.5 rounded-xl transition-colors group text-left cursor-pointer"
            >
              <svg className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div className="flex flex-col max-w-[280px]">
                <div className="flex items-center gap-1">
                  <span className="text-[15px] font-medium text-dark truncate leading-tight">
                    {location === "Unknown Location" ? "Set Location" : location.split(",")[0]}
                  </span>
                  <svg className="w-3.5 h-3.5 text-dark shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                <span className="text-[11px] text-muted truncate leading-tight mt-0.5 w-full">
                  {location === "Unknown Location" ? "Click to set your address" : location}
                </span>
              </div>
            </button>

            {/* Universal Spacer to push right-side elements to the edge */}
            <div className="flex-1" />

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[13px] font-medium cursor-pointer transition-all relative py-1 ${isActive ? "text-primary" : "text-dark/80 hover:text-primary"
                      }`}
                  >
                    {link.label}
                    {/* Hover outline indicator */}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transition-all duration-300 ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                        } hover:scale-x-100 peer-hover:scale-x-100 hover:opacity-100`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <a
              href="#book"
              className="hidden md:flex items-center gap-1.5 bg-primary text-white text-[13px] font-medium cursor-pointer px-6 py-2.5 rounded-xl hover:bg-dark transition-all duration-300 shadow-sm shrink-0 ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Book Repair
            </a>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-body" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>



            {/* Hamburger for mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-surface flex items-center justify-center hover:bg-primary-light transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile search bar - slides down */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <div className="flex items-center bg-surface border border-border rounded-xl px-4 py-2.5 gap-2 focus-within:border-primary transition-all cursor-text">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search repairs, brands..."
                  className="flex-1 bg-transparent text-sm text-dark placeholder-muted outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Desktop - second nav strip (only on medium screens, not large) */}
        <div className="hidden md:flex lg:hidden border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium cursor-pointer text-dark hover:text-white whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-primary transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" />

          {/* Drawer */}
          <div
            className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <span className="font-semibold text-dark">Mobi<span className="text-primary">tel</span></span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center cursor-pointer">
                <svg className="w-4 h-4 text-body" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-body hover:text-primary hover:bg-primary-light transition-all cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="px-4 pb-6 pt-3 border-t border-border space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted bg-surface rounded-xl px-3 py-2.5">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="truncate">{location}</span>
              </div>
              <a
                href="#book"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Book a Repair
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
