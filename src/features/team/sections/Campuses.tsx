"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Linkedin, MapPin } from "lucide-react";

import { memberImageUrl } from "../lib/queries";
import type { CampusTeam, TeamMember } from "../lib/types";
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

const MemberCard = ({
  member,
  index,
  isInView,
  anchorId,
}: {
  member: TeamMember;
  index: number;
  isInView: boolean;
  anchorId?: string;
}) => {
  const { openModal } = useTeamModal();
  const avatarSrc =
    memberImageUrl(member.image, 240, 240) ??
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=transparent`;

  return (
    <motion.div
      id={anchorId}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05 }}
      className="group relative flex flex-col items-center p-3 sm:p-4 md:p-5 rounded-2xl border border-border/80 bg-card/50 hover:bg-card/95 transition-all duration-300 hover:border-[#f6b26b]/50 hover:shadow-xl hover:shadow-[#f6b26b]/5 cursor-pointer overflow-hidden scroll-mt-24 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#f6b26b]"
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
      <div className="absolute top-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#f6b26b] to-transparent" />
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl text-[#f6b26b] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm mb-3 border border-[#f6b26b]/25 shrink-0"
        style={{ backgroundColor: "#f6b26b15" }}
      >
        <Image
          src={avatarSrc}
          alt={member.name}
          width={110}
          height={110}
          unoptimized
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="w-full px-1 relative z-10 flex flex-col items-center flex-grow justify-start">
        <h3
          className="text-sm sm:text-base font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-[#f6b26b] transition-colors text-center"
          title={member.name}
        >
          {member.name}
        </h3>
        <p
          className="text-[11px] sm:text-xs font-medium text-muted-foreground line-clamp-2 mt-0.5 text-center leading-snug"
          title={member.designation}
        >
          {member.designation}
        </p>
      </div>
      {isUsableUrl(member.linkedin) && (
        <div className="mt-2.5 sm:mt-3 relative z-20 shrink-0">
          <a
            href={member.linkedin}
            className="text-muted-foreground hover:text-[#0077B5] transition-colors inline-block"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${member.name}'s LinkedIn`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 border border-border group-hover:border-[#0077B5]/40 group-hover:bg-[#0077B5]/10 group-hover:text-[#0077B5] transition-all">
              <Linkedin className="w-4 h-4" />
            </div>
          </a>
        </div>
      )}
    </motion.div>
  );
};

const CampusSection = ({ team }: { team: CampusTeam }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { campus, leads, members } = team;
  const people = [...leads, ...members];

  return (
    <section
      id={`campus-${campus.slug}`}
      className="relative w-full py-24 bg-secondary/5 overflow-hidden border-y border-border/50 scroll-mt-24"
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
            <MapPin className="w-3 h-3" />
            <span>Campus team</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{campus.name}</h2>
          {campus.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">{campus.description}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5">
          {people.map((member, index) => (
            <MemberCard
              key={member._id || member.name}
              member={member}
              index={index}
              isInView={isInView}
              anchorId={member.group === "campus" ? slugify(member.name) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const Campuses = ({ campuses }: { campuses: CampusTeam[] }) => {
  if (campuses.length === 0) return null;

  return (
    <>
      {campuses.map((team) => (
        <CampusSection key={team.campus._id} team={team} />
      ))}
    </>
  );
};
