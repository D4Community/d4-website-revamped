"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  startTime?: string;
  endTime?: string;
  participants?: number;
  eventType?: string;
  registrationLink?: string;
  learnMoreLink?: string;
  slug?: string;
  komunitySlug?: string;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_KEY = "upe_v2";
const CACHE_TTL = 5 * 60 * 1000;

function readCache(): Event[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return Date.now() - ts < CACHE_TTL ? data : null;
  } catch {
    return null;
  }
}
function writeCache(data: Event[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };
  
  return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => {
    if (match.startsWith('&#x')) {
      const code = parseInt(match.slice(3, -1), 16);
      return String.fromCharCode(code);
    } else if (match.startsWith('&#')) {
      const code = parseInt(match.slice(2, -1), 10);
      return String.fromCharCode(code);
    }
    return entities[match] || match;
  });
}

function stripHtml(html: string): string {
  let text = decodeHtmlEntities(html);
  text = text.replace(/<[^>]*>/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function parseDescription(raw?: string): string {
  if (!raw) return "Join us for an exciting community event.";
  const text = stripHtml(raw);
  const lines = text.split(/[\n\r]+/).filter((l) => l.trim().length > 20);
  const para = lines[0]?.trim() || text;
  if (para.length <= 180) return para;
  const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).length <= 180) out += s;
    else break;
  }
  return out || para.slice(0, 180) + "…";
}

