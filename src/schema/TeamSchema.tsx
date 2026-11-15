import { getTeamMembers, memberImageUrl } from "@/features/team/lib/queries";
import type { TeamMember } from "@/features/team/lib/types";

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isUsableUrl = (url?: string): url is string =>
  Boolean(url && url !== "#" && url !== "/");

const getSocialLinks = (member: TeamMember): string[] => {
  const links = [
    member.linkedin,
    member.twitter,
    member.github,
    member.medium,
    member.portfolio,
    member.website,
  ];
  return links.filter(isUsableUrl);
};

export default async function TeamSchema() {
  const {
    organizers = [],
    leads = [],
    core = [],
    volunteers = [],
    campuses = [],
  } = await getTeamMembers();

  const allMembers = [
    ...organizers.map((m) => ({ ...m, roleCategory: "Organizer" })),
    ...leads.map((m) => ({ ...m, roleCategory: "Team Lead" })),
    ...core.map((m) => ({ ...m, roleCategory: "Core Team Member" })),
    ...volunteers.map((m) => ({ ...m, roleCategory: "Volunteer" })),
    ...campuses.flatMap((campus) =>
      campus.members.map((member) => ({
        ...member,
        roleCategory: member.designation,
      })),
    ),
  ];

  const personEntities = allMembers.map((member) => {
    const slug = slugify(member.name);
    const profileUrl = `https://www.d4community.com/team#${slug}`;
    const rawImage = member.image
      ? memberImageUrl(member.image, 600, 600)
      : undefined;

    return {
      "@type": "Person",
      "@id": profileUrl,
      name: member.name,
      url: profileUrl,
      ...(rawImage ? { image: rawImage } : {}),
      jobTitle: member.campus?.name
        ? `${member.designation || member.roleCategory}, ${member.campus.name}`
        : member.designation || member.roleCategory,
      ...(member.description ? { description: member.description } : {}),
      worksFor: {
        "@type": "Organization",
        "@id": "https://www.d4community.com/#organization",
        name: "D4 Community",
        url: "https://www.d4community.com",
      },
      memberOf: {
        "@type": "Organization",
        "@id": "https://www.d4community.com/#organization",
        name: "D4 Community",
      },
      sameAs: getSocialLinks(member),
      knowsAbout: [
        "Software Engineering",
        "Developer Community",
        "Open Source",
        "Artificial Intelligence",
        "Web Development",
      ],
    };
  });

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://www.d4community.com/team/#webpage",
        url: "https://www.d4community.com/team",
        name: "D4 Community Team & Leadership",
        description:
          "Official team directory of organizers, leads, core members, and volunteers powering D4 Community.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://www.d4community.com/#website",
          name: "D4 Community",
          url: "https://www.d4community.com",
        },
        about: {
          "@id": "https://www.d4community.com/#organization",
        },
      },
      ...personEntities,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
    />
  );
}