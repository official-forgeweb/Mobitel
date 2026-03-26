/**
 * Schema Markup Generator Utilities
 * ──────────────────────────────────
 * Generates JSON-LD structured data for Google rich results.
 * Used across all pages via layout.js and individual page components.
 */

import { BUSINESS, LOCATION, CONTACT, WORKING_HOURS, SOCIAL_LINKS, RATINGS, PRICE_RANGE, SERVICE_LIST, BRANDS_SERVED } from './seo-config';

/**
 * LocalBusiness / MobilePhoneRepairShop Schema
 * Used on ALL pages via layout.js
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MobilePhoneRepairShop",
    "@id": `${BUSINESS.website}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: `${BUSINESS.name} is ${LOCATION.city}'s trusted mobile phone repair service. Expert technicians, genuine parts, 90-day warranty. Screen replacement, battery replacement, water damage repair and more for all smartphone brands.`,
    url: BUSINESS.website,
    logo: BUSINESS.logo,
    image: BUSINESS.image,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: LOCATION.streetAddress,
      addressLocality: LOCATION.city,
      addressRegion: LOCATION.state,
      postalCode: LOCATION.pincode,
      addressCountry: LOCATION.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LOCATION.latitude,
      longitude: LOCATION.longitude,
    },
    openingHoursSpecification: WORKING_HOURS.structured.map((slot) =>
      slot.days.map((day) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day,
        opens: slot.opens,
        closes: slot.closes,
      }))
    ).flat(),
    priceRange: PRICE_RANGE,
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Online Payment",
    areaServed: {
      "@type": "City",
      name: LOCATION.city,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mobile Repair Services",
      itemListElement: SERVICE_LIST.map((service) => ({
        "@type": "OfferCatalog",
        name: service.name,
        itemListElement: [{
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.shortDesc,
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: service.startingPrice,
            priceCurrency: "INR",
          },
        }],
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: RATINGS.value,
      reviewCount: RATINGS.count,
      bestRating: RATINGS.bestRating,
    },
    sameAs: Object.values(SOCIAL_LINKS),
  };
}

/**
 * WebSite Schema
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS.name,
    url: BUSINESS.website,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BUSINESS.website}/services?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * FAQPage Schema
 * @param {Array<{question: string, answer: string}>} faqs
 */
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question || faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer || faq.a,
      },
    })),
  };
}

/**
 * Service Schema for individual service pages
 * @param {Object} service - service from SERVICE_LIST
 */
export function generateServiceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDesc,
    provider: {
      "@type": "MobilePhoneRepairShop",
      name: BUSINESS.name,
      url: BUSINESS.website,
    },
    areaServed: {
      "@type": "City",
      name: LOCATION.city,
    },
    offers: {
      "@type": "Offer",
      price: service.startingPrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    serviceType: "Mobile Phone Repair",
  };
}

/**
 * BreadcrumbList Schema
 * @param {Array<{name: string, url: string}>} items
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * BlogPosting Schema
 * @param {Object} post
 */
export function generateBlogPostSchema(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.meta_description,
    author: {
      "@type": "Person",
      name: post.author_name || "Mobitel Team",
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    image: post.featured_image || BUSINESS.image,
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      logo: {
        "@type": "ImageObject",
        url: BUSINESS.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BUSINESS.website}/blog/${post.slug}`,
    },
  };
}

/**
 * Render JSON-LD script tag (for use in JSX)
 */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
