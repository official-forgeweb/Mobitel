import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCATION, CONTACT } from "@/lib/seo-config";
import { generateBlogPostSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/schema-generator";

export const revalidate = 60;

async function getPost(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/blog/post/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.meta_title || `${post.title} | Mobitel ${LOCATION.city}`,
    description: post.meta_description || post.excerpt || post.title,
    alternates: { canonical: `https://www.mobitel.in/blog/${slug}` },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `https://www.mobitel.in/blog/${slug}`,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updatedAt,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const breadcrumbs = [
    { name: "Home", url: "https://www.mobitel.in" },
    { name: "Blog", url: "https://www.mobitel.in/blog" },
    { name: post.title, url: `https://www.mobitel.in/blog/${slug}` },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden selection:bg-primary/20">
      <JsonLd data={generateBlogPostSchema(post)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      {/* Breadcrumb */}
      <nav className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 w-full">
        <ol className="flex items-center gap-2 text-sm text-muted flex-wrap">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-dark font-medium truncate max-w-[200px]">{post.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full">
        <header className="mb-10">
          {post.category && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">{post.category}</span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-dark mb-6 tracking-tight leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted flex-wrap">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {post.author_name || 'Mobitel Team'}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {new Date(post.published_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {post.read_time_minutes && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.read_time_minutes} min read
              </span>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-border">
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none text-body font-light leading-relaxed
            prose-headings:text-dark prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:mb-4 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-dark prose-strong:font-semibold
            prose-ul:my-4 prose-li:my-1
            prose-img:rounded-xl prose-img:border prose-img:border-border"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Tags:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="bg-surface border border-border text-dark text-xs font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="mt-10 p-6 bg-surface rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-lg font-bold">
              {(post.author_name || 'M')[0]}
            </div>
            <div>
              <p className="font-semibold text-dark">{post.author_name || 'Mobitel Team'}</p>
              <p className="text-sm text-muted">Expert phone repair technicians at Mobitel {LOCATION.city}. Sharing tips and guides to help you take better care of your smartphones.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 p-8 bg-primary/5 rounded-2xl border border-primary/20 text-center">
          <h2 className="text-xl font-semibold text-dark mb-2">Need Phone Repair in {LOCATION.city}?</h2>
          <p className="text-body text-sm mb-4">Expert technicians, genuine parts, 90-day warranty. Book your repair now.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <a href="/#brand-grid" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium text-sm transition-colors shadow-md">
              Book Repair Now
            </a>
            <a href={`tel:${CONTACT.phone}`} className="text-primary font-medium text-sm hover:underline">
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-2">
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
