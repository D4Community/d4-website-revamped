import Image from "next/image";
import type { ElementType } from "react";
import {
  Briefcase,
  CheckCircle2,
  Handshake,
  Heart,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import PolicyNavigation from "./PolicyNavigation";
import { officialPolicyMarkdown } from "./official-policy";

type PolicyBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "rule" };

type PolicySection = {
  number: number;
  title: string;
  blocks: PolicyBlock[];
};

const parseMarkdown = (markdown: string): PolicyBlock[] => {
  const lines = markdown.split(/\r?\n/);
  const blocks: PolicyBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", lines: paragraph });
    paragraph = [];
  };

  const flushList = () => {
    if (list) blocks.push({ type: "list", ...list });
    list = null;
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const listItem = line.match(/^\s*([-*]|\d+\.)\s+(.+)$/);

    if (/^\s*---+\s*$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "rule" });
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
    } else if (listItem) {
      flushParagraph();
      const ordered = /^\d+\.$/.test(listItem[1]);
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push(listItem[2]);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
};

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInline = (text: string) =>
  escapeHtml(text)
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /(help\.d4community@gmail\.com|management\.d4community@gmail\.com)/g,
      '<a href="mailto:$1">$1</a>',
    );

const renderParagraph = (lines: string[], forceBreaks = false) =>
  lines
    .map((line, index) => {
      const hardBreak = forceBreaks || / {2,}$/.test(line);
      const content = renderInline(line.trimEnd());
      if (index === lines.length - 1) return content;
      return `${content}${hardBreak ? "<br />" : " "}`;
    })
    .join("");

const blocks = parseMarkdown(officialPolicyMarkdown);
const preamble: PolicyBlock[] = [];
const sections: PolicySection[] = [];
const commitmentBlocks: PolicyBlock[] = [];
let currentSection: PolicySection | null = null;
let inCommitment = false;

for (const block of blocks) {
  if (block.type === "heading" && block.level === 2) {
    const match = block.text.match(/^(\d+)\.\s+(.+)$/);
    if (match) {
      inCommitment = false;
      currentSection = {
        number: Number(match[1]),
        title: block.text,
        blocks: [],
      };
      sections.push(currentSection);
      continue;
    }
  }

  if (block.type === "heading" && block.level === 1 && block.text === "Our Commitment") {
    currentSection = null;
    inCommitment = true;
    commitmentBlocks.push(block);
    continue;
  }

  if (inCommitment) commitmentBlocks.push(block);
  else if (currentSection) currentSection.blocks.push(block);
  else preamble.push(block);
}

if (
  sections.length !== 27 ||
  sections.some((section, index) => section.number !== index + 1) ||
  commitmentBlocks.length === 0
) {
  throw new Error("The official Code of Conduct content is incomplete or out of order.");
}

const groups = [
  { title: "Foundations", from: 1, to: 3 },
  { title: "Community Behaviour", from: 4, to: 10 },
  { title: "Safety and Integrity", from: 11, to: 12 },
  { title: "Events and Participation", from: 13, to: 15 },
  { title: "Reporting and Enforcement", from: 16, to: 21 },
  { title: "Accountability and Commitment", from: 22, to: 27 },
].map((group) => ({
  title: group.title,
  links: sections
    .filter((section) => section.number >= group.from && section.number <= group.to)
    .map(({ number, title }) => ({ number, title })),
}));

const groupStarts = new Set([4, 11, 13, 16, 22]);
const safetySections = new Set([6, 7, 8, 9, 10, 13, 16, 17, 20, 21, 23]);

