"use client";

import { useState, useEffect, useRef } from "react";
import { Tweet } from "react-tweet";

/* ===================== DATA ===================== */

const TWEET_IDS = [
  "1942499697538572460",
  "1896194039843868875",
  "1954777297166176464",
  "1964427218274464211",
  "2045558334762459145",
  "1896586871121264780",
  "1896469281317212233",
  "2027693668795355561",
];

const SCROLL_ITEMS = [...TWEET_IDS, ...TWEET_IDS, ...TWEET_IDS];

/* ===================== HOOK ===================== */

function useMarqueeHover(direction: "up" | "down", duration = 60) {
  const colRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const frozenY = useRef<number>(0);
  const isHovered = useRef(false);

  const animate = () => {
    // Disable animation on small mobile screens to prevent layout issues
    if (typeof window !== "undefined" && window.innerWidth <= 576) {
      if (colRef.current) colRef.current.style.transform = "none";
      return;
    }

    if (!colRef.current || isHovered.current) return;

    const totalH = colRef.current.scrollHeight / 3;
    if (totalH === 0) return;

    const pxPerMs = totalH / (duration * 1000);
    let last = performance.now();

    const tick = (now: number) => {
      if (isHovered.current || !colRef.current) return;
      const delta = now - last;
      last = now;
      const step = pxPerMs * delta;

      if (direction === "up") {
        frozenY.current -= step;
        if (frozenY.current <= -totalH) frozenY.current += totalH;
      } else {
        frozenY.current += step;
        if (frozenY.current >= 0) frozenY.current -= totalH;
      }

      colRef.current.style.transform = `translate3d(0, ${frozenY.current}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      animate();
    });

    if (colRef.current) observer.observe(colRef.current);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, direction]);

  return {
    colRef,
    onMouseEnter: () => { isHovered.current = true; },
    onMouseLeave: () => { isHovered.current = false; animate(); }
  };
}

/* ===================== SUB-COMPONENTS ===================== */

function TweetCard({ id }: { id: string }) {
  return (
    <div className="w-full px-2 mb-4">
      <Tweet id={id} />
    </div>
  );
}

function MarqueeColumn({ direction, duration, className = "", isMobile = false }: { direction: "up" | "down"; duration: number; className?: string; isMobile?: boolean }) {
  const { colRef, onMouseEnter, onMouseLeave } = useMarqueeHover(direction, duration);

  return (
    <div 
      className={`h-full overflow-hidden ${className}`} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <div ref={colRef} className="flex flex-col will-change-transform">
        {(isMobile ? TWEET_IDS : SCROLL_ITEMS).map((id, i) => (
          <TweetCard key={`${direction}-${id}-${i}`} id={id} />
        ))}
      </div>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */

export default function ReviewsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // FIX: Force scroll to top on redirect/mount
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* FIX: Added opacity-0 until mounted to prevent "flashing" or 
         scrolling to the bottom of a zero-height container.
      */}
      <section className={`relative w-full pt-24 md:pt-32 pb-24 px-4 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* HEADER AREA */}
        <div className="max-w-7xl mx-auto mb-16 md:mb-24 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-800" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">Voices of the ecosystem</span>
            <div className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-800" />
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-zinc-950 dark:text-white">
            Wall of <br />
            <span className="text-zinc-200 dark:text-zinc-900">Love.</span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-500 font-medium px-4">
            Real stories and unfiltered feedback from our builders, engineers, and community partners worldwide.
          </p>
        </div>

        {/* MARQUEE CONTAINER */}
        <div className="relative mt-12 h-auto min-[576px]:h-[900px] max-w-7xl mx-auto overflow-visible min-[576px]:overflow-hidden">
          <div className="flex flex-col min-[576px]:flex-row gap-4 h-full">
            
            <MarqueeColumn 
              direction="up" 
              duration={65} 
              isMobile={true} 
              className="w-full min-[576px]:w-1/2 lg:w-1/3" 
            />

            <MarqueeColumn 
              direction="down" 
              duration={90} 
              className="hidden min-[576px]:flex min-[576px]:w-1/2 lg:w-1/3" 
            />

            <MarqueeColumn 
              direction="up" 
              duration={75} 
              className="hidden lg:flex lg:w-1/3" 
            />
          </div>

          {/* FADE GRADIENTS */}
          <div className="hidden min-[576px]:block pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white dark:from-black z-30" />
          <div className="hidden min-[576px]:block pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white dark:from-black z-30" />
        </div>
      </section>
    </main>
  );
}