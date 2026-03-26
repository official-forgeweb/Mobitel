export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/worker/', '/track-repair/', '/booking/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/banners/', '/services/', '/blog/'],
      },
    ],
    sitemap: 'https://www.mobitel.in/sitemap.xml',
    host: 'https://www.mobitel.in',
  };
}
