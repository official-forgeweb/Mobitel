import { SERVICE_LIST } from '@/lib/seo-config';

export default async function sitemap() {
  const baseUrl = 'https://www.mobitel.in';
  const now = new Date().toISOString();

  // ── Static Pages ──
  const staticPages = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/warranty`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/track-repair`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
  ];

  // ── Individual Service Pages ──
  const servicePages = SERVICE_LIST.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: service.startingPrice >= 1999 ? 0.7 : 0.9,
  }));

  // ── Location Pages ──
  const locationPages = [
    { url: `${baseUrl}/mobile-repair-in-faridabad`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  // ── Blog Pages ──
  let blogPages = [
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
  ];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/blog?published=true`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const posts = data.posts || data || [];
      const postPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at || post.published_at || now,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
      blogPages = [...blogPages, ...postPages];
    }
  } catch (error) {
    // Blog API not ready yet — continue with static pages
    console.log('Blog API not available for sitemap, using static pages only');
  }

  return [...staticPages, ...servicePages, ...locationPages, ...blogPages];
}
