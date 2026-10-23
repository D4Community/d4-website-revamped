import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import type { TeamMember, TeamMembersBySection } from "./types";

/**
 * Safely build a Sanity image URL for a member. Returns `null` when the
 * member has no image field at all, or has an image field with no asset
 * uploaded yet — both of which produce `{ asset: null }` from the GROQ
 * projection and would crash `urlFor()` reading `._ref`.
 */
export function memberImageUrl(
  image: TeamMember["image"] | SanityImageSource | undefined,
  width: number,
  height?: number,
): string | null {
  if (!image || typeof image !== "object") return null;
  const asset = (image as { asset?: unknown }).asset;
  if (!asset) return null;
  let builder = urlFor(image as SanityImageSource).width(width).auto('format').fit('crop');
  if (typeof height === "number") builder = builder.height(height);
  return builder.url();
}

/**
 * Fetches every active team member once, then reduces the flat array into the
 * four buckets consumed by the team-page sections.
 *
 * Sorted by `orderRank asc, name asc` so editors can pin a person to a slot
 * (e.g. organizer 1 / organizer 2) by tweaking the orderRank field in the
 * teamMember document.
 */
export async function getTeamMembers(): Promise<TeamMembersBySection> {
  const empty: TeamMembersBySection = {
    organizers: [],
    coOrganizers: [],
    leads: [],
    core: [],
    volunteers: [],
  };

  try {
    const all = await client.fetch<TeamMember[]>(
      `*[_type == "teamMember" && isActive == true] | order(orderRank asc, name asc) {
        _id,
        name,
        designation,
        group,
        description,
        email,
        linkedin,
        github,
        twitter,
        medium,
        portfolio,
        website,
        instagram,
        image{ asset->{_id, url}, hotspot, alt },
        "slug": slug.current,
        orderRank,
        isActive
      }`,
      {},
      { next: { revalidate: 3600 } },
    );

    return all.reduce<TeamMembersBySection>(
      (acc, member) => {
        const group = member.group?.toLowerCase();
        switch (group) {
          case "organizer":
            acc.organizers.push(member);
            break;
          case "co-organizer":
          case "coorganizer":
          case "co_organizer":
            acc.coOrganizers.push(member);
            break;
          case "leads":
          case "lead":
            acc.leads.push(member);
            break;
          case "core":
            acc.core.push(member);
            break;
          case "volunteer":
          case "volunteers":
            acc.volunteers.push(member);
            break;
        }
        return acc;
      },
      { organizers: [], coOrganizers: [], leads: [], core: [], volunteers: [] },
    );
  } catch (error) {
    console.error("Failed to fetch team members from Sanity:", error);
    return empty;
  }
}