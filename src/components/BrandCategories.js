"use client";

import { useState } from "react";

const brands = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    name: "OnePlus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/OnePlus_logo.svg",
  },
  {
    name: "Xiaomi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
  },
  {
    name: "Vivo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Vivo_logo_2019.svg",
  },
  {
    name: "Oppo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/OPPO_LOGO_2019.svg",
  },
  {
    name: "Realme",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.svg",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Motorola",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Motorola-logo.svg",
  },
  {
    name: "Nothing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Nothing_logo.svg",
  },
  {
    name: "iQOO",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/IQOO_Logo.svg",
  },
  {
    name: "Poco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/POCO_brand_logo.svg",
  },
  {
    name: "Nokia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg",
  },
  {
    name: "Sony",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
  },
  {
    name: "Asus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
  },
  {
    name: "Huawei",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/HUAWEI_Logo.svg",
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
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark">
            Select Your Brand
          </h2>
          <p className="text-secondary text-sm mt-1">
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
          <a
            key={brand.name}
            href="#"
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-light group-hover:bg-primary/5 transition-colors">
              <BrandLogo brand={brand} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-dark group-hover:text-primary transition-colors text-center">
              {brand.name}
            </span>
          </a>
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
    </section>
  );
}
