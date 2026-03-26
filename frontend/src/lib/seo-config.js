/**
 * Central SEO & Business Configuration for Mobitel
 * ──────────────────────────────────────────────────
 * Update this ONE file to change location, contact, and business data
 * across the entire website. All pages import from here.
 */

export const BUSINESS = {
  name: "Mobitel",
  legalName: "Mobitel Mobile Repair Services",
  tagline: "Your Trusted Mobile Repair Partner",
  foundedYear: 2014,
  website: "https://www.mobitel.in",
  logo: "https://www.mobitel.in/logo.png",
  image: "https://www.mobitel.in/banners/banner1.png",
};

export const LOCATION = {
  city: "Faridabad",
  state: "Haryana",
  country: "India",
  countryCode: "IN",
  fullAddress: "983H+6QP, Sector 4R, Sector 4, Ballabhgarh, Delhi, Faridabad, Haryana 121004",
  streetAddress: "Sector 4R, Sector 4, Ballabhgarh",
  pincode: "121004",
  latitude: 28.3530762,
  longitude: 77.3294396,
  googleMapsLink: "https://www.google.com/maps/place/28.3530762,77.3294396",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.4!2d77.3294396!3d28.3530762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDIxJzExLjEiTiA3N8KwMTknNDYuMCJF!5e0!3m2!1sen!2sin!4v1",
  areasServed: [
    "Ballabhgarh", "Sector 4", "Sector 7", "Sector 8", "Sector 15", "Sector 16",
    "Sector 17", "Sector 19", "Sector 21", "Sector 28", "Sector 29",
    "Sector 31", "Sector 37", "Sector 46", "Sector 56", "Sector 62",
    "Sector 81", "Sector 86", "NIT Faridabad", "Old Faridabad",
    "New Industrial Town", "Surajkund", "Badarpur Border", "Mewla Maharajpur",
    "Tigaon", "Pali", "Dabua Colony", "Ashoka Enclave", "Green Fields Colony",
    "BPTP", "Neharpar"
  ],
};

export const CONTACT = {
  phone: "+91-8287853207",
  phoneDisplay: "+91 82878 53207",
  phoneRaw: "918287853207",
  email: "mobitel.ceo@gmail.com",
  supportEmail: "support@mobitel.in",
  whatsapp: "918287853207",
};

export const WORKING_HOURS = {
  display: "Mon-Sat: 9AM-8PM, Sun: 10AM-5PM",
  structured: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "20:00" },
    { days: ["Sunday"], opens: "10:00", closes: "17:00" },
  ],
};

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/mobitelindia",
  instagram: "https://www.instagram.com/mobitelindia",
  twitter: "https://www.twitter.com/mobitelindia",
  youtube: "https://www.youtube.com/@mobitelindia",
};

export const RATINGS = {
  value: "4.8",
  count: "250",
  bestRating: "5",
};

export const PRICE_RANGE = "₹499 - ₹14,999";

