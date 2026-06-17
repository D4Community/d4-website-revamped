// import { MetadataRoute } from "next";
// import { client } from "@/sanity/lib/client";

// // Enforce consistency. Changed default fallback to 'www' based on your Search Console
// const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.d4community.com";

// /**
//  * We use 'revalidate' to ensure Next.js knows how to cache and refresh this route.
//  */
// export const revalidate = 3600; // Revalidate every hour

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   // --- Static Routes ---
//   const staticPages: MetadataRoute.Sitemap = [
//     { url: BASE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: "daily" },
//     { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
//     { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
//     { url: `${BASE_URL}/code-of-conduct`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
//     { url: `${BASE_URL}/events`, lastModified: new Date(), priority: 0.8, changeFrequency: "daily" },
//     { url: `${BASE_URL}/team`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
//     { url: `${BASE_URL}/terms`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
//     { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
//     { url: `${BASE_URL}/join`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
//     { url: `${BASE_URL}/gallery`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
//     { url: `${BASE_URL}/twitter-reviews`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
//     { url: `${BASE_URL}/reviews`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
//   ];

//   try {
//     // Fetch dynamic slugs from Sanity
//     // useCdn: false ensures fresh data during on-demand or periodic revalidation builds
//     const dynamicData = await client.fetch<{ slug: string; type: string; updated: string }[]>(
//       `*[(_type == "event" || _type == "teamMember") && defined(slug.current)]{
//         "slug": slug.current,
//         "type": _type,
//         "updated": _updatedAt
//       }`,
//       {},
//       { next: { revalidate: 3600 } } 
//     );

//     const dynamicRoutes: MetadataRoute.Sitemap = (dynamicData || []).map((item) => {
//       const prefix = item.type === "event" ? "events" : "team";
//       return {
//         url: `${BASE_URL}/${prefix}/${item.slug}`,
//         lastModified: new Date(item.updated),
//         changeFrequency: "weekly",
//         priority: 0.7,
//       };
//     });

//     return [...staticPages, ...dynamicRoutes];

//   } catch (error) {
//     // Fallback: If Sanity fails, the build still succeeds with static pages
//     console.error("CRITICAL: Sitemap dynamic fetch failed:", error);
//     return staticPages;
//   }
// }











import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.d4community.com";

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastUpdated = new Date("2026-06-17");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: lastUpdated,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/code-of-conduct`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: lastUpdated,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/team`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/join`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/twitter-reviews`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const dynamicData = await client.fetch<
      {
        slug: string;
        type: string;
        updated: string;
      }[]
    >(
      `*[
        (_type == "event" || _type == "teamMember")
        && defined(slug.current)
      ]{
        "slug": slug.current,
        "type": _type,
        "updated": _updatedAt
      }`
    );

    const dynamicPages: MetadataRoute.Sitemap = dynamicData.map((item) => {
      const prefix = item.type === "event" ? "events" : "team";

      return {
        url: `${BASE_URL}/${prefix}/${item.slug}`,
        lastModified: new Date(item.updated),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error("Sitemap generation error:", error);

    return staticPages;
  }
}