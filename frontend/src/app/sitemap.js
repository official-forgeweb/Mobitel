import { ISSUES_DATA } from "@/data/issuesData";

export default async function sitemap() {
  const baseUrl = "https://www.mobitel.in";

  // Static Pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mobile-repair-in-faridabad`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Dynamic Service Issue Pages
  const issuePages = Object.keys(ISSUES_DATA).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...issuePages];
}
