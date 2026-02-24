"use client";
import { useState } from "react";

export default function PopularServices() {
  const services = [
    {
      title: "Screen Repair",
      desc: "Premium grade display replacement restoring perfect touch and vivid colors.",
      price: "From ₹999",
      time: "45 min",
      gradient: "from-red-900 via-primary-dark to-dark",
      image: "https://images.unsplash.com/photo-1574314150596-12c8230b809a?q=80&w=600&auto=format&fit=crop",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
        </svg>
      ),
    },
    {
      title: "Battery Swap",
      desc: "Original batteries with true capacity and a 6-month solid warranty.",
      price: "From ₹499",
      time: "30 min",
      gradient: "from-green-900 via-teal-900 to-dark",
      image: "https://images.unsplash.com/photo-1601524902161-15c00e1cfc63?q=80&w=600&auto=format&fit=crop",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
        </svg>
      ),
    },
    {
      title: "Water Damage",
      desc: "Deep cleaning and micro-soldering rescuing the unsavable.",
      price: "From ₹1,499",
      time: "2-3 hrs",
      gradient: "from-blue-900 via-blue-800 to-dark",
      image: "https://images.unsplash.com/photo-1588508070860-26210f274a7b?q=80&w=600&auto=format&fit=crop",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
    },
    {
      title: "Port Fix",
      desc: "Fast, solid charging port replacement restoring full speed.",
      price: "From ₹699",
      time: "40 min",
      gradient: "from-orange-900 via-amber-900 to-dark",
      image: "https://images.unsplash.com/photo-1583225214464-9296029427aa?q=80&w=600&auto=format&fit=crop",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      title: "Camera Lens",
      desc: "Crystal clear focus restored with original camera modules.",
      price: "From ₹799",
      time: "1 hr",
      gradient: "from-purple-900 via-fuchsia-900 to-dark",
      image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=600&auto=format&fit=crop",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section id="services" className="w-full py-24 bg-dark relative overflow-hidden text-white font-sans">
      {/* Dynamic ambient background glow based on active card */}
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 opacity-30 blur-[150px] pointer-events-none ${services[active].gradient}`}
      ></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F8D272] mb-6">
              <span className="w-8 h-[2px] bg-[#F8D272]"></span>
              Premium Craftsmanship
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight">
              Premium repairs for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/40 italic font-light">
                every problem.
              </span>
            </h2>
          </div>
          <button className="hidden md:inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full transition-all duration-300 border border-white/10 shrink-0 uppercase tracking-widest text-[11px] font-bold">
            Explore All Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* Expanding Cards Container */}
        <div className="flex flex-col lg:flex-row w-full h-[700px] lg:h-[550px] gap-4">
          {services.map((service, index) => {
            const isActive = active === index;

            return (
              <div
                key={index}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                className={`
                  relative overflow-hidden rounded-[2rem] cursor-pointer flex-shrink-0
                  transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                  transform-gpu
                  ${isActive ? 'lg:flex-[3.5] flex-[3] shadow-2xl' : 'lg:flex-[0.5] flex-[0.5] hover:bg-white/5 opacity-70 hover:opacity-100'}
                `}
              >
                {/* Background Image (only really visible when active) */}
                <div
                  className={`absolute inset-0 transition-all duration-[10s] ease-out transform-gpu ${isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-60'}`}
                >
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover grayscale-[20%]" />
                  <div className={`absolute inset-0 transition-colors duration-700 ease-in-out ${isActive ? 'bg-gradient-to-t from-black/95 via-black/40 to-black/10' : 'bg-black/85'}`}></div>
                </div>

                {/* Vertical Text & Icon (when inactive on Desktop) */}
                <div className={`absolute inset-0 flex flex-col items-center justify-end pb-8 transition-opacity duration-300 hidden lg:flex ${isActive ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-300'}`}>
                  <div className="text-white/60 mb-8 transform -rotate-90 whitespace-nowrap text-xl font-medium tracking-wide">
                    {service.title}
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 backdrop-blur-sm group-hover:text-white group-hover:border-white/40 transition-colors">
                    {service.icon}
                  </div>
                </div>

                {/* Full Content (when active) */}
                <div className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-end transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu ${isActive ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-8 pointer-events-none delay-0'}`}>

                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-6 shadow-xl">
                    {service.icon}
                  </div>

                  <h3 className="text-3xl md:text-5xl font-medium mb-4 text-white drop-shadow-lg leading-tight w-full truncate md:whitespace-normal">
                    {service.title}
                  </h3>

                  <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-sm mb-8 drop-shadow-md lg:min-w-[300px]">
                    {service.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-[#F8D272] text-dark px-6 py-3 rounded-full font-bold text-sm shadow-lg whitespace-nowrap">
                      {service.price}
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-full text-white text-sm font-medium whitespace-nowrap">
                      <svg className="w-4 h-4 text-[#F8D272]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.time}
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet Inactive View */}
                <div className={`absolute inset-0 flex items-center px-6 transition-opacity duration-300 lg:hidden ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-200'}`}>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-medium text-white/70">{service.title}</h3>
                </div>

              </div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <button className="mt-8 w-full md:hidden flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full transition-all duration-300 border border-white/10 uppercase tracking-widest text-[11px] font-bold">
          Explore All Services
        </button>

      </div>
    </section>
  );
}
