const REVALIDATE = 300;
const TZ = "Asia/Kolkata";

export type UpcomingEvent = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  rawStartDate?: string;
  rawEndDate?: string;
  location: string;
  startTime?: string;
  endTime?: string;
  participants?: number;
  eventType?: string;
  registrationLink?: string;
  learnMoreLink?: string;
  slug?: string;
  komunitySlug?: string;
  dataFormEntityId?: number;
};

export type PastEvent = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "Hackathon" | "Meetup" | "Workshop" | "Event";
  mode: "In-Person" | "Virtual";
  date?: string;
  rawDate?: string;
  location?: string;
  externalUrl?: string;
};

type FormGroup = {
  registration_type?: { name?: string };
  name?: string;
  data_form_entity_id?: number;
};

type CommudleEvent = {
  id: number;
  name?: string;
  tagline?: string;
  description?: string;
  header_image_path?: string;
  start_time?: string;
  end_time?: string;
  event_type?: string;
  slug?: string;
  kommunity_slug?: string;
  interested_members_count?: number;
  data_form_entity_id?: number;
  event_locations?: { name?: string }[];
  event_data_form_entity_groups?: FormGroup[];
  data_form_entity_groups?: FormGroup[];
};

const ENTITIES: Record<string, string> = {
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&lsquo;": "'",
  "&raquo;": "'",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
};

function decodeHtml(text: string): string {
  return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => {
    if (match.startsWith("&#x")) return String.fromCharCode(parseInt(match.slice(3, -1), 16));
    if (match.startsWith("&#")) return String.fromCharCode(parseInt(match.slice(2, -1), 10));
    return ENTITIES[match] || match;
  });
}

function plainText(html: string): string {
  return decodeHtml(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseDescription(raw?: string): string {
  if (!raw) return "Join us for an exciting community event.";
  const text = plainText(raw);
  const para = text.split(/[\n\r]+/).find((l) => l.trim().length > 20)?.trim() || text;
  if (para.length <= 180) return para;
  const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).length <= 180) out += s;
    else break;
  }
  return out || para.slice(0, 180) + "…";
}

function longDate(iso?: string) {
  if (!iso) return "Coming Soon";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Coming Soon";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TZ,
  });
}

function shortDate(iso?: string) {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ });
}

function clock(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
}

function formId(item: CommudleEvent): number | undefined {
  if (item.data_form_entity_id) return item.data_form_entity_id;
  const groups = item.event_data_form_entity_groups || item.data_form_entity_groups || [];
  const attendee = groups.find(
    (g) => g.registration_type?.name === "attendee" || g.name?.toLowerCase().includes("attendee"),
  );
  return attendee?.data_form_entity_id || groups.find((g) => g.data_form_entity_id)?.data_form_entity_id;
}

