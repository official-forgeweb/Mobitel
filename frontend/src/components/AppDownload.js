import Image from "next/image";

export default function AppDownload({ data }) {
    const title = data?.title || "We're available on Desktop and Mobile.";
    const subtitle = data?.subtitle || "Our Technology";
    const desc = data?.desc || "Enjoy effortless access to our robust repair tracking platform on both your desktop and phone. Download the app today and keep your device health in your pocket!";
    const buttonText = data?.buttonText || "Download App";

    return (
        <section className="bg-surface pt-8 md:pt-12 pb-16 overflow-hidden border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Visuals Container - Laptop Only with Doodle Arrows */}
                <div className="relative w-full max-w-4xl mx-auto h-auto mb-12 md:mb-20 flex justify-center items-end px-4 pt-4 md:pt-8">

                    {/* Crayon Doodle Arrow - Left Side */}
                    <div className="absolute -left-20 sm:-left-36 lg:-left-48 xl:-left-60 top-[20%] w-32 sm:w-48 lg:w-56 h-32 sm:h-48 lg:h-56 pointer-events-none hidden md:block opacity-90 -rotate-12">
                        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#e84e1b] drop-shadow-sm">
                            <defs>
                                <filter id="crayonEffectLeft" x="-20%" y="-20%" width="140%" height="140%">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                                </filter>
                            </defs>
                            <path
                                d="M 30 150 Q 120 160 160 60"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="none"
                                filter="url(#crayonEffectLeft)"
                            />
                            <path
                                d="M 120 55 L 170 50 L 155 100"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                filter="url(#crayonEffectLeft)"
                            />
                        </svg>
                        <div className="absolute -bottom-4 lg:-bottom-8 left-0 w-full text-center text-[#e84e1b] font-medium text-sm lg:text-base tracking-widest uppercase rotate-3 filter brightness-90 saturate-150" style={{ fontFamily: "cursive" }}>
                            Fast UI
                        </div>
                    </div>

                    {/* Crayon Doodle Arrow - Right Side */}
                    <div className="absolute -right-20 sm:-right-36 lg:-right-48 xl:-right-60 top-[15%] w-32 sm:w-48 lg:w-56 h-32 sm:h-48 lg:h-56 pointer-events-none hidden md:block opacity-90 rotate-12">
                        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#e84e1b] drop-shadow-sm">
                            <defs>
                                <filter id="crayonEffectRight" x="-20%" y="-20%" width="140%" height="140%">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                                </filter>
                            </defs>
                            <path
                                d="M 170 150 Q 80 160 40 60"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="none"
                                filter="url(#crayonEffectRight)"
                            />
                            <path
                                d="M 80 55 L 30 50 L 45 100"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                filter="url(#crayonEffectRight)"
                            />
                        </svg>
                        <div className="absolute -bottom-4 lg:-bottom-8 left-0 w-full text-center text-[#e84e1b] font-medium text-sm lg:text-base tracking-widest uppercase -rotate-6 filter brightness-90 saturate-150" style={{ fontFamily: "cursive" }}>
                            Try It Out!
                        </div>
                    </div>

                    {/* Desktop Representation (Centered) */}
                    <div className="relative w-full max-w-4xl flex-1 shrink bg-dark rounded-t-xl md:rounded-t-2xl shadow-2xl overflow-hidden border-t border-x border-dark/30 aspect-[16/10] sm:aspect-[16/10]">
                        {/* Fake Mac Window Header */}
                        <div className="h-6 md:h-8 border-b border-white/10 flex items-center px-3 gap-1.5 bg-[#1a1a1a] shrink-0">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ff5f56]"></div>
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ffbd2e]"></div>
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#27c93f]"></div>
                            <div className="flex-1 flex justify-center border-border">
                                <div className="h-2 md:h-2.5 w-16 md:w-24 bg-white/5 rounded"></div>
                            </div>
                        </div>
                        {/* Dashboard UI - Forced to cover remaining height, NO HOVER EFFECT */}
                        <div className="w-full h-[calc(100%-1.5rem)] md:h-[calc(100%-2rem)] bg-white relative overflow-hidden">
                            <img
                                src="/mockups/dashboard.png"
                                alt="Mobitel Dashboard UI"
                                className="w-full h-full object-cover object-left-top absolute inset-0"
                            />
                        </div>
                    </div>

                </div>

                {/* Bottom Content Container - Centered */}
                <div className="max-w-2xl mx-auto text-center space-y-6 flex flex-col items-center">

                    {/* Tiny Tagline */}
                    <div className="inline-flex items-center gap-3 text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em]">
                        <span className="w-6 h-px bg-primary/40"></span>
                        {subtitle}
                        <span className="w-6 h-px bg-primary/40"></span>
                    </div>

                    {/* Headline - Elegant & Stylish */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark tracking-tight leading-snug">
                        {title}
                    </h2>

                    {/* Text Description */}
                    <p className="text-body text-[14px] md:text-[15px] leading-relaxed font-medium max-w-xl mx-auto">
                        {desc}
                    </p>

                    {/* Download Buttons / Badges */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 w-full px-4">
                        <a
                            href="#"
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-dark text-white px-8 py-4 rounded-xl hover:bg-black transition-colors duration-300 shadow-xl shadow-dark/10 flex-shrink-0"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="font-bold text-[15px]">{buttonText}</span>
                        </a>

                        {/* Availability Badges */}
                        <div className="flex flex-col items-center sm:items-start text-[10px] font-bold text-muted tracking-widest uppercase sm:pl-6 sm:border-l border-border gap-2">
                            <span className="opacity-60">Now Accessible On</span>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                                <span className="flex items-center gap-1 text-dark">
                                    <svg className="w-3.5 h-3.5 text-dark/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Windows & MacOS
                                </span>
                                <span className="flex items-center gap-1 text-dark">
                                    <svg className="w-3.5 h-3.5 text-dark/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Android & iOS
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
