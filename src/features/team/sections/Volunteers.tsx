"use client";

import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import Image from "next/image";

import { memberImageUrl } from "../lib/queries";
import type { TeamMember } from "../lib/types";
import { useTeamModal } from "../components/TeamModalContext";

/*
  UTILITIES
*/

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/*
  TYPES & INTERFACES
*/

export interface VolunteersProps {
  volunteers: TeamMember[];
}

export interface MarqueeRowProps {
  items: TeamMember[];
  direction?: "left" | "right";
  duration?: number;
}

export interface VolunteerCardProps {
  member: TeamMember;
  direction: "left" | "right";
  isPrimary?: boolean;
}

/*
  SUB-COMPONENTS
*/

const VolunteerCard = React.memo(
  ({ member, direction, isPrimary }: VolunteerCardProps) => {
    const { openModal } = useTeamModal();
    const avatarSrc = useMemo(() => {
      return (
        memberImageUrl(member.image, 160, 160) ??
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
          member.name
        )}${direction === "right" ? "alt" : ""}`
      );
    }, [member.image, member.name, direction]);

    const memberSlug = useMemo(() => slugify(member.name), [member.name]);

    return (
      <div
        id={isPrimary ? memberSlug : undefined}
        className="group/vol flex flex-col items-center gap-3 w-32 flex-shrink-0 select-none scroll-mt-24 cursor-pointer focus:outline-hidden"
        role="button"
        tabIndex={0}
        onClick={() => openModal(member)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(member);
          }
        }}
        aria-label={`View ${member.name}'s profile`}
      >
        <div className="relative w-20 h-20 rounded-full bg-secondary overflow-hidden shadow-sm shadow-black/20 ring-1 ring-border/20 group-hover/vol:ring-2 group-hover/vol:ring-[#5ccb5f]/70 transition-all duration-300 group-hover/vol:scale-105">
          <Image
            src={avatarSrc}
            alt={member.name}
            fill
            sizes="80px"
            className="object-cover pointer-events-none"
            loading="lazy"
            unoptimized
          />
        </div>
        <h3
          className="text-sm font-semibold text-muted-foreground group-hover/vol:text-[#5ccb5f] transition-colors text-center whitespace-nowrap overflow-hidden text-ellipsis w-full"
          title={member.name}
        >
          {member.name}
        </h3>
      </div>
    );
  }
);

VolunteerCard.displayName = "VolunteerCard";

const MarqueeRow = React.memo(
  ({ items, direction = "left", duration = 55 }: MarqueeRowProps) => {
    // Triple the items to ensure a mathematically seamless infinite loop without gaps
    const copies = useMemo(() => [0, 1, 2], []);

    if (!items || items.length === 0) return null;

    return (
      <div
        className="volunteers-row-wrapper overflow-hidden w-full py-4 select-none"
        style={{ contain: "layout paint" }}
      >
        <div
          className={`volunteers-track flex gap-8 w-max ${direction === "left"
              ? "animate-volunteers-left"
              : "animate-volunteers-right"
            }`}
          style={{
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {copies.map((copyIdx) =>
            items.map((member, itemIdx) => (
              <VolunteerCard
                key={`${member._id}-copy-${copyIdx}-${itemIdx}`}
                member={member}
                direction={direction}
                isPrimary={copyIdx === 0}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);

MarqueeRow.displayName = "MarqueeRow";

/* 
  MAIN COMPONENT
*/

export const Volunteers = ({ volunteers }: VolunteersProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { row1, row2 } = useMemo(() => {
    if (!volunteers || volunteers.length === 0) return { row1: [], row2: [] };
    const half = Math.ceil(volunteers.length / 2);
    return {
      row1: volunteers.slice(0, half),
      row2: volunteers.slice(half),
    };
  }, [volunteers]);

  if (!volunteers || volunteers.length === 0) return null;

  return (
    <>
      <section
        className="relative w-full py-24 overflow-hidden border-t border-border/50 bg-secondary/5"
        ref={containerRef}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-[#5ccb5f] uppercase">
              <HeartHandshake className="w-3 h-3" />
              <span>Community</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              <span className="text-foreground">Our</span> <span className="text-muted-foreground">Volunteers</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Our incredible volunteers who passionately contribute their time
              and energy to our cause and events.
            </p>
          </motion.div>
        </div>

        <div className="relative w-full">
          {/* Edge Fade Gradients for clean fade-in and fade-out */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-20" />

          <MarqueeRow items={row1} direction="left" duration={55} />
          <MarqueeRow items={row2} direction="right" duration={60} />
        </div>
      </section>

      <style jsx global>{`
        @keyframes volunteer-marquee-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }
        @keyframes volunteer-marquee-right {
          0% {
            transform: translate3d(-33.333333%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-volunteers-left {
          animation-name: volunteer-marquee-left;
        }
        .animate-volunteers-right {
          animation-name: volunteer-marquee-right;
        }
        .volunteers-track {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        .volunteers-row-wrapper:hover .volunteers-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .volunteers-track {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </>
  );
};