export default function Testimonials() {
  const reviews = [
    { name: "Aarav Sharma", city: "Delhi", rating: 5, text: "Got my iPhone screen replaced in under an hour. Quality is flawless and price was honest. Highly recommend Mobitel!", device: "iPhone 14 Pro" },
    { name: "Priya Patel", city: "Mumbai", rating: 5, text: "Samsung had water damage and I thought it was gone for good. Mobitel saved it completely! Doorstep pickup was super convenient.", device: "Samsung S23" },
    { name: "Rohit Kumar", city: "Bangalore", rating: 4, text: "Battery replacement was quick and affordable. My phone lasts all day now. Friendly staff and clean process.", device: "OnePlus 11" },
    { name: "Sneha Reddy", city: "Hyderabad", rating: 5, text: "Charging port fixed same day! The technician was professional and explained everything. Will definitely use again.", device: "Xiaomi 13 Pro" },
    { name: "Arjun Nair", city: "Chennai", rating: 5, text: "Excellent experience from booking to delivery. Pixel camera works perfectly now. The 90-day warranty gives real peace of mind.", device: "Google Pixel 8" },
    { name: "Kavya Singh", city: "Pune", rating: 5, text: "Transparent pricing stood out to me. Exactly what was quoted, zero surprises. Got my phone back looking brand new!", device: "Realme GT Neo" },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full mb-3">Real Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-black text-dark">What Our Customers Say</h2>
          <p className="text-body text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Trusted by thousands across India. These are real experiences from real people.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="bg-surface rounded-2xl p-6 border border-border hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col">
              {/* Quote icon */}
              <svg className="w-8 h-8 text-primary/20 mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-dark text-sm leading-relaxed flex-1 mb-4">{r.text}</p>
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} className={`w-3.5 h-3.5 ${j < r.rating ? "text-amber-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-dark leading-none">{r.name}</div>
                    <div className="text-xs text-muted mt-0.5">{r.city}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary-light rounded-full px-2.5 py-1">{r.device}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
