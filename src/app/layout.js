import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import QuickActions from "@/components/QuickActions";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = { title: "Mobitel - Your Trusted Mobile Repair Partner", description: "Fast, reliable, and affordable mobile repairs with 90-day warranty." };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <div className="min-h-screen bg-surface flex flex-col">
          <Navbar />
          <QuickActions />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}