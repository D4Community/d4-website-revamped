"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type TermsLink = { number: number; title: string };

export default function TermsNavigation({ sections }: { sections: TermsLink[] }) {
  const [activeId, setActiveId] = useState(`terms-section-${sections[0]?.number ?? 1}`);
  const mobileNavigationRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-terms-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (active) setActiveId(active.target.id);
      },
      { rootMargin: "-15% 0px -72% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const renderLinks = () => (
    <ol className="space-y-0.5">
      {sections.map(({ number, title }) => {
        const id = `terms-section-${number}`;
        const active = activeId === id;
        return (
          <li key={number}>
            <a
              href={`#${id}`}
              aria-current={active ? "location" : undefined}
              onClick={() => {
                if (mobileNavigationRef.current) mobileNavigationRef.current.open = false;
              }}
              className={`flex min-h-9 items-start gap-2 break-words rounded-sm px-2 py-2 text-xs leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f] ${
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <span className={`shrink-0 font-mono text-[10px] ${active ? "text-[#5ccb5f]" : "text-muted-foreground/70"}`}>
                {String(number).padStart(2, "0")}
              </span>
              <span>{title.replace(/^\d+\.\s*/, "")}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <details ref={mobileNavigationRef} className="group mb-8 border-y border-border py-3 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f] [&::-webkit-details-marker]:hidden">
          Table of contents
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <nav aria-label="Terms and Conditions sections" className="max-h-[60vh] overflow-y-auto pt-4">
          {renderLinks()}
        </nav>
      </details>

      <nav
        aria-label="Terms and Conditions sections"
        className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 lg:block"
      >
        <h2 className="mb-3 px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Table of contents
        </h2>
        {renderLinks()}
      </nav>
    </>
  );
}
