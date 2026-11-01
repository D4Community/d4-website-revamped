"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { memberImageUrl } from "../lib/queries";
import type { TeamMember } from "../lib/types";
import { useTeamModal } from "../components/TeamModalContext";

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

export const CoreTeam = ({ core }: { core: TeamMember[] }) => {
  const { openModal } = useTeamModal();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (core.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden py-20 sm:py-24" ref={ref}>
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-[#6d9eeb] uppercase">
            <ShieldCheck className="w-3 h-3" />
            <span>Execution</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-foreground">Our</span> <span className="text-muted-foreground">Core Member</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The backbone of our community, working tirelessly behind the scenes to deliver exceptional experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {core.map((member, index) => {
            const image = memberImageUrl(member.image, 720, 900, "max");
            const memberSlug = slugify(member.name);
            return (
              <motion.button
                type="button"
                key={member._id}
                id={memberSlug}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: Math.min(index * 0.045, 0.27) }}
                className="group flex min-w-0 scroll-mt-24 flex-col border border-border/80 bg-card/40 text-left transition-colors duration-200 hover:border-[#5ccb5f]/45 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f] focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                onClick={() => openModal(member)}
                aria-label={`View ${member.name}'s profile`}
              >
                <div className="relative aspect-[5/4] w-full overflow-hidden border-b border-border/80 bg-background">
                  {image ? (
                    <Image
                      src={image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 23vw"
                      unoptimized
                      className="object-contain transition-opacity duration-200 group-hover:opacity-90 motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-background" aria-hidden="true" />
                  )}
                </div>
                <div className="flex min-h-24 flex-1 items-start justify-between gap-3 p-3 sm:p-4">
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold tracking-tight sm:text-base" title={member.name}>{member.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[10px] font-medium uppercase leading-4 tracking-[0.12em] text-muted-foreground sm:text-xs">{member.designation}</p>
                  </div>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-border/80 text-muted-foreground transition-colors duration-200 group-hover:border-[#5ccb5f]/50 group-hover:text-[#5ccb5f] group-focus-visible:border-[#5ccb5f] group-focus-visible:text-[#5ccb5f] motion-reduce:transition-none">
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
                    <span className="sr-only">Open profile</span>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
