"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Calendar, MapPin, Users, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===================== TYPES ===================== */

interface EventItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  type: 'event' | 'hackathon';
  date?: string;
  endDate?: string;
  location?: string;
  participants?: number;
  rating?: number;
  prize?: string;
  slug?: string;
}

/* ===================== STATIC FALLBACK ===================== */

const STATIC_ITEMS: EventItem[] = [
  {
    id: 1,
    title: "AI as Your CTO Co-Founder",
    description: "Build smarter with AI leadership.",
    imageUrl: "/images/events/ai-as-your-cto.png",
    type: 'event'
  },
  {
    id: 2,
    title: "Hello World Conclave",
    description: "Meet developers and founders.",
    imageUrl: "/images/events/hello-world-conclave.png",
    type: 'event'
  },
  {
    id: 3,
    title: "Digital Payments & LinkedIn",
    description: "Fintech growth insights.",
    imageUrl: "/images/events/digital-payments-and-linkedin-opportunies.png",
    type: 'event'
  },
  {
    id: 4,
    title: "Hack-N-Win 2.0",
    description: "Build fast. Win big.",
    imageUrl: "/images/events/hack-n-win-2.png",
    type: 'hackathon',
    participants: 500
  },
  {
    id: 5,
    title: "D4 Community Event",
    description: "Join 63+ attendees for this sold-out event.",
    imageUrl: "/images/events/d4-community-event.webp", 
    type: 'event',
  }
];

/* ===================== CONFIG ===================== */

const AUTO_SCROLL_DELAY = 5000;
const COMMUDLE_API_URL = "/api/commudle-events";
const DEVFOLIO_API_URL = "/api/devfolio-hackathons";

/* ===================== COMPONENT ===================== */

