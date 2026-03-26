import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = { 
  metadataBase: new URL('https://www.mobitel.in'),
  title: "Mobitel - Your Trusted Mobile Repair Partner", 
  description: "Fast, reliable, and affordable mobile phone repairs at your doorstep or in-store. We fix screens, batteries, cameras & more with a 90-day warranty.",
  keywords: ["mobile repair", "phone screen replacement", "battery replacement", "doorstep phone repair", "smartphone fix nearby", "iPhone repair", "Android repair", "Mobitel"],
  authors: [{ name: "Mobitel Team" }],
  creator: "Mobitel",
  publisher: "Mobitel Services",
  alternates: { canonical: '/' },
  openGraph: {
    title: "Mobitel - Expert Smartphone Repairs",
    description: "Book an instant phone repair service today. Genuine parts, expert technicians, and a 90-day warranty guaranteed.",
    url: 'https://www.mobitel.in',
    siteName: 'Mobitel',
    images: [
      {
        url: 'https://www.mobitel.in/banners/banner1.png',
        width: 1200,
        height: 630,
        alt: 'Mobitel Mobile Repair Service',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobitel Mobile Repairs',
    description: 'Affordable & fast smartphone repair at home or in the shop. Book now!',
    images: ['https://www.mobitel.in/banners/banner1.png'],
  },
};

export const viewport = {
  themeColor: "#2563eb",
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.mobitel.in" />
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