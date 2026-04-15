"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
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

/* ===================== TYPES ===================== */

interface EventItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  category: "Hackathon" | "Meetup" | "Workshop";
  mode: "In-Person" | "Virtual";
  date?: string;
  location?: string;
}

/* ===================== CONFIG ===================== */

const AUTO_SCROLL_DELAY = 6000;
const COMMUDLE_API_URL = "/api/commudle-events";
const DEVFOLIO_API_URL = "/api/devfolio-hackathons";

export function EventCarousel({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);

  /* ===================== DATA FETCHING ===================== */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [commudleRes, devfolioRes] = await Promise.allSettled([
          fetch(COMMUDLE_API_URL),
          fetch(DEVFOLIO_API_URL),
        ]);

        let allItems: EventItem[] = [];

        if (commudleRes.status === "fulfilled" && commudleRes.value.ok) {
          const data = await commudleRes.value.json();
          const mapped: EventItem[] = (data?.data?.values || []).map((item: any) => ({
            id: `c-${item.id}`,
            title: item.name || "Untitled Session",
            description: item.tagline || "",
            imageUrl: item.header_image_path || "/placeholder.png",
            category: "Meetup" as const,
            mode: (item.event_type === "online" ? "Virtual" : "In-Person") as "Virtual" | "In-Person",
            date: item.start_time
              ? new Date(item.start_time).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "TBD",
            location: item.event_locations?.[0]?.name || "Online",
          }));
          allItems = [...allItems, ...mapped];
        }

        if (devfolioRes.status === "fulfilled" && devfolioRes.value.ok) {
          const data = await devfolioRes.value.json();
          const mapped: EventItem[] = (Array.isArray(data) ? data : []).map((item: any) => ({
            id: `d-${item.id}`,
            title: item.name || "Hackathon",
            description: item.tagline || "Build the future",
            imageUrl: item.cover_img || "/placeholder.png",
            category: "Hackathon" as const,
            mode: (item.location?.toLowerCase().includes("online")
              ? "Virtual"
              : "In-Person") as "Virtual" | "In-Person",
            date: item.starts_at
              ? new Date(item.starts_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Upcoming",
            location: item.location || "Remote",
          }));
          allItems = [...allItems, ...mapped];
        }

        setItems(allItems.slice(0, 15));
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
  }, []);

  const handlePrev = useCallback(() => {
    setAnimate(true);
    setIndex((prev) => prev - 1);
  }, []);

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

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-zinc-500 animate-pulse uppercase tracking-[0.4em] text-[10px] font-black">
        Syncing_Archive...
      </div>
    );

  return (
    <div className={cn("max-w-7xl mx-auto pt-4 sm:pt-12 md:pt-20 pb-12", className)}>
      {/* Centered Heading */}
      <header className="mb-12 flex flex-col items-center text-center space-y-4">
        <h2 className="font-bold text-3xl md:text-5xl md:text-6xl font-black tracking-tighter dark:text-white text-zinc-950">
          Past <span className="text-zinc-400 dark:text-zinc-400">Events.</span>
        </h2>
      </header>

      {/* Carousel Container */}
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
          {slides.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              style={{ width: cardWidth }}
              className="px-4 shrink-0"
            >
              <motion.div className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] overflow-hidden flex flex-col h-[500px] transition-all duration-500 hover:border-[#fd7d6e]/30">
                {/* Visual Section */}
                <div className="relative aspect-[4/3] bg-zinc-50 dark:bg-zinc-900/50 p-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

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
                  </div>
                </div>

                {/* Content Section */}
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

                  {/* Hidden Hover Button */}
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.commudle.com/communities/d4-community/events",
                        "_blank",
                      )
                    }
                    className="absolute inset-x-0 bottom-0 p-8 bg-white dark:bg-zinc-950 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between cursor-pointer"
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
          ))}
        </motion.div>
      </div>

      {/* Pagination & Arrows Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-6 px-6">
        {/* Left Side: Pagination Dots */}
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

        {/* Right Side: Navigation Arrows */}
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