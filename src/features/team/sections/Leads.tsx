"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";

import { memberImageUrl } from "../lib/queries";
import type { TeamMember } from "../lib/types";
import { useTeamModal } from "../components/TeamModalContext";

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

export const Leads = ({ leads }: { leads: TeamMember[] }) => {
  const { openModal } = useTeamModal();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (leads.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden border-y border-border/60 bg-secondary/15 py-20 sm:py-24" ref={ref}>
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-[#f6b26b] uppercase">
            <Star className="w-3 h-3" />
            <span>Leadership</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-foreground">Our</span> <span className="text-muted-foreground">Leads</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Driving initiatives and bridging the gap across various campus
            chapters to make D4 an inclusive reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {leads.map((lead, index) => {
            const image = memberImageUrl(lead.image, 720, 900, "max");
            const leadSlug = slugify(lead.name);
            return (
              <motion.button
                type="button"
                key={lead._id || lead.name || index}
                id={leadSlug}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: Math.min(index * 0.045, 0.27) }}
                className="group flex min-w-0 scroll-mt-24 flex-col border border-border/80 bg-card/40 text-left transition-colors duration-200 hover:border-[#5ccb5f]/45 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f] focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                onClick={() => openModal(lead)}
                aria-label={`View ${lead.name}'s profile`}
              >
                <div className="relative aspect-[5/4] w-full overflow-hidden border-b border-border/80 bg-background">
                  {image ? (
                    <Image
                      src={image}
                      alt={lead.name}
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
                    <h3 className="break-words text-sm font-semibold tracking-tight sm:text-base" title={lead.name}>{lead.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[10px] font-medium uppercase leading-4 tracking-[0.12em] text-muted-foreground sm:text-xs">{lead.designation}</p>
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
