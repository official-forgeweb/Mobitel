export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/worker/'],
    },
    sitemap: 'https://www.mobitel.in/sitemap.xml',
  }
}
