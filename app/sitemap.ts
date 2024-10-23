import { MetadataRoute } from "next";

const webSiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

export default (): MetadataRoute.Sitemap => [
  {
    url: webSiteUrl,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 1,
  },
  {
    url: `${webSiteUrl}/main`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${webSiteUrl}/blogs`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  },
];