export function EventCarousel({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<EventItem[]>(STATIC_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState({
    commudle: 'loading',
    devfolio: 'loading'
  });

  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);

  const total = items.length;

  /* ===================== FETCH DATA FROM BOTH APIS ===================== */
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allItems: EventItem[] = [];
        const errors: string[] = [];
        const newApiStatus = { commudle: 'loading', devfolio: 'loading' };

        // Fetch Commudle events
        try {
          console.log("Fetching Commudle events from local API...");
          const commudleRes = await fetch(COMMUDLE_API_URL);

          if (!commudleRes.ok) {
            throw new Error(`HTTP ${commudleRes.status}`);
          }

          const commudleData = await commudleRes.json();
          
          const rawData = commudleData?.data?.values || [];
          
          const commudleEvents: EventItem[] = rawData.map((item: any) => {
            // Extract clean description from HTML
            let description = "Community event";
            if (item.description) {
              const textOnly = item.description
                .replace(/<[^>]*>/g, '')
                .replace(/\s+/g, ' ')
                .trim();
              
              const sentences = textOnly.split(/[.!?]+/);
              const firstSentence = sentences[0]?.trim() || textOnly;
              
              description = firstSentence.length > 70 
                ? firstSentence.substring(0, 70) + '...' 
                : firstSentence;
            }

            // Format dates
            const eventDate = item.start_time ? 
              new Date(item.start_time).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : undefined;

            const eventEndDate = item.end_time ? 
              new Date(item.end_time).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : undefined;

            return {
              id: `commudle-${item.id}`,
              title: item.name || item.title || "Untitled Event",
              description: description,
              imageUrl: item.header_image_path || "/images/events/placeholder.png",
              type: 'event' as const,
              date: eventDate,
              endDate: eventEndDate,
              location: item.event_locations?.[0]?.name || "Online",
            };
          });

          allItems.push(...commudleEvents);
          newApiStatus.commudle = commudleEvents.length > 0 ? 'success' : 'no-data';
          console.log(`Added ${commudleEvents.length} Commudle events`);
        } catch (commudleError: any) {
          console.error("Commudle API error:", commudleError);
          errors.push(`Events: ${commudleError.message || 'Failed to load'}`);
          newApiStatus.commudle = 'error';
        }

        // Fetch Devfolio hackathons
        try {
          console.log("Fetching Devfolio hackathons from local API...");
          const devfolioRes = await fetch(DEVFOLIO_API_URL);

          let devfolioData;
          
          if (!devfolioRes.ok) {
            console.warn(`Devfolio API returned ${devfolioRes.status}`);
            devfolioData = await devfolioRes.json(); // API route returns sample data on error
          } else {
            devfolioData = await devfolioRes.json();
          }

          console.log("Devfolio data received:", devfolioData);
          
          const rawData = Array.isArray(devfolioData) ? devfolioData : [];
          
          const devfolioHackathons: EventItem[] = rawData.map((item: any, index: number) => {
            // Extract clean description
            let description = item.tagline || item.desc || "Hackathon event";
            if (item.desc) {
              // Remove markdown formatting and get first paragraph
              const cleanDesc = item.desc
                .replace(/#+\s*/g, '') // Remove headers
                .replace(/\*\*/g, '')  // Remove bold
                .replace(/\*/g, '')    // Remove italics
                .split('\n')[0]        // Get first line
                .trim();
              
              if (cleanDesc) {
                description = cleanDesc.length > 70 
                  ? cleanDesc.substring(0, 70) + '...' 
                  : cleanDesc;
              }
            }

            // Format dates
            const eventDate = item.starts_at ? 
              new Date(item.starts_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : undefined;

            const eventEndDate = item.ends_at ? 
              new Date(item.ends_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : undefined;

            let prizeAmount = "";
            if (item.name?.includes("3.0")) {
              prizeAmount = "$100+";
            } else if (item.name?.includes("2.0")) {
              prizeAmount = "$953+";
            } else if (item.name?.includes("Hack-n-Win")) {
              prizeAmount = "Prizes";
            } else {
              prizeAmount = "$652+";
            }

            return {
              id: `devfolio-${item.uuid || item.id || `hackathon-${index}`}`,
              title: item.name || "Untitled Hackathon",
              description: description,
              imageUrl: item.cover_img || item.hackathon_setting?.logo || "/images/events/placeholder.png",
              type: 'hackathon' as const,
              date: eventDate,
              endDate: eventEndDate,
              location: item.location,
              participants: item.participants_count || 0,
              rating: item.rating,
              prize: prizeAmount,
              slug: item.slug
            };
          });

          allItems.push(...devfolioHackathons);
          newApiStatus.devfolio = devfolioHackathons.length > 0 ? 'success' : 'no-data';
          console.log(`Added ${devfolioHackathons.length} Devfolio hackathons`);
        } catch (devfolioError: any) {
          console.error("Devfolio API error:", devfolioError);
          errors.push(`Hackathons: ${devfolioError.message || 'Failed to load'}`);
          newApiStatus.devfolio = 'error';
        }

        setApiStatus(newApiStatus);

        // If no data from APIs, use static
        if (allItems.length === 0) {
          console.log("No data from APIs, using static items");
          setItems(STATIC_ITEMS);
        } else {
          // Sort items by date (most recent first)
          allItems.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
          });

          // Limit to maximum 12 items
          const finalItems = allItems.slice(0, 12);
          console.log(`Setting ${finalItems.length} items total`);
          setItems(finalItems);
        }

        if (errors.length > 0) {
          setError(`Some data sources had issues: ${errors.join('; ')}. Showing available data.`);
        }

      } catch (err: any) {
        console.error("Overall fetch error:", err);
        setError("Failed to load events. Showing sample data.");
        setItems(STATIC_ITEMS);
        setApiStatus({ commudle: 'error', devfolio: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  /* ===================== RESPONSIVE & LAYOUT ===================== */
  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;
      
      const width = window.innerWidth;
      let visible = 3;
      if (width < 640) visible = 1;
      else if (width < 1024) visible = 2;

      setVisibleCards(visible);
      setCardWidth(containerRef.current.offsetWidth / visible);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [loading, items.length]);

  /* ===================== INFINITE SLIDES LOGIC ===================== */
  const slides = [
    ...items.slice(-visibleCards),
    ...items,
    ...items.slice(0, visibleCards),
  ];

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

  // Handle infinite loop teleport
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (index >= total + visibleCards) {
      timeout = setTimeout(() => {
        setAnimate(false);
        setIndex(visibleCards);
      }, 500);
    } else if (index < visibleCards) {
      timeout = setTimeout(() => {
        setAnimate(false);
        setIndex(total + visibleCards - 1);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [index, total, visibleCards]);

  /* ===================== AUTOPLAY ===================== */
  useEffect(() => {
    if (paused || total === 0) return;
    const interval = setInterval(handleNext, AUTO_SCROLL_DELAY);
    return () => clearInterval(interval);
  }, [paused, handleNext, total]);

  const activeDot = total > 0 ? (index - visibleCards + total) % total : 0;

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-6">
        {/* 3-Dot Bouncing Loader */}
        <div className="flex items-center justify-center space-x-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#8590e0]"
            animate={{
              y: ["0%", "-100%", "0%"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#fd7d6e]"
            animate={{
              y: ["0%", "-100%", "0%"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: 0.2,
            }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#4ade80]"
            animate={{
              y: ["0%", "-100%", "0%"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: 0.4,
            }}
          />
        </div>
        
        <p className="text-muted-foreground text-lg font-medium">Loading community events...</p>
        
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8590e0]" />
              <span>Events</span>
              <span className="text-blue-500 animate-pulse">Loading...</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
              <span>Hackathons</span>
              <span className="text-green-500 animate-pulse">Loading...</span>
            </span>
          </div>
          
          {/* Subtle pulse animation for loader */}
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="animate-pulse">Fetching</span>
            <span className="animate-pulse" style={{ animationDelay: "0.1s" }}>data</span>
            <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>from</span>
            <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>sources</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4", className)}>
      <div className="mb-8 flex flex-col md:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight text-center">Past Events & Hackathons</h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base text-center">
            Highlights from our past gatherings, workshops, and hackathons.
          </p>
        </div>
        {/* <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(total, visibleCards)} of {total} events
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#8590e0]" />
                <span>Events</span>
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded",
                apiStatus.commudle === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                apiStatus.commudle === 'no-data' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                apiStatus.commudle === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              )}>
                {apiStatus.commudle}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Hackathons</span>
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded",
                apiStatus.devfolio === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                apiStatus.devfolio === 'no-data' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                apiStatus.devfolio === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              )}>
                {apiStatus.devfolio}
              </span>
            </div>
          </div>
        </div> */}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">{error}</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No events found. Displaying sample events.</p>
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="overflow-hidden relative group"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <motion.div
              className="flex"
              animate={{ x: -index * cardWidth }}
              transition={animate ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0 }}
            >
              {slides.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  style={{ width: cardWidth }}
                  className="px-3 shrink-0"
                >
                  <div className={cn(
                    "bg-white dark:bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col transition-all duration-300 relative group/card",
                    item.type === 'hackathon' 
                      ? "border-green-500/20 hover:border-green-500/40" 
                      : "border-blue-500/20 hover:border-blue-500/40"
                  )}>
                    {/* Type indicator */}
                    <div className={cn(
                      "absolute top-4 left-4 z-10 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                      item.type === 'hackathon' 
                        ? "bg-green-100/90 dark:bg-green-900/80 text-green-800 dark:text-green-300" 
                        : "bg-blue-100/90 dark:bg-blue-900/80 text-blue-800 dark:text-blue-300"
                    )}>
                      {item.type === 'hackathon' ? 'Hackathon' : 'Event'}
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl overflow-hidden">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 event-image border-[#fc8568]"
                        draggable={false}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={true}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/events/placeholder.png";
                          target.onerror = null;
                        }}
                      />
                    </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover/card:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-grow">
                        {item.description}
                      </p>

                      {/* Metadata */}
                      <div className="space-y-2 pt-3 border-t border-border/50 mt-auto">
                        <div className="flex items-center justify-between">
                          {item.date && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{item.date}</span>
                              {item.endDate && item.endDate !== item.date && (
                                <span className="text-xs">→ {item.endDate}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {item.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="line-clamp-1">{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-10">
            <div className="flex gap-2">
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAnimate(true);
                    setIndex(i + visibleCards);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    activeDot === i 
                      ? item.type === 'hackathon' 
                        ? "w-8 bg-green-500" 
                        : "w-8 bg-blue-500"
                      : item.type === 'hackathon'
                        ? "w-2 bg-green-500/30 hover:bg-green-500/50"
                        : "w-2 bg-blue-500/30 hover:bg-blue-500/50"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Previous slide"
                disabled={items.length <= visibleCards}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Next slide"
                disabled={items.length <= visibleCards}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}