function fmtDate(iso?: string) {
  if (!iso) return "Coming Soon";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(iso?: string) {
  if (!iso) return undefined;
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRegistrationLink(event: any): string {
  if (event.description) {
    const decodedDesc = decodeHtmlEntities(event.description);
    const regMatch = decodedDesc.match(/https?:\/\/[^\s"'<>]*(?:register|signup|sign-up|form|apply|devfolio)[^\s"'<>]*/i);
    if (regMatch) return regMatch[0];
  }
  
  if (event.slug) {
    return `https://commudle.com/events/${event.slug}/register`;
  }
  
  return "";
}

function getLearnMoreLink(event: any): string {
  if (event.description) {
    const decodedDesc = decodeHtmlEntities(event.description);
    const allLinks = [...decodedDesc.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((m) => m[0]);
    const regLink = getRegistrationLink(event);
    const learnLink = allLinks.find((l) => l !== regLink && !/register|signup|apply/i.test(l));
    if (learnLink) return learnLink;
  }
  
  if (event.slug) {
    return `https://commudle.com/events/${event.slug}`;
  }
  
  return "";
}

// ─── Fallback SVG ─────────────────────────────────────────────────────────────

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' fill='%239ca3af'%3EEvent Image%3C/text%3E%3C/svg%3E";

// ─── EventImage ───────────────────────────────────────────────────────────────

function EventImage({ src, alt, id }: { src: string; alt: string; id: number }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    setImgSrc(src || FALLBACK);
  }, [src, id]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-900">
      {!ready && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-xl" />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={imgSrc}
            alt={alt}
            width={900}
            height={600}
            className="w-full h-auto object-contain"
            onLoad={() => setReady(true)}
            onError={() => {
              setImgSrc(FALLBACK);
              setReady(true);
            }}
            draggable={false}
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ duration, id }: { duration: number; id: number }) {
  return (
    <div className="h-[2px] w-full bg-gray-200 dark:bg-white/[0.07] rounded-full overflow-hidden">
      <motion.div
        key={id}
        className="h-full bg-[#fd7d6e] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-2xl">
      <div className="grid md:grid-cols-[1fr_400px]">
        <div className="p-6 bg-gray-50 dark:bg-black/20 animate-pulse">
          <div className="w-full aspect-video rounded-xl bg-gray-200 dark:bg-neutral-800" />
        </div>
        <div className="p-8 flex flex-col gap-4 animate-pulse">
          <div className="h-3 w-20 rounded-full bg-gray-200 dark:bg-neutral-800" />
          <div className="h-7 w-3/4 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="mt-auto h-11 w-full rounded-xl bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

// ─── Empty ────────────────────────────────────────────────────────────────────

function Empty() {
  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-white/[0.06] px-8 py-20 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 flex items-center justify-center">
        <Calendar className="w-6 h-6 text-gray-400 dark:text-white/30" />
      </div>
      <p className="text-gray-500 dark:text-white/40 text-sm font-semibold tracking-wide">
        No events scheduled right now
      </p>
      <p className="text-gray-400 dark:text-white/25 text-xs max-w-xs">
        We're cooking something special. Stay tuned.
      </p>
    </div>
  );
}

// ─── NavArrow ─────────────────────────────────────────────────────────────────

function NavArrow({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous event" : "Next event"}
      className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
    >
      {dir === "left" ? (
        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-white/50" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-white/50" />
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface UpcomingEventsProps {
  className?: string;
}

const AUTO_MS = 7000;

export function UpcomingEvents({ className }: UpcomingEventsProps) {
  const [idx, setIdx] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch with cache ──────────────────────────────────────────────────────
  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setEvents(cached);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/upcoming-events");
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        const mapped: Event[] = (data?.data?.values ?? []).map((item: any) => {
          return {
            id: item.id,
            title: decodeHtmlEntities(item.name || "Untitled Event"),
            description: parseDescription(item.description),
            imageUrl: item.header_image_path || "",
            date: fmtDate(item.start_time),
            location: item.event_locations?.[0]?.name || "Location TBD",
            startTime: fmtTime(item.start_time),
            endTime: fmtTime(item.end_time),
            participants: item.interested_members_count || undefined,
            eventType: item.event_type || "online",
            registrationLink: getRegistrationLink(item),
            learnMoreLink: getLearnMoreLink(item),
            slug: item.slug,
            komunitySlug: item.kommunity_slug,
          };
        });
        writeCache(mapped);
        setEvents(mapped);
      } catch {
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Auto-rotate ───────────────────────────────────────────────────────────
  const next = useCallback(
    () => setIdx((i) => (i + 1) % events.length),
    [events.length]
  );
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + events.length) % events.length),
    [events.length]
  );

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (events.length > 1) timer.current = setInterval(next, AUTO_MS);
  }, [events.length, next]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [startTimer]);

  const go = (i: number) => {
    setIdx(i);
    startTimer();
  };
  const goNext = () => {
    next();
    startTimer();
  };
  const goPrev = () => {
    prev();
    startTimer();
  };

  const ev = events[idx];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      className={cn(
        "w-full max-w-7xl mx-auto px-4 lg:px-0 pt-4 sm:pt-12 md:pt-20 pb-12 md:pb-20",
        className
      )}
    >
      {/* ── Section header ── */}
      {/* <div className="mb-10 md:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"> */}
      <div className="mb-10 md:mb-12 text-center gap-3">
        <div>
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight text-center">
            Upcoming {" "}
            <span className="text-gray-400 dark:text-white/30">Events.</span>
          </h2>
        </div>
        {/* {!loading && events.length > 0 && (
          <span className="text-xs text-gray-500 dark:text-white/30 font-semibold tracking-wide">
            {events.length} event{events.length !== 1 ? "s" : ""} upcoming
          </span>
        )} */}
      </div>

      {/* ── Loading ── */}
      {loading && <Skeleton />}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="rounded-3xl border border-red-300 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 px-6 py-12 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium text-sm">{error}</p>
          <button
            onClick={() => {
              sessionStorage.removeItem(CACHE_KEY);
              window.location.reload();
            }}
            className="mt-4 text-xs text-red-500 hover:text-red-700 dark:text-red-500/70 dark:hover:text-red-400 underline underline-offset-4 transition"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && events.length === 0 && <Empty />}

      {/* ── Event card ── */}
      {!loading && !error && ev && (
        <div className="relative rounded-3xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-white/[0.07] overflow-hidden">

          {/* ════ DESKTOP ════ */}
          <div className="hidden md:grid md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_440px]">

            {/* Left: Image panel */}
            <div className="relative flex flex-col p-4 lg:p-6 bg-gray-50 dark:bg-[#0a0a0a]">
              {/* Subtle dot grid */}
              <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Image */}
              <div className="relative z-10 flex-1 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    className="w-full"
                  >
                    <EventImage src={ev.imageUrl} alt={ev.title} id={ev.id} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Nav row */}
              {events.length > 1 && (
                <div className="relative z-10 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {events.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => go(i)}
                        className={cn(
                          "rounded-full transition-all duration-300",
                          i === idx
                            ? "w-6 h-[5px] bg-[#fd7d6e]"
                            : "w-[5px] h-[5px] bg-gray-400 dark:bg-white/20 hover:bg-gray-600 dark:hover:bg-white/40"
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <NavArrow dir="left" onClick={goPrev} />
                    <span className="text-[11px] text-gray-500 dark:text-white/25 tabular-nums w-9 text-center">
                      {idx + 1} / {events.length}
                    </span>
                    <NavArrow dir="right" onClick={goNext} />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details panel */}
            <div className="border-l border-gray-200 dark:border-white/[0.06]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                  className="h-full flex flex-col p-7 lg:p-9 gap-5"
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-[#fd7d6e]/10 text-[#fd7d6e] border border-[#fd7d6e]/25">
                      <Wifi className="w-3 h-3" />
                      {ev.eventType === "offline" ? "In-Person" : "Online"}
                    </span>
                    {ev.participants && ev.participants > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-white/40 border border-gray-300 dark:border-white/[0.07]">
                        <Users className="w-3 h-3" />
                        {ev.participants}+ interested
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-[1.6rem] lg:text-3xl font-black text-gray-900 dark:text-white leading-snug tracking-tight">
                    {ev.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-white/45 text-sm leading-relaxed line-clamp-4 flex-shrink-0">
                    {ev.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 dark:bg-white/[0.06]" />

                  {/* Meta */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[#fd7d6e] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-800 dark:text-white/70 text-sm font-semibold">{ev.date}</p>
                        {ev.startTime && ev.endTime && (
                          <p className="text-gray-500 dark:text-white/30 text-xs mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ev.startTime} – {ev.endTime}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#fd7d6e] mt-0.5 shrink-0" />
                      <p className="text-gray-800 dark:text-white/70 text-sm font-semibold line-clamp-2">
                        {ev.location}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 dark:bg-white/[0.06]" />

                  {/* CTA Buttons - Side by Side */}
                  <div className="flex flex-row gap-3 mt-auto">
                    {ev.registrationLink && (
                      <a
                        href={"https://www.commudle.com/communities/d4-community/events"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 group flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#fd7d6e] hover:bg-[#f06b5c] text-white font-bold text-sm tracking-wide transition-all active:scale-[0.97] shadow-lg shadow-[#fd7d6e]/20"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}

                    {ev.learnMoreLink && (
                      <a
                        href={ev.learnMoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 group flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white/80 font-semibold text-sm tracking-wide transition-all active:scale-[0.97]"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>

                  {/* Show message if no buttons available */}
                  {!ev.registrationLink && !ev.learnMoreLink && (
                    <p className="text-gray-500 dark:text-white/20 text-xs text-center py-1 tracking-wide">
                      Registration details coming soon
                    </p>
                  )}

                  {/* Auto-rotate progress */}
                  {events.length > 1 && (
                    <ProgressBar duration={AUTO_MS} id={ev.id} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ════ MOBILE ════ */}
          <div className="md:hidden flex flex-col">
            <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.38 }}
                >
                  <EventImage src={ev.imageUrl} alt={ev.title} id={ev.id} />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32 }}
                className="p-5 flex flex-col gap-4"
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-[#fd7d6e]/10 text-[#fd7d6e] border border-[#fd7d6e]/25">
                    <Wifi className="w-3 h-3" />
                    {ev.eventType === "offline" ? "In-Person" : "Online"}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-snug">
                  {ev.title}
                </h3>

                <p className="text-gray-600 dark:text-white/45 text-sm leading-relaxed line-clamp-3">
                  {ev.description}
                </p>

                <div className="flex flex-col gap-2.5 py-3.5 border-y border-gray-200 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#fd7d6e] shrink-0" />
                    <span className="text-gray-800 dark:text-white/65 text-sm font-semibold">{ev.date}</span>
                  </div>
                  {ev.startTime && ev.endTime && (
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#fd7d6e] shrink-0" />
                      <span className="text-gray-500 dark:text-white/35 text-xs">
                        {ev.startTime} – {ev.endTime}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#fd7d6e] shrink-0 mt-0.5" />
                    <span className="text-gray-800 dark:text-white/65 text-sm font-semibold">{ev.location}</span>
                  </div>
                </div>

                {/* CTA Buttons - Side by Side for Mobile */}
                <div className="flex flex-row gap-2">
                  {ev.registrationLink && (
                    <a
                      href={ev.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#fd7d6e] hover:bg-[#f06b5c] text-white font-bold text-sm tracking-wide transition-all active:scale-[0.97] shadow-lg shadow-[#fd7d6e]/20"
                    >
                      Register Now <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                  {ev.learnMoreLink && (
                    <a
                      href={ev.learnMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white/80 font-semibold text-sm tracking-wide transition-all active:scale-[0.97]"
                    >
                      Learn More <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Show message if no buttons available */}
                {!ev.registrationLink && !ev.learnMoreLink && (
                  <p className="text-gray-500 dark:text-white/20 text-xs text-center py-1 tracking-wide">
                    Registration details coming soon
                  </p>
                )}

                {events.length > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {events.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => go(i)}
                          className={cn(
                            "rounded-full transition-all duration-300",
                            i === idx
                              ? "w-6 h-[5px] bg-[#fd7d6e]"
                              : "w-[5px] h-[5px] bg-gray-400 dark:bg-white/20"
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <NavArrow dir="left" onClick={goPrev} />
                      <span className="text-[11px] text-gray-500 dark:text-white/25 tabular-nums">
                        {idx + 1}/{events.length}
                      </span>
                      <NavArrow dir="right" onClick={goNext} />
                    </div>
                  </div>
                )}

                {events.length > 1 && (
                  <ProgressBar duration={AUTO_MS} id={ev.id} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
      <p className="mt-2 md:mt-4 text-center">
      {!loading && events.length > 0 && (
          <span className="text-xs text-gray-500 dark:text-white/30 font-semibold tracking-wide">
            {events.length} event{events.length !== 1 ? "s" : ""} upcoming
          </span>
        )}
      </p>
    </section>
  );
}