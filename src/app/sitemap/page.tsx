import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Sitemap | D4 Community",
  description: "Overview and directory of all pages, events, and team members within the D4 Community.",
};

interface SanityItem {
  slug: string;
  type: string;
  name?: string;
  title?: string;
}

export default async function HtmlSitemapPage() {
  // 1. Static Pages
  const mainPages = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Events Hub", href: "/events" },
    { name: "Our Team", href: "/team" },
    { name: "Join Community", href: "/join" },
    { name: "Gallery", href: "/gallery" },
  ];

  const reviewPages = [
    { name: "Reviews Overview", href: "/reviews" },
    { name: "Twitter Reviews", href: "/twitter-reviews" },
  ];

  const legalPages = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Code of Conduct", href: "/code-of-conduct" },
  ];

  // 2. Fetch Dynamic Data from Sanity
  let events: SanityItem[] = [];
  let teamMembers: SanityItem[] = [];

  try {
    const dynamicData = await client.fetch<SanityItem[]>(
      `*[(_type == "event" || _type == "teamMember") && defined(slug.current)]{
        "slug": slug.current,
        "type": _type,
        name,
        title
      }`,
      {},
      { next: { revalidate: 3600 } }
    );

    events = dynamicData.filter((item) => item.type === "event");
    teamMembers = dynamicData.filter((item) => item.type === "teamMember");
  } catch (error) {
    console.error("Failed to fetch dynamic items for HTML sitemap:", error);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:py-16">
      <div className="border-b border-gray-200 pb-5 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Sitemap
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Find your way around the D4 Community platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Section: Main Navigation */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-500 pl-3">
            Main Pages
          </h2>
          <ul className="space-y-2.5">
            {mainPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-blue-600 hover:underline dark:text-blue-400 transition">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Section: Reviews & Feedback */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-indigo-500 pl-3">
            Wall of Fame & Reviews
          </h2>
          <ul className="space-y-2.5">
            {reviewPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-blue-600 hover:underline dark:text-blue-400 transition">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Section: Legal & Policies */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-gray-500 pl-3">
            Legal & Compliance
          </h2>
          <ul className="space-y-2.5">
            {legalPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-blue-600 hover:underline dark:text-blue-400 transition">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Section: Dynamic Events */}
        {/* {events.length > 0 && (
          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-emerald-500 pl-3">
              Community Events ({events.length})
            </h2>
            <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {events.map((event) => (
                <li key={event.slug}>
                  <Link href={`/events/${event.slug}`} className="text-blue-600 hover:underline dark:text-blue-400 transition block truncate">
                    {event.title || event.name || event.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )} */}

        {/* Section: Dynamic Team Members */}
        {/* {teamMembers.length > 0 && (
          <div className="md:col-span-2 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-amber-500 pl-3">
              Our Core Team ({teamMembers.length})
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {teamMembers.map((member) => (
                <li key={member.slug} className="truncate">
                  <Link href={`/team/${member.slug}`} className="text-blue-600 hover:underline dark:text-blue-400 transition">
                    {member.name || member.title || member.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </main>
  );
}