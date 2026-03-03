"use client";
import { useState, useEffect, useRef } from "react";

export default function Testimonials() {
  const reviews = [
    { name: "Aarav Sharma", city: "Delhi", rating: 5, text: "Got my iPhone screen replaced in under an hour. Quality is flawless and price was honest. Highly recommend Mobitel!", device: "iPhone 14 Pro" },
    { name: "Priya Patel", city: "Mumbai", rating: 5, text: "Samsung had water damage and I thought it was gone for good. Mobitel saved it completely! Doorstep pickup was super convenient.", device: "Samsung S23" },
    { name: "Rohit Kumar", city: "Bangalore", rating: 4, text: "Battery replacement was quick and affordable. My phone lasts all day now. Friendly staff and clean process.", device: "OnePlus 11" },
    { name: "Sneha Reddy", city: "Hyderabad", rating: 5, text: "Charging port fixed same day! The technician was professional and explained everything. Will definitely use again.", device: "Xiaomi 13 Pro" },
    { name: "Arjun Nair", city: "Chennai", rating: 5, text: "Excellent experience from booking to delivery. Pixel camera works perfectly now. The 90-day warranty gives real peace of mind.", device: "Google Pixel 8" },
    { name: "Kavya Singh", city: "Pune", rating: 5, text: "Transparent pricing stood out to me. Exactly what was quoted, zero surprises. Got my phone back looking brand new!", device: "Realme GT Neo" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  const activeReview = reviews[currentIndex];

  return (
    <section className="w-full py-32 bg-surface relative overflow-hidden flex flex-col items-center justify-center min-h-[700px]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] opacity-70 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F8D272]/20 rounded-full blur-[200px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center gap-16">

        {/* Left Intro text */}
        <div className="lg:w-1/3 text-center lg:text-left shrink-0">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 bg-primary-light px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Real Experiences
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-medium text-dark leading-[1.1] tracking-tight mb-8">
            Don't just take <br className="hidden lg:block" />our word for it.
          </h2>
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-primary-light text-primary flex items-center justify-center font-bold text-lg shadow-md">
                  {['A', 'P', 'R', 'S'][i - 1]}
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-muted">
              <span className="text-dark font-bold text-lg block">4.8/5</span>
              from 50k+ reviews
            </div>
          </div>

          {/* Navigation Arrows for Desktop */}
          <div className="hidden lg:flex gap-4 mt-12">
            <button onClick={handlePrev} className="w-14 h-14 rounded-full border border-border bg-white flex items-center justify-center text-dark hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={handleNext} className="w-14 h-14 rounded-full border border-border bg-white flex items-center justify-center text-dark hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>

        {/* Right Slider */}
        <div className="lg:w-2/3 w-full relative" onMouseEnter={() => clearInterval(timerRef.current)} onMouseLeave={startTimer}>
          <div className="relative bg-white border border-border/60 rounded-[2rem] p-8 sm:p-12 lg:p-16 shadow-2xl shadow-primary/5 min-h-[400px] flex flex-col justify-center">

            <svg className="absolute top-8 left-8 lg:top-12 lg:left-12 w-16 h-16 text-primary/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <div key={currentIndex} className="animate-in fade-in slide-in-from-right-8 duration-700 ease-out relative z-10 w-full flex-1 flex flex-col">
              <div className="flex gap-1 mb-8 shrink-0">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} className={`w-5 h-5 ${j < activeReview.rating ? "text-amber-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <div className="min-h-[160px] flex items-center mb-10 shrink-0">
                <p className="text-xl sm:text-3xl lg:text-[32px] text-dark leading-snug font-medium italic">
                  "{activeReview.text}"
                </p>
              </div>

              <div className="flex items-center gap-5 mt-auto">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/20 shrink-0">
                  {activeReview.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xl font-bold text-dark tracking-wide">{activeReview.name}</div>
                  <div className="flex items-center gap-2 mt-1 text-sm font-medium">
                    <span className="text-muted">{activeReview.city}</span>
                    <span className="w-1 h-1 bg-border rounded-full"></span>
                    <span className="text-primary bg-primary-light px-2 py-0.5 rounded-md">{activeReview.device}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar Indicators */}
            <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 hidden md:flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full h-1.5 ${currentIndex === idx ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-primary/50"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center justify-between mt-8">
            <div className="flex gap-4">
              <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={handleNext} className="w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
