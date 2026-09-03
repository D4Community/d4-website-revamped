"use client";

import { Component, ErrorInfo, ReactNode, memo } from "react";
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

const SCROLL_ITEMS = [...TWEET_IDS, ...TWEET_IDS];

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

/* ===================== SUB-COMPONENTS ===================== */

const TweetCard = memo(function TweetCard({ id }: { id: string }) {
  const fallbackCard = (
    <div className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 shadow-sm flex flex-col justify-between min-h-[120px]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        <div className="space-y-1 flex-1">
          <div className="w-20 h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="w-12 h-2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 italic my-2">
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
    <div className="@container w-full px-1.5 mb-3 flex flex-col [&>div]:!max-w-full [&>div]:!w-full [&_blockquote]:!max-w-full [&_blockquote]:!w-full [&_blockquote]:!mx-0">
      <TweetErrorBoundary fallback={fallbackCard}>
        <Tweet id={id} />
      </TweetErrorBoundary>
    </div>
  );
});

function MarqueeColumn({
  direction,
  duration,
  className = "",
  isMobile = false,
}: {
  direction: "up" | "down";
  duration: number;
  className?: string;
  isMobile?: boolean;
}) {
  const animClass = direction === "up" ? "animate-marquee-up" : "animate-marquee-down";

  return (
    <div className={`h-full overflow-hidden min-w-0 group ${className}`}>
      <div
        className={`flex flex-col will-change-transform w-full ${
          isMobile ? "" : `${animClass} group-hover:[animation-play-state:paused]`
        }`}
        style={!isMobile ? { animationDuration: `${duration}s` } : undefined}
      >
        {(isMobile ? TWEET_IDS : SCROLL_ITEMS).map((id, i) => (
          <TweetCard key={`${direction}-${id}-${i}`} id={id} />
        ))}
      </div>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
      <section className="relative w-full max-w-7xl mx-auto pt-14 md:pt-20 pb-16 px-4 md:px-6">
        
        {/* HEADER AREA */}
        <div className="text-center space-y-3 mb-8 md:mb-10">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 shadow-sm mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              Voices of the ecosystem
            </span>
          </div> */}

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none text-zinc-950 dark:text-white">
            Wall of <span className="text-zinc-300 dark:text-zinc-800">Love.</span>
          </h2>

          <p className="max-w-md mx-auto text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium px-4">
            Real stories and unfiltered feedback from our builders, engineers, and partners.
          </p>
        </div>

        {/* MARQUEE CONTAINER FRAME */}
        <div className="relative border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/40 backdrop-blur-md rounded-[2.5rem] p-3 md:p-4 h-auto min-[576px]:h-[680px] overflow-visible min-[576px]:overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex flex-col min-[576px]:flex-row gap-3 h-full">
            <MarqueeColumn
              direction="up"
              duration={55}
              isMobile={true}
              className="w-full min-[576px]:w-1/2 lg:w-1/3"
            />

            <MarqueeColumn
              direction="down"
              duration={75}
              className="hidden min-[576px]:flex min-[576px]:w-1/2 lg:w-1/3"
            />

            <MarqueeColumn
              direction="up"
              duration={65}
              className="hidden lg:flex lg:w-1/3"
            />
          </div>

          {/* GRADIENT SHADOW OVERLAYS */}
          <div className="hidden min-[576px]:block pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white dark:from-black via-white/80 dark:via-black/80 to-transparent z-20 rounded-t-[2.5rem]" />
          <div className="hidden min-[576px]:block pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black via-white/90 dark:via-black/90 to-transparent z-20 rounded-b-[2.5rem]" />

          {/* PREMIUM FLOATING FOLLOW BUTTON AT BOTTOM */}
          <div className="relative min-[576px]:absolute bottom-2 min-[576px]:bottom-5 left-1/2 -translate-x-1/2 z-30 w-full min-[576px]:w-max flex justify-center pt-3 min-[576px]:pt-0">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs md:text-sm tracking-wide shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              {/* Button Ambient Glow */}
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-white dark:to-zinc-300 opacity-30 blur-md group-hover:opacity-60 transition duration-300 -z-10" />

              {/* X Logo */}
              <svg
                className="w-4 h-4 fill-current transition-transform duration-300 group-hover:rotate-12"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Follow on X</span>
              <span className="text-[11px] font-normal opacity-60 pl-1 border-l border-zinc-700 dark:border-zinc-300 hidden sm:inline">
                @d4community
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Hardware-Accelerated CSS Animations */}
      <style jsx global>{`
        @keyframes marquee-up {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -50%, 0);
          }
        }
        @keyframes marquee-down {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-marquee-up {
          animation: marquee-up linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down linear infinite;
        }
      `}</style>
    </main>
  );
}