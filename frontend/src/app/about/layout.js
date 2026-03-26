export const metadata = {
  title: "About Us | Mobitel Mobile Repair",
  description: "Learn more about Mobitel, your trusted destination for professional, high-quality mobile phone repairs using genuine OEM parts since 2014.",
  alternates: {
    canonical: 'https://www.mobitel.in/about',
  },
  openGraph: {
    title: "About Us | Mobitel Mobile Repair",
    description: "Learn more about Mobitel, your trusted destination for professional mobile phone repairs using genuine OEM parts since 2014.",
    url: 'https://www.mobitel.in/about',
    images: [{ url: 'https://www.mobitel.in/banners/banner2.png' }]
  }
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