const renderBlock = (block: PolicyBlock, index: number, sectionNumber?: number) => {
  if (block.type === "heading") {
    const consequence =
      sectionNumber === 20 && block.level === 3
        ? block.text.match(/^(\d+)\.\s+(.+)$/)
        : null;

    if (consequence) {
      return (
        <div key={`heading-${index}`} className="mb-2 mt-6 grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 first:mt-0">
          <span className="flex h-8 w-8 items-center justify-center border border-border font-mono text-xs font-semibold text-[#5ccb5f]">
            {consequence[1]}.
          </span>
          <h3 className="pt-1 text-base font-semibold leading-6 text-foreground sm:text-lg">
            {consequence[2]}
          </h3>
        </div>
      );
    }

    const level = Math.min(block.level, 6);
    const Tag = `h${level}` as ElementType;
    return (
      <Tag
        key={`heading-${index}`}
        className="mb-3 mt-7 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground first:mt-0 sm:text-xl"
        dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
      />
    );
  }

  if (block.type === "paragraph") {
    const text = block.lines.join(" ").trim();
    const isPrimaryEmail = text === "help.d4community@gmail.com" && sectionNumber === 16;
    const isAlternativeEmail =
      text === "management.d4community@gmail.com" && sectionNumber === 16;
    const isReportingLabel =
      (text === "**Primary Reporting Email:**" ||
        text === "**Alternative Reporting Email:**") &&
      sectionNumber === 16;

    return (
      <p
        key={`paragraph-${index}`}
        className={
          isPrimaryEmail
            ? "mb-4 border-l-2 border-[#5ccb5f] bg-secondary/50 px-4 py-3 text-lg font-semibold text-foreground sm:text-xl"
            : isAlternativeEmail
              ? "mb-4 border-l border-border bg-secondary/30 px-4 py-3 text-base font-semibold text-foreground"
              : isReportingLabel
                ? "mb-1 mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                : "mb-4 text-[15px] leading-7 text-foreground/75 sm:text-base sm:leading-8"
        }
        dangerouslySetInnerHTML={{ __html: renderParagraph(block.lines) }}
      />
    );
  }

  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag
        key={`list-${index}`}
        className={`mb-5 space-y-2.5 pl-6 text-[15px] leading-7 text-foreground/75 sm:text-base sm:leading-8 ${
          block.ordered ? "list-decimal" : "list-disc marker:text-[#5ccb5f]/70"
        }`}
      >
        {block.items.map((item, itemIndex) => (
          <li
            key={`item-${itemIndex}`}
            dangerouslySetInnerHTML={{ __html: renderInline(item) }}
          />
        ))}
      </Tag>
    );
  }

  return <hr key={`rule-${index}`} className="my-8 border-border/70" />;
};

const valueIcons: Record<string, ElementType> = {
  Respect: ShieldCheck,
  Inclusion: Users,
  Collaboration: Handshake,
  Professionalism: Briefcase,
  Accountability: CheckCircle2,
  Integrity: Scale,
  "Good Faith": HeartHandshake,
};

const renderValueBlocks = (section: PolicySection) => {
  const rendered: React.ReactNode[] = [];
  const cards: React.ReactNode[] = [];
  let index = 0;

  while (index < section.blocks.length) {
    const heading = section.blocks[index];
    const description = section.blocks[index + 1];
    if (
      heading.type === "heading" &&
      heading.level === 3 &&
      description?.type === "paragraph"
    ) {
      const Icon = valueIcons[heading.text] ?? Heart;
      cards.push(
        <div key={`value-${heading.text}`} className="border border-border/70 bg-card/30 p-4 transition-colors hover:border-[#5ccb5f]/35 sm:p-5 motion-reduce:transition-none">
          <Icon className="mb-4 h-5 w-5 text-[#5ccb5f]" aria-hidden="true" />
          <h3 className="mb-2 text-base font-semibold text-foreground">{heading.text}</h3>
          <p
            className="text-sm leading-6 text-foreground/70"
            dangerouslySetInnerHTML={{ __html: renderParagraph(description.lines) }}
          />
        </div>,
      );
      index += 2;
    } else {
      rendered.push(renderBlock(heading, index, section.number));
      index += 1;
    }
  }

  if (cards.length) {
    rendered.push(
      <div key="community-values" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards}
      </div>,
    );
  }

  return rendered;
};

