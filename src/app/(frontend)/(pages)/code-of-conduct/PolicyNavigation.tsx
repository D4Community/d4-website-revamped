"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";

type PolicyLink = { number: number; title: string };
type PolicyGroup = { title: string; links: PolicyLink[] };

const groupIcons = [BookOpen, Users, ShieldCheck, CalendarDays, CheckCircle2, HeartHandshake];

export default function PolicyNavigation({ groups }: { groups: PolicyGroup[] }) {
  const firstSection = groups[0]?.links[0]?.number ?? 1;
  const [activeId, setActiveId] = useState(`section-${firstSection}`);
  const mobileNavRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-policy-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -72% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navigateTo = (event: MouseEvent<HTMLAnchorElement>, number: number) => {
    const target = document.getElementById(`section-${number}`);
    if (!target) return;

    event.preventDefault();
    setActiveId(target.id);
    if (mobileNavRef.current) mobileNavRef.current.open = false;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${target.id}`);
  };

  const renderGroups = () =>
    groups.map((group, groupIndex) => {
      const Icon = groupIcons[groupIndex] ?? BookOpen;
      return (
        <div key={group.title} className="mb-5 last:mb-0">
          <h3 className="mb-2 flex items-center gap-2 px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {group.title}
          </h3>
          <ul className="space-y-0.5">
            {group.links.map((link) => {
              const id = `section-${link.number}`;
              const active = activeId === id;
              return (
                <li key={link.number}>
                  <a
                    href={`#${id}`}
                    onClick={(event) => navigateTo(event, link.number)}
                    aria-current={active ? "location" : undefined}
                    className={`flex min-h-9 items-start gap-2 rounded-sm px-2 py-2 text-xs leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f] ${
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    <span className={`shrink-0 font-mono text-[10px] ${active ? "text-[#5ccb5f]" : "text-muted-foreground/70"}`}>
                      {String(link.number).padStart(2, "0")}
                    </span>
                    <span>{link.title.replace(/^\d+\.\s*/, "")}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      );
    });

  return (
    <>
      <details
        ref={mobileNavRef}
        className="group mb-8 border-y border-border py-3 lg:hidden"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f] [&::-webkit-details-marker]:hidden">
          Explore sections
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <nav aria-label="Code of Conduct sections" className="max-h-[60vh] overflow-y-auto pt-4">
          {renderGroups()}
        </nav>
      </details>

      <nav
        aria-label="Code of Conduct sections"
        className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 lg:block"
      >
        {renderGroups()}
      </nav>
    </>
  );
}
