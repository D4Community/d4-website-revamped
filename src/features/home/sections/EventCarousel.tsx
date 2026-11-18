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
import { EventSchema } from "@/schema";
import type { PastEvent } from "@/features/events/data";

type EventItem = PastEvent;

const AUTO_SCROLL_DELAY = 6000;
const MOBILE_CLOSE_DELAY = 3000;

/* ===================== COMPONENT ===================== */

export function EventCarousel({
  className,
  events,
}: {
  className?: string;
  events: EventItem[];
}) {
  const items = events;
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [activeCardId, setActiveCardId] = useState<string | number | null>(null);

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
  }, [items.length]);

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

  return (
    <div className={cn("max-w-7xl mx-auto min-h-[44rem] pt-4 sm:pt-12 md:pt-20 pb-12", className)}>
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
                {/* Fixed parameters passed safely down into the schema element below */}
                <EventSchema
                  event={{
                    title: item.title,
                    description: item.description,
                    date: item.rawDate || "", 
                    location: item.location,
                    imageUrl: item.imageUrl,
                    mode: item.mode,
                    registrationLink: linkUrl,
                  }}
                />

                <motion.div className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] overflow-hidden flex flex-col h-[500px] transition-all duration-500 hover:border-[#fd7d6e]/30">
                  {/* Image */}
                  <div className="relative aspect-[361/262] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 361px"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        if (!e.currentTarget.src.endsWith("/placeholder.png")) {
                          e.currentTarget.src = "/placeholder.png";
                        }
                      }}
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