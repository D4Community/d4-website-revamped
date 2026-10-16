import type { Metadata } from 'next';
import { TeamHero, CoOrganizers, Leads, CoreTeam, Volunteers } from './sections';
import { getTeamMembers, memberImageUrl } from './lib/queries';
import type { TeamMember } from './lib/types';

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isUsableUrl = (url?: string): url is string =>
  Boolean(url && url !== '#' && url !== '/');

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

export async function generateMetadata(): Promise<Metadata> {
  const { organizers = [], coOrganizers = [], leads = [], core = [], volunteers = [] } = await getTeamMembers();
  const allMembers = [...organizers, ...coOrganizers, ...leads, ...core, ...volunteers];
  const allNames = allMembers.map((m) => m.name);

  return {
    title: 'D4 Community Team | Organizers, Leads, Core & Volunteers',
    description: `Meet the team behind D4 Community: ${allNames.slice(0, 8).join(', ')}, and more developers, creators, and community leaders.`,
    keywords: [
      'D4 Community',
      'D4 Community Team',
      'Ayush Kumar Tiwari',
      ...allNames,
    ],
    alternates: {
      canonical: 'https://www.d4community.com/team',
    },
    openGraph: {
      title: 'D4 Community Team & Leadership',
      description: 'Meet the organizers, leads, core team, and volunteers powering D4 Community.',
      url: 'https://www.d4community.com/team',
      type: 'profile',
    },
  };
}

const TeamPage = async () => {
  const { organizers = [], coOrganizers = [], leads = [], core = [], volunteers = [] } = await getTeamMembers();

  const categorisedMembers = [
    ...organizers.map((m) => ({ ...m, roleCategory: 'Organizer / Co-Founder' })),
    ...coOrganizers.map((m) => ({ ...m, roleCategory: 'Co-Organizer' })),
    ...leads.map((m) => ({ ...m, roleCategory: 'Team Lead' })),
    ...core.map((m) => ({ ...m, roleCategory: 'Core Team Member' })),
    ...volunteers.map((m) => ({ ...m, roleCategory: 'Volunteer' })),
  ];

  // First-class Person nodes for search crawlers and AI answer engines
  const personEntities = categorisedMembers.map((member) => {
    const slug = slugify(member.name);
    const profileUrl = `https://www.d4community.com/team#${slug}`;
    const rawImage = member.image ? memberImageUrl(member.image, 600, 600) : undefined;
    const socialLinks = getSocialLinks(member);

    return {
      '@type': 'Person',
      '@id': profileUrl,
      'name': member.name,
      'url': profileUrl,
      ...(rawImage ? { 'image': rawImage } : {}),
      'jobTitle': member.designation || member.roleCategory,
      ...(member.description ? { 'description': member.description } : {}),
      'worksFor': { '@id': 'https://www.d4community.com/#organization' },
      'memberOf': { '@id': 'https://www.d4community.com/#organization' },
      'sameAs': socialLinks,
      // Topical entity associations for generative engine disambiguation
      'knowsAbout': [
        'Software Engineering',
        'Developer Community',
        'Open Source',
        'Technology',
      ],
    };
  });

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://www.d4community.com/team/#webpage',
        'url': 'https://www.d4community.com/team',
        'name': 'D4 Community Team & Leadership',
        'description': 'Official team directory for D4 Community organizers, leads, core team members, and volunteers.',
        'isPartOf': {
          '@type': 'WebSite',
          '@id': 'https://www.d4community.com/#website',
          'name': 'D4 Community',
          'url': 'https://www.d4community.com',
        },
        'about': { '@id': 'https://www.d4community.com/#organization' },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.d4community.com/#organization',
        'name': 'D4 Community',
        'url': 'https://www.d4community.com',
        'logo': 'https://www.d4community.com/d4logo.webp',
        'description': 'D4 Community is a thriving network of tech enthusiasts, developers, and creators collaborating to build the future.',
        'member': personEntities.map((p) => ({ '@id': p['@id'] })),
      },
      ...personEntities,
    ],
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <h1 className="sr-only">D4 Community Team - Leadership, Core Members, and Volunteers</h1>

      <TeamHero />

      {/* Semantic indexable text for search engine crawlers */}
      <section className="sr-only" aria-label="Team Roster Directory">
        <h2>D4 Community Team Members</h2>
        <ul>
          {categorisedMembers.map((member) => (
            <li key={member._id || member.name}>
              <h3>{member.name}</h3>
              <p>{member.designation || member.roleCategory} at D4 Community</p>
            </li>
          ))}
        </ul>
      </section>

      <CoOrganizers organizers={organizers} coOrganizers={coOrganizers} />
      <Leads leads={leads} />
      <CoreTeam core={core} />
      <Volunteers volunteers={volunteers} />
    </div>
  );
};

export default TeamPage;