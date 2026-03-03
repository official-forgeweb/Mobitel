import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = { title: "Mobitel - Your Trusted Mobile Repair Partner", description: "Fast, reliable, and affordable mobile repairs with 90-day warranty." };

export default async function RootLayout({ children }) {
  // Fetch CMS data for the layout, using 127.0.0.1 as fallback for API URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/cms`, { cache: 'no-store' });
  const cmsData = await res.json(); // Assuming you want to use this data somewhere

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`} suppressHydrationWarning>
        <div className="min-h-screen bg-surface flex flex-col">
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}