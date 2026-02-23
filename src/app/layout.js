import "./globals.css";
export const metadata = { title: "Mobitel - Your Trusted Mobile Repair Partner", description: "Fast, reliable, and affordable mobile repairs with 90-day warranty." };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}