const CodeOfConduct = () => (
  <main id="page-top" className="min-h-screen scroll-smooth bg-background px-4 py-12 text-foreground motion-reduce:scroll-auto sm:px-6 sm:py-16">
    <header className="relative mx-auto mb-12 max-w-7xl overflow-hidden border-b border-border/70 pb-10 sm:mb-14 sm:pb-14">
      <div className="pointer-events-none absolute right-0 top-8 hidden h-64 w-64 items-center justify-center opacity-70 md:flex" aria-hidden="true">
        <div className="absolute h-52 w-52 border border-border/70" />
        <div className="absolute h-36 w-36 rotate-45 border border-[#5ccb5f]/35" />
        <div className="absolute h-20 w-20 border border-border" />
        <span className="absolute right-6 top-8 h-2 w-2 bg-[#5ccb5f]" />
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-3 border border-border/70 bg-card/40 px-3 py-2">
          <Image src="/d4logo_black.webp" alt="D4 Community" width={58} height={40} className="h-8 w-auto object-contain dark:hidden" priority />
          <Image src="/d4logo.webp" alt="D4 Community" width={58} height={40} className="hidden h-8 w-auto object-contain dark:block" priority />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            D4 Community
          </span>
        </div>

        {preamble.map((block, index) => {
          if (block.type === "heading" && block.level === 1) {
            return (
              <h1
                key={`title-${index}`}
                className="mb-5 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-7xl"
                dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
              />
            );
          }
          return null;
        })}

        <p className="mb-8 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
          D4 Community is committed to creating a respectful, inclusive, safe, and collaborative environment where individuals can learn, contribute, innovate, and grow together.
        </p>

        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          <div className="border-l-2 border-[#5ccb5f] bg-secondary/40 px-4 py-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Organization</p>
            <p className="text-sm font-semibold">D4 Community</p>
          </div>
          <div className="border-l border-border bg-secondary/30 px-4 py-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Effective Date</p>
            <p className="text-sm font-semibold">02 November 2026</p>
          </div>
          <div className="border-l border-border bg-secondary/30 px-4 py-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Applicability</p>
            <p className="text-sm font-semibold">Everyone engaging with D4 Community</p>
          </div>
        </div>

        {preamble.map((block, index) =>
          block.type === "paragraph" ? (
            <p
              key={`metadata-${index}`}
              className="mb-2 font-mono text-[10px] leading-5 tracking-wide text-muted-foreground sm:text-xs"
              dangerouslySetInnerHTML={{ __html: renderParagraph(block.lines, true) }}
            />
          ) : null,
        )}

        <a
          href="#policy-content"
          className="mt-7 inline-flex min-h-11 items-center gap-3 border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[#5ccb5f]/55 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f]"
        >
          Explore the Code
          <span aria-hidden="true" className="text-[#5ccb5f]">↓</span>
        </a>
      </div>
    </header>

    <div id="policy-content" className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      <aside aria-label="Policy section navigation">
        <PolicyNavigation groups={groups} />
      </aside>

      <article className="min-w-0">
        {sections.map((section) => (
          <section
            key={section.number}
            id={`section-${section.number}`}
            data-policy-section
            className={`scroll-mt-24 border-b border-border/60 py-8 first:pt-0 sm:py-10 ${
              groupStarts.has(section.number) ? "mt-4 border-t border-border/70 pt-10 sm:mt-7 sm:pt-12" : ""
            } ${safetySections.has(section.number) ? "border-l-2 border-l-[#5ccb5f]/35 pl-4 sm:pl-6" : ""}`}
          >
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <span className={`mt-1 font-mono text-xs font-semibold ${safetySections.has(section.number) ? "text-[#5ccb5f]" : "text-muted-foreground/70"}`}>
                {section.number}.
              </span>
              <h2 className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
                {section.title.replace(/^\d+\.\s*/, "")}
              </h2>
            </div>
            <div className="space-y-1">
              {section.number === 3
                ? renderValueBlocks(section)
                : section.blocks.map((block, index) => renderBlock(block, index, section.number))}
            </div>
          </section>
        ))}

        <section className="mt-10 border-t border-border/70 pt-10 sm:mt-14 sm:pt-14">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/d4logo_black.webp" alt="D4 Community" width={58} height={40} className="h-8 w-auto object-contain dark:hidden" />
            <Image src="/d4logo.webp" alt="D4 Community" width={58} height={40} className="hidden h-8 w-auto object-contain dark:block" />
          </div>
          <div className="max-w-3xl">
            {commitmentBlocks.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={`commitment-heading-${index}`}
                    className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                  />
                );
              }
              return renderBlock(block, index);
            })}
          </div>
          <a
            href="#page-top"
            className="mt-6 inline-flex min-h-10 items-center border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f]"
          >
            Back to top ↑
          </a>
        </section>
      </article>
    </div>
  </main>
);

export default CodeOfConduct;
