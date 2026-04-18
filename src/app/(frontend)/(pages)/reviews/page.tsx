"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star, ShieldCheck, Twitter } from "lucide-react";

/* ===================== DATA ===================== */

const TESTIMONIALS = [
  {
    name: "Arjun Mehta",
    handle: "@arjun_codes",
    avatar: "https://i.pravatar.cc/150?u=arjun",
    content:
      "D4 is the first community in North India that actually focuses on 'Shipping'. The 48-hour sprints pushed my engineering limits further than my 4-year degree did.",
    type: "verified_builder",
  },
  {
    name: "Sneha Kapoor",
    handle: "@sneha_dev",
    avatar: "https://i.pravatar.cc/150?u=sneha",
    content:
      "The density of talent here is insane. You're literally one DM away from someone who's building production-grade AI systems. Best developer community in India, hands down.",
    type: "community_leader",
  },
  {
    name: "Rohan Verma",
    handle: "@rohan_v",
    avatar: "https://i.pravatar.cc/150?u=rohan",
    content:
      "If you are an engineer in India and not in D4, you are missing out on the secret roadmap of the industry. The deep-tech workshops are pure gold.",
    type: "verified_builder",
  },
  {
    name: "Priya Das",
    handle: "@priya_stacks",
    avatar: "https://i.pravatar.cc/150?u=priya",
    content:
      "Minimalist, high-bandwidth, and zero fluff. D4 matches my building style. Being part of the largest developer community in North India has opened so many doors.",
    type: "verified_builder",
  },
  {
    name: "Ishaan Singh",
    handle: "@ishaan_s",
    avatar: "https://i.pravatar.cc/150?u=ishaan",
    content:
      "The GenAI Conclave was the most well-executed event I've attended. D4 is setting the standard for technical execution in the country.",
    type: "hackathon_winner",
  },
];

const SCROLL_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

/* ===================== HOOK ===================== */

function useMarqueeHover(direction: "up" | "down", duration = 40) {
  const colRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const frozenY = useRef<number>(0);
  const isHovered = useRef(false);

  // Animate via rAF — bypasses CSS animation entirely for pixel-perfect control
  const animate = () => {
    const col = colRef.current;
    if (!col) return;

    if (isHovered.current) return; // paused — don't schedule next frame

    const totalH = col.scrollHeight / 3;
    const pxPerMs = totalH / (duration * 1000);

    let last = performance.now();

    const tick = (now: number) => {
      if (isHovered.current) return;
      const col = colRef.current;
      if (!col) return;

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

      col.style.transform = `translateY(${frozenY.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const col = colRef.current;
    if (!col) return;

    // Kill CSS animation — we drive everything via rAF
    col.style.animation = "none";

    // Start position
    frozenY.current = direction === "down" ? -(col.scrollHeight / 3) : 0;
    col.style.transform = `translateY(${frozenY.current}px)`;

    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    isHovered.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    animate();
  };

  return { colRef, handleMouseEnter, handleMouseLeave };
}

/* ===================== SUB-COMPONENTS ===================== */

function ReviewCard({ review }: { review: (typeof TESTIMONIALS)[0] }) {
  return (
    <div className="relative flex w-full max-w-lg flex-col gap-4 overflow-hidden rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 shadow-xl shadow-black/5 mb-4 break-inside-avoid group transition-all duration-500 hover:border-[#fd7d6e]/40 hover:shadow-2xl hover:shadow-[#fd7d6e]/5 cursor-default">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={review.avatar}
              alt={review.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <h4 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1.5 uppercase tracking-tight">
              {review.name}
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
            </h4>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {review.handle}
            </p>
          </div>
        </div>
        <Twitter className="w-4 h-4 text-[#3BA9EE] opacity-50" />
      </div>

      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#fd7d6e]/10 rotate-180" />
        <p className="relative z-10 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
          {review.content}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3 h-3 text-[#fd7d6e] fill-[#fd7d6e]" />
          ))}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#fd7d6e] bg-[#fd7d6e]/10 px-2 py-1 rounded">
          {review.type.replace("_", " ")}
        </span>
      </div>
    </div>
  );
}

function MarqueeColumn({
  direction,
  duration = 40,
}: {
  direction: "up" | "down";
  duration?: number;
}) {
  const { colRef, handleMouseEnter, handleMouseLeave } = useMarqueeHover(
    direction,
    duration
  );

  return (
    <div
      className="h-full overflow-hidden flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={colRef}
        className="flex flex-col gap-6 will-change-transform"
        // CSS animation classes removed — rAF drives everything
      >
        {SCROLL_ITEMS.map((r, i) => (
          <ReviewCard key={`${direction}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */

export default function ReviewsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-black" />;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <section className="relative w-full bg-white dark:bg-black py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-20 text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-10 h-[1px] bg-[#fd7d6e]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#fd7d6e]">
                Direct Feedback
              </span>
              <div className="w-10 h-[1px] bg-[#fd7d6e]" />
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase leading-none">
              The Voice of <br />
              <span className="text-zinc-200 dark:text-zinc-800">
                The Collective.
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-sm text-zinc-500 dark:text-zinc-500 font-medium leading-relaxed">
              D4 is the{" "}
              <strong>biggest developer community in North India</strong>. Our
              reputation is built on technical excellence and high-bandwidth
              networking.
            </p>
          </div>

          {/* Desktop: 3 animated columns */}
          <div className="relative hidden lg:flex h-[850px] w-full flex-row items-center justify-center gap-6 overflow-hidden">
            <MarqueeColumn direction="up" />
            <MarqueeColumn direction="down" />
            <MarqueeColumn direction="up" />

            {/* Fade masks */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white dark:from-black z-20" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white dark:from-black z-20" />
          </div>

          {/* Mobile: static grid */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((r, i) => (
              <ReviewCard key={`mobile-${i}`} review={r} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}