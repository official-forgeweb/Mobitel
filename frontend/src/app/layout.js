import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

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
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}