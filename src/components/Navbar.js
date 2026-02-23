"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [location, setLocation] = useState("Detecting location...");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              "Unknown";
            const state = data.address.state || "";
            setLocation(`${city}, ${state}`);
          } catch {
            setLocation("Location unavailable");
          }
        },
        () => {
          setLocation("Location denied");
        }
      );
    } else {
      setLocation("GPS not supported");
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-dark">
              Mobi<span className="text-primary">tel</span>
            </span>
          </div>

          {/* Location - always visible */}
          <div className="flex items-center gap-1.5 text-sm text-secondary bg-light px-3 py-1.5 rounded-full">
            <svg
              className="w-4 h-4 text-primary shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="max-w-[160px] truncate">{location}</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors"
            >
              Track Repair
            </a>
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors"
            >
              Contact
            </a>
            <button className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-dark transition-colors">
              Book Repair
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-light transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-dark"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <div className="flex flex-col gap-3 pt-3">
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors py-2"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors py-2"
            >
              Services
            </a>
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors py-2"
            >
              Track Repair
            </a>
            <a
              href="#"
              className="text-sm font-medium text-dark hover:text-primary transition-colors py-2"
            >
              Contact
            </a>
            <button className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-dark transition-colors mt-1">
              Book Repair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
