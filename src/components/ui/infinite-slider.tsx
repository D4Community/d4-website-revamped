"use client";

import {
  type ReactNode,
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InfiniteSliderProps {
  /** The items to slide – pass any React elements as children */
  children: ReactNode;
  /** Scroll direction */
  direction?: "left" | "right";
  /** Scroll speed in px/s */
  speed?: number;
  /** Pause the scroll on hover */
  pauseOnHover?: boolean;
  /** Show edge‑fade gradient overlays */
  showFade?: boolean;
  /** Tailwind width class(es) for each fade overlay */
  fadeWidth?: string;
  /** Gap between items in px */
  gap?: number;
  /** Extra class names for the outer container */
  className?: string;
  /** Extra class names applied to the sliding track `<div>` */
  trackClassName?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function InfiniteSlider({
  children,
  direction = "left",
  speed = 40,
  pauseOnHover = true,
  showFade = true,
  fadeWidth = "w-20 md:w-32",
  gap = 48,
  className,
  trackClassName,
}: InfiniteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);

  const items = Children.toArray(children);
  const count = items.length;

  // Only need 2 copies for a seamless CSS loop
  const allItems = [...items, ...items];

  // ── Measure a single set width & compute duration ───────────────────────

  const measure = useCallback(() => {
    if (count === 0 || !trackRef.current) return;
    const trackChildren = Array.from(trackRef.current.children);
    let width = 0;
    for (let i = 0; i < Math.min(count, trackChildren.length); i++) {
      const el = trackChildren[i] as HTMLElement;
      width += el.offsetWidth + gap;
    }
    setDuration(width / speed);
  }, [count, gap, speed]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // ── Render ──────────────────────────────────────────────────────────────

  const isReady = duration > 0;
  const trackClass =
    direction === "left" ? "slider-track-left" : "slider-track-right";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        pauseOnHover && "slider-wrapper",
        className,
      )}
    >
      {/* Left fade */}
      {showFade && (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 bg-linear-to-r from-background to-transparent",
            fadeWidth,
          )}
        />
      )}

      {/* Right fade */}
      {showFade && (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 bg-linear-to-l from-background to-transparent",
            fadeWidth,
          )}
        />
      )}

      {/* Sliding track — pure CSS animation on the GPU */}
      <div
        ref={trackRef}
        className={cn(
          "flex w-max items-center",
          isReady && trackClass,
          trackClassName,
        )}
        style={{
          gap,
          "--slider-duration": `${duration}s`,
        } as React.CSSProperties}
      >
        {allItems.map((item, i) => (
          <div key={i} className="shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
