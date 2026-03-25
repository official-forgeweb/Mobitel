export default function sitemap() {
  const baseUrl = 'https://www.mobitel.in';

  const routes = [
    '',
    '/about',
    '/services',
    '/track-repair'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