function registrationLink(item: CommudleEvent, id?: number): string {
  if (id) return `https://www.commudle.com/fill-form/${id}`;
  if (item.description) {
    const match = decodeHtml(item.description).match(
      /https?:\/\/[^\s"'<>]*(?:register|signup|sign-up|form|apply|devfolio)[^\s"'>]*/i,
    );
    if (match) return match[0];
  }
  if (item.slug) return `https://commudle.com/communities/d4-community/events/${item.slug}`;
  return "";
}

function learnMoreLink(item: CommudleEvent): string {
  if (item.slug) return `https://commudle.com/communities/d4-community/events/${item.slug}/#details`;
  if (!item.description) return "";
  const links = [...decodeHtml(item.description).matchAll(/https?:\/\/[^\s"'<>]+/g)].map((m) => m[0]);
  return links.find((l) => !/register|signup|apply|fill-form/i.test(l)) || "";
}

function mapUpcoming(item: CommudleEvent): UpcomingEvent {
  const id = formId(item);
  return {
    id: item.id,
    title: decodeHtml(item.name || "Untitled Event"),
    description: parseDescription(item.description),
    imageUrl: item.header_image_path || "",
    date: longDate(item.start_time),
    rawStartDate: item.start_time,
    rawEndDate: item.end_time,
    location: item.event_locations?.[0]?.name || "Location TBD",
    startTime: clock(item.start_time),
    endTime: clock(item.end_time),
    participants: item.interested_members_count || undefined,
    eventType: item.event_type || "online",
    slug: item.slug,
    komunitySlug: item.kommunity_slug,
    dataFormEntityId: id,
    registrationLink: registrationLink(item, id),
    learnMoreLink: learnMoreLink(item),
  };
}

async function readJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, { ...init, next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  try {
    const data = (await readJson(
      "https://json.commudle.com/api/v2/events/public/index_by_community?when=future&community_id=455",
    )) as { data?: { values?: CommudleEvent[] } };
    return (data.data?.values ?? []).map(mapUpcoming);
  } catch (error) {
    console.error("Failed to load upcoming events", error);
    return [];
  }
}

const DEVFOLIO = [
  "https://innosprint.devfolio.co/_next/data/ff9W3m0EDh9C-2EzENT45/hackathon3/innosprint.devfolio.co/overview.json",
  "https://hacknwin.devfolio.co/_next/data/ff9W3m0EDh9C-2EzENT45/hackathon3/hacknwin.devfolio.co/overview.json",
  "https://hacknwin-2-0.devfolio.co/_next/data/ff9W3m0EDh9C-2EzENT45/hackathon3/hacknwin-2-0.devfolio.co/overview.json",
  "https://hacknwin-3.devfolio.co/_next/data/ff9W3m0EDh9C-2EzENT45/hackathon3/hacknwin-3.devfolio.co/overview.json",
];

const LUMA =
  "https://api2.luma.com/user/profile/events-hosting?pagination_limit=10&period=past&user_api_id=usr-zPnx2wwYuPhns3S";

export async function getPastEvents(): Promise<PastEvent[]> {
  const [commudle, devfolio, luma] = await Promise.allSettled([
    readJson(
      "https://json.commudle.com/api/v2/events/public/index_by_community?when=past&community_id=455&page=1&count=9",
    ),
    Promise.all(DEVFOLIO.map((url) => readJson(url).catch(() => null))),
    readJson(LUMA, {
      headers: {
        accept: "*/*",
        origin: "https://luma.com",
        referer: "https://luma.com/",
        "x-luma-client-type": "luma-web",
        "user-agent": "Mozilla/5.0",
      },
    }),
  ]);

  const items: PastEvent[] = [];

  if (commudle.status === "fulfilled") {
    const values = ((commudle.value as { data?: { values?: CommudleEvent[] } }).data?.values ?? []);
    for (const item of values) {
      items.push({
        id: `c-${item.id}`,
        title: item.name || "Untitled Session",
        description: item.tagline || "",
        imageUrl: item.header_image_path || "/placeholder.png",
        category: "Meetup",
        mode: item.event_type === "online" ? "Virtual" : "In-Person",
        rawDate: item.start_time,
        date: shortDate(item.start_time),
        location: item.event_locations?.[0]?.name || "Online",
        externalUrl: "https://www.commudle.com/communities/d4-community/events",
      });
    }
  }

  if (devfolio.status === "fulfilled") {
    for (const payload of devfolio.value) {
      const hackathon = (payload as { pageProps?: { hackathon?: Record<string, string | boolean | null> } } | null)
        ?.pageProps?.hackathon;
      if (!hackathon) continue;
      const location = String(hackathon.location || "Remote");
      const starts = typeof hackathon.starts_at === "string" ? hackathon.starts_at : undefined;
      items.push({
        id: `d-${hackathon.uuid || hackathon.slug}`,
        title: String(hackathon.name || "Hackathon"),
        description: String(hackathon.tagline || "Build the future"),
        imageUrl: String(hackathon.cover_img || "/placeholder.png"),
        category: "Hackathon",
        mode: location.toLowerCase().includes("online") ? "Virtual" : "In-Person",
        rawDate: starts,
        date: shortDate(starts),
        location,
      });
    }
  }

  if (luma.status === "fulfilled") {
    const data = luma.value as { entries?: unknown[]; data?: { entries?: unknown[] } };
    const entries = data.entries ?? data.data?.entries ?? [];
    for (const entry of entries) {
      const ev = ((entry as { event?: Record<string, unknown> }).event ?? entry) as Record<string, unknown>;
      const geo = ev.geo_address_info as { city_state?: string; address?: string } | undefined;
      const isVirtual = !geo?.city_state || ev.zoom_meeting_url || ev.meeting_url;
      const start = typeof ev.start_at === "string" ? ev.start_at : undefined;
      items.push({
        id: `l-${String(ev.api_id ?? ev.id)}`,
        title: String(ev.name || "Luma Event"),
        description: String(ev.description || ev.summary || ""),
        imageUrl: String(ev.cover_url || ev.image_url || "/placeholder.png"),
        category: "Event",
        mode: isVirtual ? "Virtual" : "In-Person",
        rawDate: start,
        date: shortDate(start),
        location: geo?.city_state || geo?.address || "Online",
        externalUrl: ev.url ? `https://lu.ma/${ev.url}` : "https://lu.ma/user/usr-zPnx2wwYuPhns3S",
      });
    }
  }

  const epoch = (value?: string) => {
    const ms = Date.parse(value || "");
    return Number.isNaN(ms) ? 0 : ms;
  };
  items.sort((a, b) => epoch(b.rawDate) - epoch(a.rawDate));
  return items.slice(0, 20);
}
