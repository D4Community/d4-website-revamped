import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { groupCampuses } from "./groupCampuses";
import type { CampusRef, TeamMember, TeamMembersBySection } from "./types";

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
 * Fetches active campuses and team members once, then splits members into the
 * central sections plus one stacked block per campus.
 *
 * Sorted by `orderRank asc, name asc` so editors can pin a person to a slot
 * (e.g. organizer 1 / organizer 2) by tweaking the orderRank field in the
 * teamMember document.
 */
interface TeamQueryResult {
  campuses: CampusRef[];
  members: TeamMember[];
}

const emptyTeam = (): TeamMembersBySection => ({
  organizers: [],
  coOrganizers: [],
  leads: [],
  core: [],
  volunteers: [],
  campuses: [],
});

export async function getTeamMembers(): Promise<TeamMembersBySection> {
  try {
    const { campuses, members } = await client.fetch<TeamQueryResult>(
      `{
        "campuses": *[_type == "campus" && isActive == true] | order(orderRank asc, name asc) {
          _id,
          name,
          description,
          "slug": slug.current
        },
        "members": *[_type == "teamMember" && isActive == true] | order(orderRank asc, name asc) {
          _id,
          name,
          designation,
          group,
          campus->{ _id, name, "slug": slug.current },
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
        }
      }`,
      {},
      { next: { revalidate: 3600 } },
    );

    const sections = (members ?? []).reduce<TeamMembersBySection>((acc, member) => {
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
        default:
          break;
      }
      return acc;
    }, emptyTeam());

    sections.campuses = groupCampuses(campuses ?? [], members ?? []);
    return sections;
  } catch (error) {
    console.error("Failed to fetch team members from Sanity:", error);
    return emptyTeam();
  }
}