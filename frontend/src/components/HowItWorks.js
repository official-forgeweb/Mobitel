"use client";
import { useState, useEffect } from "react";

export default function HowItWorks({ data }) {
  const fallbackSteps = [
    {
      title: "Select Your Device",
      desc: "Pick your phone brand and model from our list of 100+ supported devices, and get a quick quote.",
      image: "/banners/banner1.png"
    },
    {
      title: "Schedule Pickup",
      desc: "Choose a time slot and our executive will securely collect the device directly from your doorstep.",
      image: "/banners/banner2.png"
    },
    {
      title: "Repaired & Delivered",
      desc: "Our certified technicians fix it, run quality checks, and deliver it back to you looking brand new.",
      image: "/banners/banner3.png"
    }
  ];

  const steps = data?.steps || fallbackSteps;
  const title = data?.title || "Mobitel offers seamless repair for your damaged device.";
  const subtitle = data?.subtitle || "We provide a complete range of services designed for every smartphone issue. Explore our simple, transparent, and hassle-free process.";

  const [activeStep, setActiveStep] = useState(0);

  // Optional: Auto-cycle through steps if desired
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="how" className="w-full py-24 bg-[#FEF6EB] flex items-center justify-center lg:min-h-[800px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 items-center">

          {/* Left Column */}
          <div className="flex flex-col justify-center space-y-6 lg:pr-10 order-2 lg:order-1 mt-10 lg:mt-0 text-center lg:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-dark/50">
              How We Work
            </span>
            <h2 className="text-4xl lg:text-[42px] font-medium text-dark leading-[1.15] tracking-tight">
              {title}
            </h2>
            <div className="lg:border-l-[1.5px] lg:border-dark/30 lg:pl-6 py-1 mt-6 lg:mt-10">
              <p className="text-[13px] text-dark/70 leading-relaxed font-medium max-w-sm mx-auto lg:mx-0">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Center Column - Phone Frame */}
          <div className="flex justify-center items-center py-4 order-1 lg:order-2">
            <div className="relative w-[260px] h-[520px] xs:w-[280px] xs:h-[580px] sm:w-[300px] sm:h-[620px] bg-[#111] rounded-[40px] xs:rounded-[48px] shadow-2xl border-[8px] xs:border-[10px] border-[#111] overflow-hidden flex-shrink-0">
              {/* Screen Content Wrapper */}
              <div className="w-full h-full relative rounded-[32px] xs:rounded-[36px] overflow-hidden bg-white">
                {steps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeStep === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img
                      src={step.image || `/banners/banner${(idx % 4) + 1}.png`}
                      alt={step.title}
                      className="w-full h-full object-cover scale-105 transition-transform duration-[10s] ease-linear"
                      style={{ transform: activeStep === idx ? 'scale(1.15)' : 'scale(1.05)' }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-12 left-0 w-full px-6 transition-all duration-700 delay-300 transform"
                      style={{ opacity: activeStep === idx ? 1 : 0, transform: activeStep === idx ? 'translateY(0)' : 'translateY(10px)' }}>
                      <h3 className="text-white text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-white/80 text-[13px] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Island Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-[#111] rounded-full z-20"></div>

              {/* Power/Volume Buttons on side */}
              <div className="absolute top-32 -left-[14px] w-1 h-12 bg-[#222] rounded-l-md"></div>
              <div className="absolute top-48 -left-[14px] w-1 h-12 bg-[#222] rounded-l-md"></div>
              <div className="absolute top-40 -right-[14px] w-1 h-16 bg-[#222] rounded-r-md"></div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-center space-y-12 lg:pl-10 order-3 text-center lg:text-left">
            <div className="space-y-10">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={step.id || idx}
                    className="cursor-pointer group transition-all duration-300"
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={() => setActiveStep(idx)}
                  >
                    <div className={`text-2xl transition-all duration-500 ease-out ${isActive ? 'text-dark font-semibold' : 'text-dark/30 font-medium group-hover:text-dark/50'}`}>
                      {step.title}
                    </div>
                    <p className={`text-[13px] mt-3 leading-relaxed transition-all duration-500 ease-out max-w-xs mx-auto lg:mx-0 ${isActive ? 'text-dark/70 font-medium' : 'text-dark/20 font-medium group-hover:text-dark/40'}`}>
                      {step.desc || step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button className="bg-[#F8D272] text-dark font-semibold text-[13px] px-8 py-3.5 rounded-full hover:bg-[#F2C14C] transition-colors shadow-sm">
                Book a Repair
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
