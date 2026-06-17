import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.d4community.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/studio"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}