export const SERVICE_LIST = [
  {
    name: "Screen Replacement",
    slug: "screen-replacement",
    shortDesc: "Cracked or unresponsive screen? Get it replaced with genuine parts in 30-60 minutes.",
    startingPrice: 999,
    priceRange: "₹999 - ₹12,999",
    repairTime: "30-60 minutes",
    icon: "📱",
    metaTitle: `Phone Screen Replacement in ${LOCATION.city} | From ₹999 | Mobitel`,
    metaDesc: `Broken phone screen? Get it replaced in 30 minutes! iPhone screen from ₹2,999, Samsung from ₹1,999, Xiaomi from ₹999. Genuine parts. 90-day warranty. Doorstep service in ${LOCATION.city}.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹2,999 - ₹12,999" },
      { brand: "Samsung", range: "₹1,999 - ₹9,999" },
      { brand: "Xiaomi/Redmi", range: "₹999 - ₹3,999" },
      { brand: "OnePlus", range: "₹1,999 - ₹7,999" },
      { brand: "Vivo/Oppo", range: "₹999 - ₹4,999" },
      { brand: "Other Brands", range: "₹999 - ₹5,999" },
    ],
  },
  {
    name: "Battery Replacement",
    slug: "battery-replacement",
    shortDesc: "Phone dying too fast? Restore full-day battery life in just 20 minutes.",
    startingPrice: 499,
    priceRange: "₹499 - ₹4,999",
    repairTime: "20-30 minutes",
    icon: "🔋",
    metaTitle: `Phone Battery Replacement in ${LOCATION.city} | From ₹499 | Mobitel`,
    metaDesc: `Phone battery draining fast? Get battery replaced in 20 minutes. All brands — iPhone, Samsung, Xiaomi. Original batteries. 90-day warranty. Same-day service in ${LOCATION.city}.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹1,999 - ₹4,999" },
      { brand: "Samsung", range: "₹999 - ₹3,499" },
      { brand: "Xiaomi/Redmi", range: "₹499 - ₹1,999" },
      { brand: "OnePlus", range: "₹999 - ₹2,999" },
      { brand: "Vivo/Oppo", range: "₹499 - ₹1,999" },
      { brand: "Other Brands", range: "₹499 - ₹2,499" },
    ],
  },
  {
    name: "Charging Port Repair",
    slug: "charging-port-repair",
    shortDesc: "Phone not charging or loose port? We clean, resolder, or replace charging ports.",
    startingPrice: 499,
    priceRange: "₹499 - ₹2,999",
    repairTime: "30-45 minutes",
    icon: "🔌",
    metaTitle: `Charging Port Repair in ${LOCATION.city} | Phone Not Charging Fix | Mobitel`,
    metaDesc: `Phone not charging? Loose charging port? Get charging port repair starting ₹499. All phone brands. Same-day fix in ${LOCATION.city}. 90-day warranty.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹1,499 - ₹2,999" },
      { brand: "Samsung", range: "₹999 - ₹2,499" },
      { brand: "Xiaomi/Redmi", range: "₹499 - ₹1,499" },
      { brand: "OnePlus", range: "₹999 - ₹1,999" },
      { brand: "Vivo/Oppo", range: "₹499 - ₹1,499" },
      { brand: "Other Brands", range: "₹499 - ₹1,999" },
    ],
  },
  {
    name: "Water Damage Repair",
    slug: "water-damage-repair",
    shortDesc: "Phone fell in water? Act fast! Advanced ultrasonic cleaning and component-level repair.",
    startingPrice: 999,
    priceRange: "₹999 - ₹7,999",
    repairTime: "2-4 hours",
    icon: "💧",
    metaTitle: `Water Damage Repair in ${LOCATION.city} | Phone Fell in Water | Mobitel`,
    metaDesc: `Phone fell in water? Don't panic! Expert water damage repair in ${LOCATION.city}. Component-level repair. Data recovery possible. Bring within 24 hours for best results. Mobitel.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹2,999 - ₹7,999" },
      { brand: "Samsung", range: "₹1,999 - ₹5,999" },
      { brand: "Xiaomi/Redmi", range: "₹999 - ₹3,999" },
      { brand: "OnePlus", range: "₹1,999 - ₹4,999" },
      { brand: "Vivo/Oppo", range: "₹999 - ₹3,999" },
      { brand: "Other Brands", range: "₹999 - ₹4,999" },
    ],
  },
  {
    name: "Camera Repair",
    slug: "camera-repair",
    shortDesc: "Blurry photos or cracked camera lens? We replace front and rear camera modules.",
    startingPrice: 799,
    priceRange: "₹799 - ₹6,999",
    repairTime: "30-60 minutes",
    icon: "📷",
    metaTitle: `Camera Repair in ${LOCATION.city} | Phone Camera Fix | Mobitel`,
    metaDesc: `Phone camera blurry or broken? Front & rear camera repair from ₹799. All brands — iPhone, Samsung, OnePlus. Same-day service in ${LOCATION.city}. 90-day warranty.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹2,499 - ₹6,999" },
      { brand: "Samsung", range: "₹1,499 - ₹4,999" },
      { brand: "Xiaomi/Redmi", range: "₹799 - ₹2,999" },
      { brand: "OnePlus", range: "₹1,499 - ₹3,999" },
      { brand: "Vivo/Oppo", range: "₹799 - ₹2,999" },
      { brand: "Other Brands", range: "₹799 - ₹3,999" },
    ],
  },
  {
    name: "Speaker Repair",
    slug: "speaker-repair",
    shortDesc: "Can't hear calls or low sound? We fix earpiece and loudspeaker issues.",
    startingPrice: 499,
    priceRange: "₹499 - ₹2,999",
    repairTime: "30-45 minutes",
    icon: "🔊",
    metaTitle: `Speaker Repair in ${LOCATION.city} | Phone Sound Fix | Mobitel`,
    metaDesc: `Phone speaker not working? Low sound during calls? Speaker repair from ₹499. Earpiece & loudspeaker fix for all brands in ${LOCATION.city}. Same-day service.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹1,499 - ₹2,999" },
      { brand: "Samsung", range: "₹999 - ₹2,499" },
      { brand: "Xiaomi/Redmi", range: "₹499 - ₹1,499" },
      { brand: "OnePlus", range: "₹999 - ₹1,999" },
      { brand: "Vivo/Oppo", range: "₹499 - ₹1,499" },
      { brand: "Other Brands", range: "₹499 - ₹1,999" },
    ],
  },
  {
    name: "Microphone Repair",
    slug: "microphone-repair",
    shortDesc: "People can't hear you on calls? We fix or replace phone microphones.",
    startingPrice: 499,
    priceRange: "₹499 - ₹2,499",
    repairTime: "30-45 minutes",
    icon: "🎤",
    metaTitle: `Microphone Repair in ${LOCATION.city} | Phone Mic Fix | Mobitel`,
    metaDesc: `Phone microphone not working? People can't hear you on calls? Mic repair from ₹499 for all brands in ${LOCATION.city}. Same-day fix. 90-day warranty. Mobitel.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹1,499 - ₹2,499" },
      { brand: "Samsung", range: "₹999 - ₹1,999" },
      { brand: "Xiaomi/Redmi", range: "₹499 - ₹1,499" },
      { brand: "OnePlus", range: "₹999 - ₹1,999" },
      { brand: "Vivo/Oppo", range: "₹499 - ₹1,499" },
      { brand: "Other Brands", range: "₹499 - ₹1,999" },
    ],
  },
  {
    name: "Back Glass Replacement",
    slug: "back-glass-replacement",
    shortDesc: "Cracked back panel? We replace it to restore your phone's original look.",
    startingPrice: 799,
    priceRange: "₹799 - ₹5,999",
    repairTime: "45-90 minutes",
    icon: "🔲",
    metaTitle: `Back Glass Replacement in ${LOCATION.city} | Phone Back Panel Fix | Mobitel`,
    metaDesc: `Cracked phone back glass? Back panel replacement from ₹799. iPhone, Samsung & all brands. Restore your phone's look in ${LOCATION.city}. 90-day warranty. Mobitel.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹2,499 - ₹5,999" },
      { brand: "Samsung", range: "₹1,499 - ₹4,999" },
      { brand: "Xiaomi/Redmi", range: "₹799 - ₹2,499" },
      { brand: "OnePlus", range: "₹1,499 - ₹3,999" },
      { brand: "Vivo/Oppo", range: "₹799 - ₹2,999" },
      { brand: "Other Brands", range: "₹799 - ₹3,499" },
    ],
  },
  {
    name: "Software Repair",
    slug: "software-repair",
    shortDesc: "Phone hanging, crashing, or stuck? We fix software issues, updates, and OS problems.",
    startingPrice: 499,
    priceRange: "₹499 - ₹2,999",
    repairTime: "30-90 minutes",
    icon: "💻",
    metaTitle: `Software Repair in ${LOCATION.city} | Phone Hanging/Crashing Fix | Mobitel`,
    metaDesc: `Phone hanging, crashing or boot loop? Software repair from ₹499. OS reinstall, virus removal, data recovery. All brands serviced in ${LOCATION.city}. Mobitel.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹999 - ₹2,999" },
      { brand: "Samsung", range: "₹499 - ₹1,999" },
      { brand: "Xiaomi/Redmi", range: "₹499 - ₹1,499" },
      { brand: "OnePlus", range: "₹499 - ₹1,999" },
      { brand: "Vivo/Oppo", range: "₹499 - ₹1,499" },
      { brand: "Other Brands", range: "₹499 - ₹1,999" },
    ],
  },
  {
    name: "Motherboard Repair",
    slug: "motherboard-repair",
    shortDesc: "Phone dead or boot-looping? Expert micro-soldering and logic board repair.",
    startingPrice: 1999,
    priceRange: "₹1,999 - ₹9,999",
    repairTime: "2-6 hours",
    icon: "🔧",
    metaTitle: `Motherboard Repair in ${LOCATION.city} | Dead Phone Fix | Mobitel`,
    metaDesc: `Phone dead or restarting randomly? Expert motherboard repair with micro-soldering in ${LOCATION.city}. Component-level diagnosis. From ₹1,999. 90-day warranty. Mobitel.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹3,999 - ₹9,999" },
      { brand: "Samsung", range: "₹2,999 - ₹7,999" },
      { brand: "Xiaomi/Redmi", range: "₹1,999 - ₹4,999" },
      { brand: "OnePlus", range: "₹2,999 - ₹5,999" },
      { brand: "Vivo/Oppo", range: "₹1,999 - ₹4,999" },
      { brand: "Other Brands", range: "₹1,999 - ₹5,999" },
    ],
  },
  {
    name: "Data Recovery",
    slug: "data-recovery",
    shortDesc: "Lost important photos or files? We recover data from damaged or dead phones.",
    startingPrice: 999,
    priceRange: "₹999 - ₹7,999",
    repairTime: "1-24 hours",
    icon: "💾",
    metaTitle: `Data Recovery in ${LOCATION.city} | Phone Data Rescue | Mobitel`,
    metaDesc: `Lost photos, contacts or files from a dead phone? Data recovery service in ${LOCATION.city} from ₹999. Water damaged or dead phone data rescue. Mobitel.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹2,999 - ₹7,999" },
      { brand: "Samsung", range: "₹1,999 - ₹5,999" },
      { brand: "Xiaomi/Redmi", range: "₹999 - ₹3,999" },
      { brand: "OnePlus", range: "₹1,999 - ₹4,999" },
      { brand: "Vivo/Oppo", range: "₹999 - ₹3,999" },
      { brand: "Other Brands", range: "₹999 - ₹4,999" },
    ],
  },
  {
    name: "Network & Signal Repair",
    slug: "network-signal-repair",
    shortDesc: "No signal, weak network, or SIM not detected? We fix network IC and antenna issues.",
    startingPrice: 799,
    priceRange: "₹799 - ₹3,999",
    repairTime: "1-3 hours",
    icon: "📶",
    metaTitle: `Network Signal Repair in ${LOCATION.city} | No Signal Fix | Mobitel`,
    metaDesc: `Phone showing no signal? SIM not detected? Network & signal repair from ₹799 in ${LOCATION.city}. Antenna & network IC fix for all brands. 90-day warranty. Mobitel.`,
    pricingByBrand: [
      { brand: "iPhone", range: "₹1,999 - ₹3,999" },
      { brand: "Samsung", range: "₹1,499 - ₹2,999" },
      { brand: "Xiaomi/Redmi", range: "₹799 - ₹1,999" },
      { brand: "OnePlus", range: "₹999 - ₹2,499" },
      { brand: "Vivo/Oppo", range: "₹799 - ₹1,999" },
      { brand: "Other Brands", range: "₹799 - ₹2,499" },
    ],
  },
];

export const BRANDS_SERVED = [
  "Apple", "Samsung", "Xiaomi", "OnePlus", "Vivo", "Oppo", "Realme",
  "Google Pixel", "Motorola", "Nothing", "iQOO", "Poco", "Huawei", "Nokia",
];

// Helper to get a service config by slug
export function getServiceBySlug(slug) {
  return SERVICE_LIST.find((s) => s.slug === slug);
}

// Helper to get related services (excluding current)
export function getRelatedServices(currentSlug, count = 4) {
  return SERVICE_LIST.filter((s) => s.slug !== currentSlug).slice(0, count);
}
