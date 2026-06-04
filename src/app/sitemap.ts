// import { MetadataRoute } from "next";

// // ─── Config ───────────────────────────────────────────────────────────────────
// const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type SitemapEntry = MetadataRoute.Sitemap[number];

// // ─── Static Routes ────────────────────────────────────────────────────────────
// const staticRoutes: SitemapEntry[] = [
//   {
//     url: BASE_URL,
//     lastModified: new Date(),
//     changeFrequency: "weekly",
//     priority: 1.0,
//   },
//   {
//     url: `${BASE_URL}/about`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.8,
//   },
//   {
//     url: `${BASE_URL}/contact`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.7,
//   },
//   {
//     url: `${BASE_URL}/events`,
//     lastModified: new Date(),
//     changeFrequency: "daily",
//     priority: 0.9,
//   },
//   {
//     url: `${BASE_URL}/team`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.7,
//   },
//   {
//     url: `${BASE_URL}/studio`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.6,
//   },
// ];

// // ─── Dynamic Routes (fetched from Sanity or any CMS/DB) ───────────────────────

// /**
//  * Fetch dynamic event slugs from Sanity.
//  * Replace the query/client import with your actual Sanity setup.
//  */
// async function getEventRoutes(): Promise<SitemapEntry[]> {
//   try {
//     // Example: import { client } from "@/sanity/lib/client";
//     // const events = await client.fetch<{ slug: string; _updatedAt: string }[]>(
//     //   `*[_type == "event"]{ "slug": slug.current, _updatedAt }`
//     // );
//     // return events.map((event) => ({
//     //   url: `${BASE_URL}/events/${event.slug}`,
//     //   lastModified: new Date(event._updatedAt),
//     //   changeFrequency: "weekly",
//     //   priority: 0.8,
//     // }));

//     return []; // Remove this line once Sanity client is wired up
//   } catch (error) {
//     console.error("[sitemap] Failed to fetch event routes:", error);
//     return [];
//   }
// }

// /**
//  * Fetch dynamic team member slugs from Sanity.
//  */
// async function getTeamRoutes(): Promise<SitemapEntry[]> {
//   try {
//     // Example:
//     // const members = await client.fetch<{ slug: string; _updatedAt: string }[]>(
//     //   `*[_type == "teamMember"]{ "slug": slug.current, _updatedAt }`
//     // );
//     // return members.map((member) => ({
//     //   url: `${BASE_URL}/team/${member.slug}`,
//     //   lastModified: new Date(member._updatedAt),
//     //   changeFrequency: "monthly",
//     //   priority: 0.6,
//     // }));

//     return []; // Remove this line once Sanity client is wired up
//   } catch (error) {
//     console.error("[sitemap] Failed to fetch team routes:", error);
//     return [];
//   }
// }

// // ─── Main Sitemap Export ───────────────────────────────────────────────────────
// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const [eventRoutes, teamRoutes] = await Promise.all([
//     getEventRoutes(),
//     getTeamRoutes(),
//   ]);

//   return [...staticRoutes, ...eventRoutes, ...teamRoutes];
// }




import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

// Enforce consistency. Changed default fallback to 'www' based on your Search Console
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.d4community.com";

/**
 * We use 'revalidate' to ensure Next.js knows how to cache and refresh this route.
 */
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Static Routes ---
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/code-of-conduct`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/events`, lastModified: new Date(), priority: 0.8, changeFrequency: "daily" },
    { url: `${BASE_URL}/team`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/join`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/twitter-reviews`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/reviews`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
  ];

  try {
    // Fetch dynamic slugs from Sanity
    // useCdn: false ensures fresh data during on-demand or periodic revalidation builds
    const dynamicData = await client.fetch<{ slug: string; type: string; updated: string }[]>(
      `*[(_type == "event" || _type == "teamMember") && defined(slug.current)]{
        "slug": slug.current,
        "type": _type,
        "updated": _updatedAt
      }`,
      {},
      { next: { revalidate: 3600 } } 
    );

    const dynamicRoutes: MetadataRoute.Sitemap = (dynamicData || []).map((item) => {
      const prefix = item.type === "event" ? "events" : "team";
      return {
        url: `${BASE_URL}/${prefix}/${item.slug}`,
        lastModified: new Date(item.updated),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    return [...staticPages, ...dynamicRoutes];

  } catch (error) {
    // Fallback: If Sanity fails, the build still succeeds with static pages
    console.error("CRITICAL: Sitemap dynamic fetch failed:", error);
    return staticPages;
  }
}