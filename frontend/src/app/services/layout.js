export const metadata = {
  title: "Professional Mobile Repair Services | Mobitel",
  description: "Browse our comprehensive list of mobile repair services including screen replacements, battery issues, water damage repair, and motherboard-level micro-soldering.",
  alternates: {
    canonical: 'https://www.mobitel.in/services',
  },
  openGraph: {
    title: "Professional Mobile Repair Services | Mobitel",
    description: "Browse our comprehensive list of mobile repair services including screen replacements, battery issues, water damage repair, and motherboard soldering.",
    url: 'https://www.mobitel.in/services',
    images: [{ url: 'https://www.mobitel.in/banners/banner3.png' }]
  }
};

export default function ServicesLayout({ children }) {
  return <>{children}</>;
}
