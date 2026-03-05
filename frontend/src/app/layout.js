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
  let cmsData = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/cms`, { next: { revalidate: 60 } });
    if (res.ok) {
      cmsData = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch layout CMS data:", error.message);
  }

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