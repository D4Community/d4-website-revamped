"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Linkedin } from "lucide-react";

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

export const CoreTeam = ({ core }: { core: TeamMember[] }) => {
  const { openModal } = useTeamModal();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (core.length === 0) return null;

  return (
    <section className="relative w-full py-24 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
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
            Our <span className="text-[#6d9eeb]">Core Team</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The backbone of our community, working tirelessly behind the scenes to deliver exceptional experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {core.map((member, index) => {
            const avatarSrc =
              memberImageUrl(member.image, 192, 192) ??
              `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(member.name)}`;
            const memberSlug = slugify(member.name);

            return (
              <motion.div
                key={member._id}
                id={memberSlug}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col items-center gap-2.5 p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-card/50 hover:bg-card transition-all duration-300 hover:border-border/80 hover:shadow-lg cursor-pointer overflow-hidden scroll-mt-24 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#6d9eeb]"
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
                {/* Top Border Accent */}
                <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#6d9eeb]" />

                <div
                  className="relative w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-2xl text-[#6d9eeb] overflow-hidden shadow-sm flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105"
                  style={{ backgroundColor: `#6d9eeb15` }}
                >
                  <Image
                    src={avatarSrc}
                    alt={member.name}
                    width={86}
                    height={86}
                    unoptimized
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="text-center relative z-10 w-full px-1">
                  <h3
                    className="text-sm sm:text-[15px] font-bold tracking-tight text-foreground group-hover:text-[#6d9eeb] transition-colors line-clamp-1"
                    title={member.name}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2"
                    title={member.designation}
                  >
                    {member.designation}
                  </p>
                </div>
                {isUsableUrl(member.linkedin) && (
                  <div className="mt-auto pt-1 flex items-center justify-center relative z-20">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-[#0077B5] transition-colors"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 border border-border group-hover:border-[#0077B5]/30 group-hover:bg-[#0077B5]/10 transition-all">
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