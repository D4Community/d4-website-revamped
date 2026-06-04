"use client";

import { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";
import { Tweet } from "react-tweet";

/* ===================== DATA ===================== */

const TWEET_IDS = [
  "1942499697538572460",
  "1896194039843868875",
  "1954777297166176464",
  "1964427218274464211",
  "2045558334762459145",
  "1896586871121264780",
  "2046501317418615231",
  "1896469281317212233",
  "2027693668795355561",
];

const SCROLL_ITEMS = [...TWEET_IDS, ...TWEET_IDS, ...TWEET_IDS];

/* ===================== ERROR BOUNDARY ===================== */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class TweetErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Handled tweet rendering exception safely:", error.message);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/* ===================== HOOK ===================== */

function useMarqueeHover(direction: "up" | "down", duration = 60) {
  const colRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const frozenY = useRef<number>(0);
  const isHovered = useRef(false);

  const animate = () => {
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
  const fallbackCard = (
    <div className="w-full p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between min-h-[130px]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        <div className="space-y-1 flex-1">
          <div className="w-24 h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="w-16 h-2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 italic my-3">
        Review temporarily unavailable or post removed.
      </p>
      <a
        href={`https://x.com/i/status/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-500 hover:underline font-medium self-start"
      >
        View original on X →
      </a>
    </div>
  );

  return (
    /* FIXES APPLIED BELOW:
      1. Added `@container` to isolate container query measurements to the individual card width.
      2. Added strict nested resets (`[&>div]:!max-w-full`, `[&_blockquote]:!max-w-full`) to prevent layout leaks.
    */
    <div className="@container w-full px-2 mb-4 flex flex-col [&>div]:!max-w-full [&>div]:!w-full [&_blockquote]:!max-w-full [&_blockquote]:!w-full [&_blockquote]:!mx-0">
      <TweetErrorBoundary fallback={fallbackCard}>
        <Tweet id={id} />
      </TweetErrorBoundary>
    </div>
  );
}

function MarqueeColumn({ direction, duration, className = "", isMobile = false }: { direction: "up" | "down"; duration: number; className?: string; isMobile?: boolean }) {
  const { colRef, onMouseEnter, onMouseLeave } = useMarqueeHover(direction, duration);

  return (
    <div 
      className={`h-full overflow-hidden min-w-0 ${className}`} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <div ref={colRef} className="flex flex-col will-change-transform w-full">
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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
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