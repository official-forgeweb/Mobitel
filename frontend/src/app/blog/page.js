import Link from "next/link";
import { LOCATION } from "@/lib/seo-config";
import { generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

export const metadata = {
  title: `Phone Repair Blog — Tips, Guides & News | Mobitel ${LOCATION.city}`,
  description: `Expert tips on mobile phone care, repair guides, cost comparisons, and latest smartphone repair news. By Mobitel ${LOCATION.city} repair experts.`,
  alternates: { canonical: 'https://www.mobitel.in/blog' },
  openGraph: {
    title: `Phone Repair Blog | Mobitel ${LOCATION.city}`,
    description: `Expert tips on mobile phone care, repair guides, and smartphone news.`,
    url: 'https://www.mobitel.in/blog',
  },
};

export const revalidate = 60;

async function getBlogPosts(page = 1) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/blog?page=${page}&limit=12`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return { posts: [], pagination: { page: 1, pages: 1, total: 0 } };
  }
}

export default async function BlogPage() {
  const data = await getBlogPosts();
  const { posts, pagination } = data;

  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "Blog", url: "https://www.mobitel.in/blog" },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium">Blog</li>
        </ol>
      </nav>

      <section className="relative pt-8 pb-16 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-semibold text-dark mb-6 tracking-tight">Mobile Repair Tips, Guides & News</h1>
          <p className="text-body text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Expert advice from the Mobitel {LOCATION.city} repair team. Learn how to protect your phone, save money on repairs, and make informed decisions.
          </p>
        </div>
      </section>

      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id || post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  {post.featured_image && (
                    <div className="aspect-video bg-surface overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.featured_image_alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3">{post.category}</span>
                    )}
                    <h2 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-body line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{post.author_name || 'Mobitel Team'}</span>
                      <span className="flex items-center gap-2">
                        {post.read_time_minutes && <span>{post.read_time_minutes} min read</span>}
                        {post.published_at && (
                          <span>{new Date(post.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-dark mb-2">Blog Coming Soon</h2>
              <p className="text-body">We're working on expert guides and tips for phone repair. Check back soon!</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    p === pagination.page ? 'bg-primary text-white' : 'bg-surface text-dark hover:bg-primary/10'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface border-t border-border relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-dark mb-4">Need Phone Repair in {LOCATION.city}?</h2>
          <p className="text-body mb-6 font-light">Expert technicians, genuine parts, 90-day warranty. Book now.</p>
          <a href="/#brand-grid" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors shadow-md inline-block">
            Book Repair Now
          </a>
        </div>
      </section>
    </div>
  );
}
