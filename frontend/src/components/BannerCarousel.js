"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const banners = [
  {
    id: 1,
    title: "50% Off Screen Repairs",
    subtitle: "Limited time offer on all screen replacements",
    cta: "Grab the Deal",
    image: "/banners/banner1.png",
    icon: (
      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Free Pickup & Drop",
    subtitle: "We come to your doorstep — no extra charges",
    cta: "Book Now",
    image: "/banners/banner2.png",
    icon: (
      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Battery Replacement ₹499",
    subtitle: "Original batteries with 6-month warranty",
    cta: "Get Yours",
    image: "/banners/banner3.png",
    icon: (
      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h3m1.5-1.5v3" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Flat 30% Off on Accessories",
    subtitle: "Cases, chargers, tempered glass & more",
    cta: "Shop Now",
    image: "/banners/banner4.png",
    icon: (
      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
];

export default function BannerCarousel({ data }) {
  const activeBanners = data && data.length > 0 ?
    data.map((b, i) => ({ ...banners[i % banners.length], ...b })) :
    banners;

  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  // Auto-slide
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  // Pause on hover
  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    timerRef.current = setInterval(next, 5000);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div
        className="relative overflow-hidden rounded-2xl"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {activeBanners.map((banner, idx) => (
            <div
              key={banner.id || idx}
              className="relative min-w-full p-8 sm:p-12 flex items-center justify-between min-h-[300px]"
            >
              <div className="absolute inset-0 z-0">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="relative z-10 flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/90 max-w-md drop-shadow-md">
                  {banner.subtitle}
                </p>
                <button className="mt-5 bg-primary text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-primary-dark shadow-lg transition-colors">
                  {banner.cta}
                </button>
              </div>
              {banner.icon && <div className="relative z-10 hidden sm:block opacity-80">{banner.icon}</div>}
            </div>
          ))}
        </div>

        {/* Left / Right arrows */}
        <button
          onClick={() =>
            goTo((current - 1 + activeBanners.length) % activeBanners.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % activeBanners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
