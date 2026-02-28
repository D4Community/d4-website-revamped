"use client";

import {
  type ReactNode,
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useAnimationControls } from "framer-motion";
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
  /** Assumed width of each item in px – used to calculate the total
   *  track length for a seamless loop. If your items have varying widths
   *  you can pass the average or set `autoMeasure` to true. */
  itemWidth?: number;
  /** When true the component measures the first set of children with a
   *  ResizeObserver instead of relying on `itemWidth`. Slightly more
   *  expensive but accurate for heterogeneous sizes. */
  autoMeasure?: boolean;
  /** How many times the children list is duplicated (min 2) */
  duplicates?: number;
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
  itemWidth,
  autoMeasure = false,
  duplicates = 4,
  className,
  trackClassName,
}: InfiniteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const controls = useAnimationControls();
  const [hovered, setHovered] = useState(false);
  const pausedXRef = useRef<number | null>(null);

  const items = Children.toArray(children);
  const count = items.length;

  // Duplicate children for seamless loop
  const safeCount = Math.max(duplicates, 2);
  const allItems = Array.from({ length: safeCount }, () => items).flat();

  // ── Measure a single set width ──────────────────────────────────────────

  const measure = useCallback(() => {
    if (count === 0) return;

    if (!autoMeasure && itemWidth) {
      // Fast path – calculated from props
      setSingleSetWidth(count * (itemWidth + gap));
      return;
    }

    // Measure from the DOM
    if (!trackRef.current) return;
    const trackChildren = Array.from(trackRef.current.children);
    // Measure only the first `count` children (one set)
    let width = 0;
    for (let i = 0; i < Math.min(count, trackChildren.length); i++) {
      const el = trackChildren[i] as HTMLElement;
      width += el.offsetWidth + gap;
    }
    setSingleSetWidth(width);
  }, [count, itemWidth, gap, autoMeasure]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Optional ResizeObserver for auto-measurement
  useEffect(() => {
    if (!autoMeasure || !trackRef.current) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [autoMeasure, measure]);

  // ── Animation ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (singleSetWidth === 0) return;

    const shouldPause = pauseOnHover && hovered;

    if (shouldPause) {
      // Capture current x position from the DOM before stopping
      if (trackRef.current) {
        const computedStyle = window.getComputedStyle(trackRef.current);
        const matrix = new DOMMatrix(computedStyle.transform);
        pausedXRef.current = matrix.m41;
      }
      controls.stop();
      return;
    }

    const to = direction === "left" ? -singleSetWidth : 0;

    // Resume from paused position or start fresh
    const from =
      pausedXRef.current !== null
        ? pausedXRef.current
        : direction === "left"
          ? 0
          : -singleSetWidth;

    // Calculate remaining distance to compute proportional duration
    const totalDistance = singleSetWidth;
    const remaining = Math.abs(to - from);
    const duration = (remaining / totalDistance) * (singleSetWidth / speed);

    pausedXRef.current = null;

    controls.set({ x: from });
    controls.start({
      x: to,
      transition: {
        x: {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    });

    return () => {
      controls.stop();
    };
  }, [singleSetWidth, speed, direction, hovered, pauseOnHover, controls]);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left fade */}
      {showFade && (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 bg-linear-to-r from-background to-transparent",
            fadeWidth
          )}
        />
      )}

      {/* Right fade */}
      {showFade && (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 bg-linear-to-l from-background to-transparent",
            fadeWidth
          )}
        />
      )}

      {/* Sliding track */}
      <motion.div
        ref={trackRef}
        className={cn("flex w-max items-center", trackClassName)}
        style={{ gap }}
        animate={controls}
      >
        {allItems.map((item, i) => (
          <div key={i} className="shrink-0">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
