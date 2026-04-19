"use client";

import { ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Tweet } from "react-tweet";
import { useRouter } from "next/navigation";

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
    onMouseEnter: () => (isHovered.current = true),
    onMouseLeave: () => {
      isHovered.current = false;
      animate();
    },
  };
}

/* ===================== SUB-COMPONENTS ===================== */
function TweetCard({ id }: { id: string }) {
  return (
    <div className="w-full mb-2">
      <div className="origin-top transition-transform duration-500">
        <Tweet id={id} />
      </div>
    </div>
  );
}

function MarqueeColumn({
  direction,
  duration,
  className = "",
}: {
  direction: "up" | "down";
  duration: number;
  className?: string;
}) {
  const { colRef, onMouseEnter, onMouseLeave } = useMarqueeHover(
    direction,
    duration,
  );

  return (
    <div
      className={`h-full overflow-hidden min-w-0 flex-1 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div ref={colRef} className="flex flex-col will-change-transform">
        {SCROLL_ITEMS.map((id, i) => (
          <TweetCard key={`${direction}-${id}-${i}`} id={id} />
        ))}
      </div>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */
export default function XReviews() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="relative w-full max-w-7xl h-[89vh] flex flex-col overflow-hidden p-4 md:p-6">
        {/* Header */}
        <div className="mb-10 md:mb-12 text-center gap-3">
          <div>
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight text-center">
              Loved by{" "}
              <span className="text-gray-400 dark:text-white/30">
                Builders.
              </span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 max-w-5xl mx-auto py-2 md:py-4 leading-relaxed">
              Join thousands who are already building something they&apos;re
              proud of.
            </p>
          </div>
        </div>

        {/* Marquee Grid */}
        <div className="relative flex-1 min-h-0 w-full overflow-hidden">
          <div className="flex gap-x-2 h-full">
            {/* Column 1 — always visible, flush left (no px on parent) */}
            <MarqueeColumn direction="up" duration={160} />

            {/* Column 2 — sm+ */}
            <MarqueeColumn
              direction="down"
              duration={190}
              className="hidden sm:block"
            />

            {/* Column 3 — md+ */}
            <MarqueeColumn
              direction="up"
              duration={180}
              className="hidden md:block"
            />

            {/* Column 4 — lg+, flush right */}
            <MarqueeColumn
              direction="down"
              duration={160}
              className="hidden lg:block"
            />
          </div>

          {/* FADE GRADIENTS */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-50 dark:from-zinc-950 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-zinc-50/80 dark:via-zinc-950/80 to-transparent z-20" />

          {/* ACTION BUTTON */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-max">
            <button
              onClick={() => router.push("/twitter-reviews")}
              className="whitespace-nowrap px-6 sm:px-8 py-4 sm:py-4 rounded-full text-white font-bold text-sm md:text-base tracking-widest uppercase transition-transform shadow-2xl"
              style={{
                background: "linear-gradient(to right, #fd7d6e, #ff9a8b)",
              }}
            >
              Explore More Stories
              {/* <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> */}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
