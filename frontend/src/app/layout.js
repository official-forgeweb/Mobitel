import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { BUSINESS, LOCATION, CONTACT } from "@/lib/seo-config";
import { generateLocalBusinessSchema, generateWebSiteSchema, JsonLd } from "@/lib/schema-generator";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://www.mobitel.in'),
  title: `Mobile Repair in Faridabad | Screen & Battery Replacement | Mobitel`,
  description: `Best mobile phone repair service in Faridabad. iPhone & Samsung screen replacement from ₹999. Battery replacement from ₹499. Same-day doorstep repair. 90-day warranty. Trusted by 250+ customers. Book online now!`,
  keywords: [
    "mobile repair Faridabad", "phone screen replacement Faridabad", "battery replacement Faridabad",
    "iPhone repair Faridabad", "Samsung repair Faridabad", "doorstep phone repair Faridabad",
    "mobile repair near me", "phone repair shop Faridabad", "smartphone repair Faridabad", "Mobitel",
    "phone repair Ballabhgarh", "mobile repair NIT Faridabad"
  ],
  authors: [{ name: "Mobitel Team" }],
  creator: "Mobitel",
  publisher: "Mobitel Services",
  alternates: { canonical: '/' },
  openGraph: {
    title: "Mobile Repair in Faridabad — Same Day Service | Mobitel",
    description: "Professional phone repair in Faridabad. Screen, battery, charging port & more. Starting ₹499. 90-day warranty.",
    url: 'https://www.mobitel.in',
    siteName: 'Mobitel',
    images: [
      {
        url: 'https://www.mobitel.in/banners/banner1.png',
        width: 1200,
        height: 630,
        alt: 'Mobitel Mobile Repair Service in Faridabad',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Repair in Faridabad | Mobitel',
    description: 'Affordable & fast smartphone repair in Faridabad. Screen, battery & more. Book now!',
    images: ['https://www.mobitel.in/banners/banner1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: 'verification-code',
  },
};

export const viewport = {
  themeColor: "#800000",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  let cmsData = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/cms`, { next: { revalidate: 3600 } });
    if (res.ok) {
      cmsData = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch layout CMS data:", error.message);
  }

  const localBusinessSchema = generateLocalBusinessSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.mobitel.in" />
        <JsonLd data={localBusinessSchema} />
        <JsonLd data={webSiteSchema} />
      </head>
      <body className={`${poppins.variable} font-sans transition-colors duration-500`} suppressHydrationWarning>
        <div className="min-h-screen bg-surface flex flex-col">
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}