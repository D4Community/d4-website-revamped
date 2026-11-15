import type { CampusRef, CampusTeam, TeamMember } from "./types";

/**
 * Members must already be ordered by orderRank, then name.
 *
 * Central groups are ignored. A lead with a campus reference is included with
 * that campus, and group `campus` fills the same grid. A campus with neither is dropped.
 */
export function groupCampuses(campuses: CampusRef[], members: TeamMember[]): CampusTeam[] {
  const buckets = new Map<string, { campus: CampusRef; leads: TeamMember[]; members: TeamMember[] }>();

  for (const campus of campuses) {
    if (!campus.slug) continue;
    buckets.set(campus._id, { campus, leads: [], members: [] });
  }

  for (const member of members) {
    const campusId = member.campus?._id;
    if (!campusId) continue;
    const bucket = buckets.get(campusId);
    if (!bucket) continue;

    const group = member.group?.toLowerCase();
    if (group === "leads" || group === "lead") {
      bucket.leads.push(member);
      continue;
    }
    if (group === "campus") bucket.members.push(member);
  }

  return campuses.flatMap((campus) => {
    const bucket = buckets.get(campus._id);
    if (!bucket || (bucket.leads.length === 0 && bucket.members.length === 0)) return [];
    return [{ campus: bucket.campus, leads: bucket.leads, members: bucket.members }];
  });
}

function demo() {
  const campus: CampusRef = { _id: "c1", name: "North", slug: "north" };
  const lead: TeamMember = {
    _id: "l",
    name: "Ada",
    designation: "Campus Lead",
    group: "leads",
    campus,
    orderRank: 0,
  };
  const design: TeamMember = {
    _id: "d",
    name: "Cy",
    designation: "Design",
    group: "campus",
    campus,
    orderRank: 1,
  };
  const tech: TeamMember = {
    _id: "t",
    name: "Bea",
    designation: "Tech Lead",
    group: "campus",
    campus,
    orderRank: 2,
  };
  const core: TeamMember = {
    _id: "x",
    name: "Dee",
    designation: "Core",
    group: "core",
    campus,
    orderRank: 0,
  };

  const result = groupCampuses([campus], [lead, design, tech, core]);
  console.assert(result.length === 1, "campus with a lead is kept");
  console.assert(result[0]?.leads[0]?._id === "l", "lead stays with the campus");
  console.assert(result[0]?.members.map((member) => member._id).join() === "d,t", "one member list");
  console.assert(groupCampuses([campus], [core]).length === 0, "central members stay out");
  console.assert(
    groupCampuses([{ _id: "c2", name: "Empty", slug: "empty" }], []).length === 0,
    "empty campus is skipped",
  );
}

const entry =
  typeof process !== "undefined" ? process.argv[1]?.replaceAll("\\", "/") : undefined;
if (entry?.endsWith("/groupCampuses.ts")) demo();
