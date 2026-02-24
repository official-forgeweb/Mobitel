
export const metadata = {
    title: "About Us | Mobitel",
    description: "Learn more about Mobitel, your trusted experts in fast, reliable smartphone repairs.",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col h-full bg-surface">
            <main className="flex-1">
                {/* Simple Page Header */}
                <div className="bg-primary/5 py-16 md:py-24 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Story</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark tracking-tight mb-6">
                            About <span className="text-primary">Mobitel</span>
                        </h1>
                        <p className="text-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                            We started with a simple mission: to make premium smartphone repairs accessible, fast, and completely transparent for everyone.
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                            {/* Image Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="w-full h-[240px] rounded-3xl overflow-hidden bg-primary/10">
                                        <img
                                            src="/banners/banner3.png"
                                            alt="Technician repairing phone"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-full h-[320px] rounded-3xl overflow-hidden bg-primary/10">
                                        <img
                                            src="/banners/banner1.png"
                                            alt="Broken screen"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-full h-[320px] rounded-3xl overflow-hidden bg-primary/10">
                                        <img
                                            src="/banners/banner2.png"
                                            alt="Customer handing phone"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-full h-[240px] rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center p-8 text-center border-2 border-primary/20 bg-primary/5">
                                        <div>
                                            <div className="text-4xl font-black text-primary mb-2">10k+</div>
                                            <div className="text-dark font-bold text-sm">Devices <br />Restored</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-dark tracking-tight mb-6">
                                        Redefining Device Repairs
                                    </h2>
                                    <p className="text-body leading-relaxed text-[15px] font-medium mb-6">
                                        For years, fixing a broken phone meant settling for counterfeit parts, hidden costs, and days without your device. We knew there had to be a better way.
                                    </p>
                                    <p className="text-body leading-relaxed text-[15px] font-medium">
                                        At Mobitel, we've combined expert technicians, genuine OEM-grade parts, and a customer-first approach to create a repair experience that actually leaves you smiling. Whether you choose our direct-to-door Home Service or visit us in-store, we guarantee a seamless, transparent process from quote to completion.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border mt-8">
                                    <div className="bg-surface p-6 rounded-2xl">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-dark mb-2">Premium Parts</h3>
                                        <p className="text-xs text-body leading-relaxed">We only use the highest quality spare components that meet strict original specs.</p>
                                    </div>

                                    <div className="bg-surface p-6 rounded-2xl">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-dark mb-2">Same-Day Fix</h3>
                                        <p className="text-xs text-body leading-relaxed">Over 80% of our repairs are completed on the very same day.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
