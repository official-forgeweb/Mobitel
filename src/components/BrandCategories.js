"use client";

import { useState } from "react";

const brands = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    models: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 11", "iPhone XR", "iPhone XS Max", "iPhone XS"]
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    models: ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy A54 5G", "Galaxy A34 5G", "Galaxy S22 Ultra", "Galaxy S22", "Galaxy Z Fold 4", "Galaxy Z Flip 4", "Galaxy A53", "Galaxy S21 FE", "Galaxy M54", "Galaxy M34", "Galaxy Note 20 Ultra"]
  },
  {
    name: "OnePlus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/OnePlus_logo.svg",
    models: ["OnePlus 12", "OnePlus 12R", "OnePlus Open", "OnePlus 11 5G", "OnePlus 11R", "OnePlus 10 Pro", "OnePlus 10T", "OnePlus 10R", "OnePlus 9 Pro", "OnePlus 9", "OnePlus 9RT", "OnePlus Nord 3", "OnePlus Nord CE 3", "OnePlus Nord CE 3 Lite", "OnePlus 8T", "OnePlus 8 Pro", "OnePlus Nord 2T", "OnePlus Nord CE 2"]
  },
  {
    name: "Xiaomi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
    models: ["Xiaomi 14 Ultra", "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13", "Xiaomi 12 Pro", "Xiaomi 12", "Xiaomi 11T Pro", "Xiaomi 11 Ultra", "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi Note 12 Pro 5G", "Redmi Note 12 5G", "Xiaomi Pad 6"]
  },
  {
    name: "Vivo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Vivo_logo_2019.svg",
    models: ["Vivo X100 Pro", "Vivo X100", "Vivo X90 Pro", "Vivo X90", "Vivo V30 Pro", "Vivo V30", "Vivo V29 Pro", "Vivo V29", "Vivo V27 Pro", "Vivo V27", "Vivo T2 Pro", "Vivo T2", "Vivo Y200e", "Vivo Y200", "Vivo Y100", "Vivo X80 Pro", "Vivo V25 Pro", "Vivo V25", "Vivo Y75"]
  },
  {
    name: "Oppo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/OPPO_LOGO_2019.svg",
    models: ["Oppo Find X7 Ultra", "Oppo Find X7", "Oppo Find N3 Fold", "Oppo Find N3 Flip", "Oppo Reno 11 Pro", "Oppo Reno 11", "Oppo Reno 10 Pro+", "Oppo Reno 10 Pro", "Oppo Reno 10", "Oppo Find X6 Pro", "Oppo Reno 8 Pro", "Oppo Reno 8", "Oppo F25 Pro", "Oppo F23 5G", "Oppo F21s Pro", "Oppo A79 5G", "Oppo A78 5G", "Oppo A58", "Oppo K10 5G"]
  },
  {
    name: "Realme",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.svg",
    models: ["Realme 12 Pro+", "Realme 12 Pro", "Realme GT 5 Pro", "Realme GT Neo 3", "Realme 11 Pro+", "Realme 11 Pro", "Realme 11 5G", "Realme 11x 5G", "Realme Narzo 60 Pro", "Realme Narzo 60", "Realme C67 5G", "Realme C55", "Realme C53", "Realme GT 2 Pro", "Realme 10 Pro+", "Realme 10 Pro", "Realme 9 Pro+", "Realme Narzo 50 Pro"]
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    models: ["Pixel 8 Pro", "Pixel 8", "Pixel 7a", "Pixel 7 Pro", "Pixel 7", "Pixel 6a", "Pixel 6 Pro", "Pixel 6", "Pixel Fold", "Pixel 5a", "Pixel 5", "Pixel 4a 5G", "Pixel 4 XL", "Pixel 4", "Pixel 3a XL", "Pixel 3a", "Pixel 3 XL", "Pixel 3", "Pixel 2 XL", "Pixel 2"]
  },
  {
    name: "Motorola",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Motorola-logo.svg",
    models: ["Edge 50 Pro", "Edge 40 Neo", "Edge 40", "Edge 30 Ultra", "Edge 30 Fusion", "Edge 30 Pro", "Moto G84", "Moto G54", "Moto G34", "Moto G82", "Moto G62", "Moto G52", "Razr 40 Ultra", "Razr 40", "Edge 20 Pro", "Moto G Stylus", "Moto G Power"]
  },
  {
    name: "Nothing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Nothing_logo.svg",
    models: ["Phone (2a)", "Phone (2)", "Phone (1)", "Ear (2)", "Ear (1)", "Ear (Stick)", "CMF Phone 1", "CMF Buds", "CMF Watch Pro", "Phone (3)", "Nothing Watch", "Nothing Power", "Nothing Audio", "Ear (a)", "Ear (New)"]
  },
  {
    name: "iQOO",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/IQOO_Logo.svg",
    models: ["iQOO 12", "iQOO 11", "iQOO 9 Pro", "iQOO 9T", "iQOO 9", "iQOO 9 SE", "iQOO Neo 9 Pro", "iQOO Neo 7 Pro", "iQOO Neo 7", "iQOO Neo 6", "iQOO Z9", "iQOO Z7 Pro", "iQOO Z7", "iQOO Z7s", "iQOO Z6 Pro", "iQOO Z6 Lite", "iQOO Z6", "iQOO 7 Legend", "iQOO 7"]
  },
  {
    name: "Poco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/POCO_brand_logo.svg",
    models: ["Poco X6 Pro", "Poco X6", "Poco M6 Pro", "Poco M6 5G", "Poco F5 Pro", "Poco F5", "Poco X5 Pro", "Poco X5", "Poco M5", "Poco F4 5G", "Poco X4 Pro 5G", "Poco M4 Pro 5G", "Poco M4 Pro", "Poco C65", "Poco C55", "Poco C51", "Poco F3 GT", "Poco X3 Pro", "Poco X3"]
  },
  {
    name: "Nokia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg",
    models: ["Nokia G42 5G", "Nokia X30 5G", "Nokia G60 5G", "Nokia C32", "Nokia C22", "Nokia C12 Pro", "Nokia C12", "Nokia G21", "Nokia G11 Plus", "Nokia C21 Plus", "Nokia XR20", "Nokia G20", "Nokia 5.4", "Nokia 5.3", "Nokia 8.3 5G", "Nokia 7.2", "Nokia 6.2", "Nokia 3.4", "Nokia 2.4"]
  },
  {
    name: "Sony",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    models: ["Xperia 1 V", "Xperia 5 V", "Xperia 10 V", "Xperia 1 IV", "Xperia 5 IV", "Xperia 10 IV", "Xperia PRO-I", "Xperia 1 III", "Xperia 5 III", "Xperia 10 III", "Xperia PRO", "Xperia 1 II", "Xperia 5 II", "Xperia 10 II", "Xperia 1", "Xperia 5", "Xperia 10", "Xperia XZ3", "Xperia XZ2 Premium"]
  },
  {
    name: "Asus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    models: ["ROG Phone 8 Pro", "ROG Phone 8", "Zenfone 11 Ultra", "Zenfone 10", "ROG Phone 7 Ultimate", "ROG Phone 7", "Zenfone 9", "ROG Phone 6 Pro", "ROG Phone 6", "ROG Phone 6D Ultimate", "Zenfone 8 Flip", "Zenfone 8", "ROG Phone 5s Pro", "ROG Phone 5s", "ROG Phone 5 Ultimate", "ROG Phone 5", "Zenfone 7 Pro", "Zenfone 7"]
  },
  {
    name: "Huawei",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/HUAWEI_Logo.svg",
    models: ["Mate 60 Pro+", "Mate 60 Pro", "Mate 60", "P60 Pro", "P60 Art", "P60", "Mate X5", "Mate X3", "Nova 12 Pro", "Nova 12", "Nova 11 Pro", "Nova 11", "P50 Pro", "P50 Pocket", "Mate 50 Pro", "Mate 50", "Nova 10 Pro", "Nova 10", "Mate 40 Pro", "P40 Pro"]
  },
];

