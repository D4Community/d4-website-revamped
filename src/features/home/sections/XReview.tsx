"use client";

import { ChevronRight } from "lucide-react";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Tweet } from "react-tweet";
import Link from "next/link";

/* ===================== DATA ===================== */
const TWEET_IDS = [
  "1942499697538572460",
  "1896194039843868875",
  "2046501317418615231",
  "1954777297166176464",
  "1964427218274464211",
  "2045558334762459145",
  "1896586871121264780",
  "1896469281317212233",
  "2027693668795355561",
];

// Duplicate items twice to form a seamless infinite CSS loop
const SCROLL_ITEMS = [...TWEET_IDS, ...TWEET_IDS];

/* ===================== SAFETY BOUNDARY ===================== */
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
    console.error("X/Tweet structural rendering exception caught safely:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/* ===================== SUB-COMPONENTS ===================== */
const TweetCard = React.memo(function TweetCard({ id }: { id: string }) {
  return (
    <div className="w-full mb-2">
      <div className="origin-top transition-transform duration-500">
        <TweetErrorBoundary
          fallback={
            <div className="w-full p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                <div className="space-y-1 flex-1">
                  <div className="w-24 h-3 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="w-16 h-2 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse" />
                </div>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 italic my-3">
                Review platform layout modified by host.
              </p>
              <a
                href={`https://x.com/i/status/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 dark:text-blue-400 font-medium hover:underline self-start"
              >
                View original post on X →
              </a>
            </div>
          }
        >
          <Tweet id={id} />
        </TweetErrorBoundary>
      </div>
    </div>
  );
});

function MarqueeColumn({
  direction,
  duration,
  className = "",
}: {
  direction: "up" | "down";
  duration: number;
  className?: string;
}) {
  const animClass = direction === "up" ? "animate-marquee-up" : "animate-marquee-down";

  return (
    <div className={`h-full overflow-hidden min-w-0 flex-1 group ${className}`}>
      <div
        className={`flex flex-col will-change-transform ${animClass} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${duration}s` }}
      >
        {SCROLL_ITEMS.map((id, i) => (
          <TweetCard key={`${direction}-${id}-${i}`} id={id} />
        ))}
      </div>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */
export default function XReviews() {
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
            {/* Column 1 — always visible */}
            <MarqueeColumn direction="up" duration={120} />

            {/* Column 2 — sm+ */}
            <MarqueeColumn
              direction="down"
              duration={140}
              className="hidden sm:block"
            />

            {/* Column 3 — md+ */}
            <MarqueeColumn
              direction="up"
              duration={130}
              className="hidden md:block"
            />

            {/* Column 4 — lg+ */}
            <MarqueeColumn
              direction="down"
              duration={120}
              className="hidden lg:block"
            />
          </div>

          {/* FADE GRADIENTS */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-50 dark:from-zinc-950 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-zinc-50/80 dark:via-zinc-950/80 to-transparent z-20" />

          {/* ACTION BUTTON */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-max">
            <Link
              href="/twitter-reviews"
              className="inline-block whitespace-nowrap px-6 sm:px-8 py-4 sm:py-4 rounded-full text-white font-bold text-sm md:text-base tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 shadow-2xl"
              style={{
                background: "linear-gradient(to right, #fd7d6e, #ff9a8b)",
              }}
            >
              Explore More Stories
            </Link>
          </div>
        </div>
      </section>

      {/* GPU Hardware Accelerated Smooth Marquee Animations */}
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