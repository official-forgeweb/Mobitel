export const metadata = {
  title: "Track Your Repair | Mobitel Phone Services",
  description: "Live track your mobile phone repair status. Enter your tracking token to view the real-time stage, technician notes, and precise pickup time estimates.",
  alternates: {
    canonical: 'https://www.mobitel.in/track-repair',
  },
  openGraph: {
    title: "Track Your Repair | Mobitel Phone Services",
    description: "Live track your mobile phone repair status. Enter your tracking token to view the real-time stage, technician notes, and precise pickup time estimates.",
    url: 'https://www.mobitel.in/track-repair',
    images: [{ url: 'https://www.mobitel.in/banners/banner4.png' }]
  }
};

export default function TrackRepairLayout({ children }) {
  return <>{children}</>;
}