// Fallback: render brand initial when image fails
function BrandLogo({ brand }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-bold text-lg">
          {brand.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="w-12 h-12 object-contain"
      onError={() => setImgError(true)}
    />
  );
}

export default function BrandCategories() {
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark">
            Select Your Brand
          </h2>
          <p className="text-muted text-sm mt-1">
            Choose your phone brand to explore repair services
          </p>
        </div>
        <a
          href="#"
          className="hidden sm:inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
        >
          View All
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </a>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {brands.map((brand) => (
          <button
            key={brand.name}
            onClick={() => setSelectedBrand(brand)}
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 outline-none w-full cursor-pointer"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-surface group-hover:bg-primary/5 transition-colors">
              <BrandLogo brand={brand} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-dark group-hover:text-primary transition-colors text-center w-full truncate">
              {brand.name}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile "View All" */}
      <div className="flex sm:hidden justify-center mt-6">
        <a
          href="#"
          className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
        >
          View All Brands
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </a>
      </div>

      {/* Models Modal Popup */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedBrand(null)}
          ></div>
          <div className="relative bg-white border border-border w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 scale-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border bg-surface/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border">
                  <BrandLogo brand={selectedBrand} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-dark">
                    {selectedBrand.name} Models
                  </h3>
                  <p className="text-sm text-muted">
                    Select your device model to continue
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBrand(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface text-muted hover:bg-red-50 hover:text-red-500 transition-colors focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {selectedBrand.models && selectedBrand.models.map((model, idx) => (
                  <button
                    key={idx}
                    className="flex items-center justify-center text-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-md transition-all duration-200 group text-sm font-medium text-dark break-words"
                  >
                    <span>{model}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
