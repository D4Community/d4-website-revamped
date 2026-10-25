"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Star, Linkedin } from "lucide-react";

import { memberImageUrl } from "../lib/queries";
import type { TeamMember } from "../lib/types";
import { useTeamModal } from "../components/TeamModalContext";

const isUsableUrl = (url?: string): url is string =>
  Boolean(url && url !== "#" && url !== "/");

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Leads = ({ leads }: { leads: TeamMember[] }) => {
  const { openModal } = useTeamModal();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (leads.length === 0) return null;

  return (
    <section
      className="relative w-full py-24 bg-secondary/5 overflow-hidden border-y border-border/50"
      ref={ref}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
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
            Our <span className="text-[#f6b26b]">Leads</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Driving initiatives and bridging the gap across various campus
            chapters to make D4 an inclusive reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5">
          {leads.map((lead, index) => {
            const avatarSrc =
              memberImageUrl(lead.image, 240, 240) ??
              `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(
                lead.name
              )}&backgroundColor=transparent`;
            const leadSlug = slugify(lead.name);

            return (
              <motion.div
                key={lead._id || lead.name || index}
                id={leadSlug}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative flex flex-col items-center p-3 sm:p-4 md:p-5 rounded-2xl border border-border/80 bg-card/50 hover:bg-card/95 transition-all duration-300 hover:border-[#f6b26b]/50 hover:shadow-xl hover:shadow-[#f6b26b]/5 cursor-pointer overflow-hidden scroll-mt-24 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#f6b26b]"
                role="button"
                tabIndex={0}
                onClick={() => openModal(lead)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(lead);
                  }
                }}
                aria-label={`View ${lead.name}'s profile`}
              >
                {/* Top Subtle Amber Border Accent on Hover */}
                <div className="absolute top-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#f6b26b] to-transparent" />

                {/* Avatar: Fixed square aspect ratio, never squished on mobile */}
                <div
                  className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 aspect-square rounded-2xl text-[#f6b26b] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm mb-3 border border-[#f6b26b]/25 shrink-0"
                  style={{ backgroundColor: `#f6b26b15` }}
                >
                  <Image
                    src={avatarSrc}
                    alt={lead.name}
                    width={110}
                    height={110}
                    unoptimized
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Name & Designation */}
                <div className="w-full px-1 relative z-10 flex flex-col items-center flex-grow justify-start">
                  <h3
                    className="text-sm sm:text-base font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-[#f6b26b] transition-colors text-center"
                    title={lead.name}
                  >
                    {lead.name}
                  </h3>
                  <p
                    className="text-[11px] sm:text-xs font-medium text-muted-foreground line-clamp-2 mt-0.5 text-center leading-snug"
                    title={lead.designation}
                  >
                    {lead.designation}
                  </p>
                </div>

                {/* LinkedIn Icon */}
                {isUsableUrl(lead.linkedin) && (
                  <div className="mt-2.5 sm:mt-3 relative z-20 shrink-0">
                    <a
                      href={lead.linkedin}
                      className="text-muted-foreground hover:text-[#0077B5] transition-colors inline-block"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${lead.name}'s LinkedIn`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 border border-border group-hover:border-[#0077B5]/40 group-hover:bg-[#0077B5]/10 group-hover:text-[#0077B5] transition-all">
                        <Linkedin className="w-4 h-4" />
                      </div>
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};