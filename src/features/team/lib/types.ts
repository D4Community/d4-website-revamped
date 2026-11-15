import type { SanityImageSource } from "@sanity/image-url";

/**
 * Mirrors the Sanity `teamMember` document schema (`src/sanity/schemaTypes/teamMemberType.ts`).
 *
 * `group` matches the radio choices in the schema and maps 1:1 to the
 * team-page sections:
 *   - "organizer"    → CoOrganizers (Primary)
 *   - "co-organizer" → CoOrganizers (Secondary / Co-Organizers)
 *   - "leads"        → Leads
 *   - "core"         → CoreTeam
 *   - "volunteer"    → Volunteers
 *   - "campus"       → that campus's grid
 *
 * A `leads` member with `campus` set is also that campus's header.
 */
export type TeamMemberGroup =
  | "organizer"
  | "co-organizer"
  | "leads"
  | "core"
  | "volunteer"
  | "campus";

export interface CampusRef {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  group: TeamMemberGroup;
  campus?: CampusRef | null;
  description?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  medium?: string;
  portfolio?: string;
  website?: string;
  instagram?: string;
  roleCategory?: string;
  /** Resolved by the GROQ projection — passes straight into `urlFor()`. */
  image?: SanityImageSource;
  /** `slug.current` resolved into a flat field. */
  slug?: string;
  orderRank?: number;
  isActive?: boolean;
}

export interface CampusTeam {
  campus: CampusRef;
  leads: TeamMember[];
  members: TeamMember[];
}

export interface TeamMembersBySection {
  organizers: TeamMember[];
  coOrganizers: TeamMember[];
  leads: TeamMember[];
  core: TeamMember[];
  volunteers: TeamMember[];
  campuses: CampusTeam[];
}