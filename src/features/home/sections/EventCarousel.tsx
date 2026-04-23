"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  ArrowUpRight,
  Monitor,
  Users as UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EventSchema } from "@/schema";

/* ===================== TYPES ===================== */

interface EventItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  category: "Hackathon" | "Meetup" | "Workshop" | "Event";
  mode: "In-Person" | "Virtual";
  date?: string;
  /** Raw ISO timestamp used for sorting — not displayed */
  rawDate?: string;
  location?: string;
  externalUrl?: string;
}

/* ===================== CONFIG ===================== */

const AUTO_SCROLL_DELAY = 6000;
const MOBILE_CLOSE_DELAY = 3000;
const COMMUDLE_API_URL = "/api/commudle-events";
const DEVFOLIO_API_URL = "/api/devfolio-hackathons";
const LUMA_API_URL = "/api/luma-events";

/* ===================== HELPERS ===================== */

/** Parse any date string → ms epoch (NaN-safe). */
function toEpoch(dateStr?: string): number {
  if (!dateStr) return 0;
  const ms = Date.parse(dateStr);
  return isNaN(ms) ? 0 : ms;
}

/** Format an ISO string to "Apr 23" style. */
function fmtDate(iso?: string): string {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ===================== COMPONENT ===================== */

export function EventCarousel({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [activeCardId, setActiveCardId] = useState<string | number | null>(null);

  /* ===================== DATA FETCHING ===================== */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [commudleRes, devfolioRes, lumaRes] = await Promise.allSettled([
          fetch(COMMUDLE_API_URL),
          fetch(DEVFOLIO_API_URL),
          fetch(LUMA_API_URL),
        ]);

        let allItems: EventItem[] = [];

        /* ---------- Commudle ---------- */
        if (commudleRes.status === "fulfilled" && commudleRes.value.ok) {
          const data = await commudleRes.value.json();
          const mapped: EventItem[] = (data?.data?.values || []).map(
            (item: any) => ({
              id: `c-${item.id}`,
              title: item.name || "Untitled Session",
              description: item.tagline || "",
              imageUrl: item.header_image_path || "/placeholder.png",
              category: "Meetup" as const,
              mode: (item.event_type === "online"
                ? "Virtual"
                : "In-Person") as "Virtual" | "In-Person",
              rawDate: item.start_time,
              date: fmtDate(item.start_time),
              location: item.event_locations?.[0]?.name || "Online",
              externalUrl:
                "https://www.commudle.com/communities/d4-community/events",
            }),
          );
          allItems = [...allItems, ...mapped];
        }

        /* ---------- Devfolio ---------- */
        if (devfolioRes.status === "fulfilled" && devfolioRes.value.ok) {
          const data = await devfolioRes.value.json();
          const mapped: EventItem[] = (Array.isArray(data) ? data : []).map(
            (item: any) => ({
              id: `d-${item.id}`,
              title: item.name || "Hackathon",
              description: item.tagline || "Build the future",
              imageUrl: item.cover_img || "/placeholder.png",
              category: "Hackathon" as const,
              mode: (item.location?.toLowerCase().includes("online")
                ? "Virtual"
                : "In-Person") as "Virtual" | "In-Person",
              rawDate: item.starts_at,
              date: fmtDate(item.starts_at),
              location: item.location || "Remote",
            }),
          );
          allItems = [...allItems, ...mapped];
        }

        /* ---------- Luma ---------- */
        if (lumaRes.status === "fulfilled" && lumaRes.value.ok) {
          const data = await lumaRes.value.json();

          /**
           * Luma response shape (observed):
           * { entries: [ { event: {...}, hosts: [...] }, ... ] }
           *
           * Each event object typically contains:
           *   api_id, name, cover_url, start_at, end_at, geo_address_info,
           *   geo_latitude, geo_longitude, url, description, zoom_meeting_url
           */
          const entries: any[] = data?.entries ?? data?.data?.entries ?? [];

          const mapped: EventItem[] = entries.map((entry: any) => {
            const ev = entry?.event ?? entry;
            const isVirtual =
              !ev.geo_address_info?.city_state ||
              ev.zoom_meeting_url ||
              ev.meeting_url;

            return {
              id: `l-${ev.api_id ?? ev.id}`,
              title: ev.name || "Luma Event",
              description: ev.description || ev.summary || "",
              imageUrl: ev.cover_url || ev.image_url || "/placeholder.png",
              category: "Event" as const,
              mode: (isVirtual ? "Virtual" : "In-Person") as
                | "Virtual"
                | "In-Person",
              rawDate: ev.start_at,
              date: fmtDate(ev.start_at),
              location:
                ev.geo_address_info?.city_state ||
                ev.geo_address_info?.address ||
                "Online",
              externalUrl: ev.url
                ? `https://lu.ma/${ev.url}`
                : "https://lu.ma/user/usr-zPnx2wwYuPhns3S",
            };
          });

          allItems = [...allItems, ...mapped];
        }

        /* ---------- Sort newest → oldest ---------- */
        allItems.sort((a, b) => toEpoch(b.rawDate) - toEpoch(a.rawDate));

        setItems(allItems.slice(0, 20));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  /* ===================== RESPONSIVE LOGIC ===================== */
  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;
      const width = window.innerWidth;
      const visible = width < 768 ? 1 : width < 1280 ? 2 : 3;
      setVisibleCards(visible);
      setCardWidth(containerRef.current.offsetWidth / visible);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [loading, items.length]);

  const total = items.length;
  const slides =
    total > 0
      ? [
          ...items.slice(-visibleCards),
          ...items,
          ...items.slice(0, visibleCards),
        ]
      : [];

  useEffect(() => {
    setIndex(visibleCards);
  }, [visibleCards, total]);

  const handleNext = useCallback(() => {
    setAnimate(true);
    setIndex((prev) => prev + 1);
    clearActiveCard();
  }, []);

  const handlePrev = useCallback(() => {
    setAnimate(true);
    setIndex((prev) => prev - 1);
    clearActiveCard();
  }, []);

  const clearActiveCard = () => {
    setActiveCardId(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleCardClick = (id: string | number) => {
    if (activeCardId === id) {
      clearActiveCard();
      return;
    }
    setActiveCardId(id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveCardId(null);
    }, MOBILE_CLOSE_DELAY);
  };

  useEffect(() => {
    if (index >= total + visibleCards) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(visibleCards);
      }, 500);
    } else if (index < visibleCards) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(total + visibleCards - 1);
      }, 500);
    }
  }, [index, total, visibleCards]);

  useEffect(() => {
    if (paused || total === 0) return;
    const interval = setInterval(handleNext, AUTO_SCROLL_DELAY);
    return () => clearInterval(interval);
  }, [paused, handleNext, total]);

  /* =================== CATEGORY BADGE COLOR =================== */
  const categoryStyle = (cat: EventItem["category"]) => {
    switch (cat) {
      case "Hackathon":
        return "bg-violet-500/10 text-violet-500 border-violet-500/20";
      case "Meetup":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Workshop":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "Event":
      default:
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-zinc-500 animate-pulse uppercase tracking-[0.4em] text-[10px] font-black">
        Syncing_Archive...
      </div>
    );

  return (
    <div
      className={cn(
        "max-w-7xl mx-auto pt-4 sm:pt-12 md:pt-20 pb-12",
        className,
      )}
    >
      <div className="mb-10 md:mb-12 text-center gap-3">
        <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight text-center">
          Past{" "}
          <span className="text-gray-400 dark:text-white/30">Events.</span>
        </h2>
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex"
          animate={{ x: -index * cardWidth }}
          transition={
            animate
              ? { type: "spring", stiffness: 200, damping: 26 }
              : { duration: 0 }
          }
        >
          {slides.map((item, i) => {
            const uniqueId = `${item.id}-${i}`;
            const linkUrl =
              item.externalUrl ||
              "https://www.commudle.com/communities/d4-community/events";

            return (
              <div
                key={uniqueId}
                style={{ width: cardWidth }}
                className="px-4 shrink-0"
                onClick={() => handleCardClick(uniqueId)}
              >
                <EventSchema
                  event={{
                    title: item.title,
                    description: item.description,
                    date: item.date || "",
                    location: item.location,
                    imageUrl: item.imageUrl,
                    mode: item.mode,
                  }}
                />

                <motion.div className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] overflow-hidden flex flex-col h-[500px] transition-all duration-500 hover:border-[#fd7d6e]/30">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-zinc-50 dark:bg-zinc-900/50 p-4 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder.png";
                      }}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Mode badge */}
                    <div className="absolute top-5 left-5 flex flex-col gap-2">
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1.5 w-fit",
                          item.mode === "Virtual"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        )}
                      >
                        {item.mode === "Virtual" ? (
                          <Monitor className="w-3 h-3" />
                        ) : (
                          <UsersIcon className="w-3 h-3" />
                        )}
                        {item.mode}
                      </span>

                      {/* Category badge */}
                      {/* <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1.5 w-fit",
                          categoryStyle(item.category),
                        )}
                      >
                        {item.category}
                      </span> */}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-grow flex flex-col relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-[#fd7d6e]" />
                        {item.date}
                      </div>
                    </div>

                    <h3 className="text-xl font-black tracking-tight mb-3 dark:text-white text-zinc-900 group-hover:text-[#fd7d6e] transition-colors leading-tight uppercase">
                      {item.title}
                    </h3>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#fd7d6e]" />
                      <span className="text-[10px] font-bold uppercase tracking-wide truncate">
                        {item.location}
                      </span>
                    </div>

                    {/* Hover / tap reveal drawer */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(linkUrl, "_blank");
                      }}
                      className={cn(
                        "absolute inset-x-0 bottom-0 p-8 bg-white dark:bg-zinc-950 transition-transform duration-300 ease-out border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between cursor-pointer",
                        activeCardId === uniqueId
                          ? "translate-y-0"
                          : "translate-y-full group-hover:translate-y-0",
                      )}
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#fd7d6e]">
                        View Details
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#fd7d6e] flex items-center justify-center shadow-lg shadow-[#fd7d6e]/20">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination dots + nav arrows */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-6 px-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setAnimate(true);
                  setIndex(i + visibleCards);
                }}
                className={cn(
                  "h-[2px] transition-all duration-500",
                  (index - visibleCards + total) % total === i
                    ? "w-4 bg-[#fd7d6e]"
                    : "w-2 bg-zinc-200 dark:bg-zinc-800",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            className="p-2 md:p-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-[#fd7d6e] transition-all group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-[#fd7d6e]" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 md:p-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-[#fd7d6e] transition-all group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-[#fd7d6e]" />
          </button>
        </div>
      </div>
    </div>
  );
}