import Image from "next/image";
import type { ReactNode } from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import TermsNavigation from "./TermsNavigation";
import { officialTermsMarkdown } from "./official-terms";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "rule" };

type TermsSection = { number: number; title: string; blocks: Block[] };

const parseMarkdown = (markdown: string): Block[] => {
  const blocks: Block[] = [];
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

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const item = line.match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.+)$/);

    if (/^\s*---+\s*$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "rule" });
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
    } else if (item) {
      flushParagraph();
      const ordered = item[2] !== undefined;
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push(item[3]);
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

const inlineToken = new RegExp(
  `(\\*\\*[^*]+\\*\\*|\\*[^*]+\\*|https?:\\/\\/[^\\s)]+|help\\.d4community@gmail\\.com|management\\.d4community@gmail\\.com|www\\.d4community\\.com|Privacy Policy|Code of Conduct)`,
  "g",
);

const renderInline = (text: string, keyPrefix = "inline"): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let index = 0;

  for (const match of text.matchAll(inlineToken)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > cursor) nodes.push(text.slice(cursor, start));

    if (token.startsWith("**") && token.endsWith("**")) {
      const content = token.slice(2, -2);
      nodes.push(<strong key={`${keyPrefix}-${index++}`}>{renderInline(content, keyPrefix)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(<em key={`${keyPrefix}-${index++}`}>{token.slice(1, -1)}</em>);
    } else if (token.includes("@d4community.com") || token.includes("@gmail.com")) {
      nodes.push(<a key={`${keyPrefix}-${index++}`} href={`mailto:${token}`} className="text-[#5ccb5f] underline decoration-[#5ccb5f]/50 underline-offset-4 hover:decoration-[#5ccb5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f]">{token}</a>);
    } else if (token === "Privacy Policy" || token === "Code of Conduct") {
      const href = token === "Privacy Policy" ? "/privacy-policy" : "/code-of-conduct";
      nodes.push(<a key={`${keyPrefix}-${index++}`} href={href} className="text-[#5ccb5f] underline decoration-[#5ccb5f]/50 underline-offset-4 hover:decoration-[#5ccb5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f]">{token}</a>);
    } else {
      const suffix = token.match(/[.,;:!?]+$/)?.[0] ?? "";
      const url = suffix ? token.slice(0, -suffix.length) : token;
      const href = url.startsWith("www.") ? `https://${url}` : url;
      nodes.push(<a key={`${keyPrefix}-${index++}`} href={href} target="_blank" rel="noreferrer" className="break-all text-[#5ccb5f] underline decoration-[#5ccb5f]/50 underline-offset-4 hover:decoration-[#5ccb5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f]">{url}</a>);
      if (suffix) nodes.push(suffix);
    }
    cursor = start + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes.map((node, nodeIndex) => typeof node === "string" ? node : <span key={`${keyPrefix}-wrapped-${nodeIndex}`}>{node}</span>);
};

const renderParagraph = (lines: string[], keyPrefix: string) => (
  <>
    {lines.map((line, index) => (
      <span key={`${keyPrefix}-line-${index}`}>
        {renderInline(line.trimEnd(), `${keyPrefix}-${index}`)}
        {index < lines.length - 1 && (line.endsWith("  ") ? <br /> : " ")}
      </span>
    ))}
  </>
);

const parsedBlocks = parseMarkdown(officialTermsMarkdown);
const preamble: Block[] = [];
const sections: TermsSection[] = [];
const commitment: Block[] = [];
let currentSection: TermsSection | null = null;
let inCommitment = false;

for (const block of parsedBlocks) {
  if (block.type === "heading" && block.level === 2) {
    const match = block.text.match(/^(\d+)\.\s+(.+)$/);
    if (match) {
      inCommitment = false;
      currentSection = { number: Number(match[1]), title: block.text, blocks: [] };
      sections.push(currentSection);
      continue;
    }
  }

  if (block.type === "heading" && block.level === 1 && block.text === "Our Commitment") {
    currentSection = null;
    inCommitment = true;
    commitment.push(block);
    continue;
  }

  if (inCommitment) commitment.push(block);
  else if (currentSection) currentSection.blocks.push(block);
  else preamble.push(block);
}

if (
  sections.length !== 31 ||
  sections.some((section, index) => section.number !== index + 1) ||
  commitment.length === 0
) {
  throw new Error("The approved Terms & Conditions content is incomplete or out of order.");
}

const title = preamble.find((block) => block.type === "heading" && block.text === "Public Terms & Conditions");
const brand = preamble.find((block) => block.type === "heading" && block.text === "D4 Community");
const metadata = preamble.flatMap((block) =>
  block.type === "paragraph"
    ? block.lines.flatMap((line) => {
        const match = line.match(/^\*\*(.+?):\*\*\s*(.+?)\s*$/);
        return match ? [{ label: match[1], value: match[2] }] : [];
      })
    : [],
);

const renderBlocks = (blocks: Block[], keyPrefix: string): ReactNode[] =>
  blocks.map((block, index) => {
    const key = `${keyPrefix}-${block.type}-${index}`;
    if (block.type === "heading") {
      const Tag = block.level >= 3 ? "h3" : "h4";
      return <Tag key={key} className="mb-3 mt-8 scroll-mt-24 text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">{renderInline(block.text, key)}</Tag>;
    }
    if (block.type === "paragraph") {
      return <p key={key} className="mb-5 break-words text-[15px] leading-7 text-foreground/75 sm:text-base sm:leading-8">{renderParagraph(block.lines, key)}</p>;
    }
    if (block.type === "list") {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag key={key} className={`mb-6 space-y-2.5 break-words pl-6 text-[15px] leading-7 text-foreground/75 marker:text-[#5ccb5f]/70 sm:text-base sm:leading-8 ${block.ordered ? "list-decimal" : "list-disc"}`}>
        {block.items.map((item, itemIndex) => <li key={`${key}-item-${itemIndex}`}>{renderInline(item, `${key}-item-${itemIndex}`)}</li>)}
      </Tag>;
    }
    return <hr key={key} className="my-8 border-border/70" />;
  });

const Terms = () => (
  <main id="terms-top" className="min-h-screen scroll-smooth bg-background px-4 py-12 text-foreground motion-reduce:scroll-auto sm:px-6 sm:py-16">
    <header className="relative mx-auto mb-12 max-w-7xl overflow-hidden border-b border-border/70 pb-10 sm:mb-14 sm:pb-14">
      <BackgroundRippleEffect />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(9rem,0.45fr)] lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.62fr)] lg:gap-12 xl:grid-cols-[minmax(0,1.75fr)_minmax(17rem,0.62fr)]">
        <div className="max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-3 border border-border/70 bg-background/80 px-3 py-2 backdrop-blur-sm">
            <Image src="/d4logo_black.webp" alt="D4 Community" width={58} height={40} className="h-8 w-auto object-contain dark:hidden" priority />
            <Image src="/d4logo.webp" alt="D4 Community" width={58} height={40} className="hidden h-8 w-auto object-contain dark:block" priority />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">{brand?.type === "heading" ? brand.text : "D4 Community"}</span>
          </div>

          <h1 className="mb-5 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-7xl">
            {title?.type === "heading" ? title.text : "Public Terms & Conditions"}
          </h1>
          <p className="mb-8 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
            Browse the approved terms below or use the contents to jump to a specific section.
          </p>
          <a href="#terms-content" className="inline-flex min-h-11 items-center gap-3 border border-border bg-background/80 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:border-[#5ccb5f]/55 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f]">
            Explore the Terms <span aria-hidden="true" className="text-[#5ccb5f]">↓</span>
          </a>
        </div>

        <div className="pointer-events-none mx-auto hidden aspect-square w-full max-w-[19rem] md:block md:max-w-full lg:max-w-[19rem]" aria-hidden="true">
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 border border-border/70 bg-background/50 p-3 shadow-[0_24px_80px_-48px_rgba(92,203,95,0.55)] backdrop-blur-sm">
            {Array.from({ length: 9 }, (_, index) => (
              <div key={`brand-cell-${index}`} className={`flex items-center justify-center border border-border/50 ${index === 1 || index === 3 || index === 5 || index === 7 ? "bg-secondary/40" : "bg-background/30"}`}>
                {index === 4 ? (
                  <div className="flex h-full w-full items-center justify-center border border-[#5ccb5f]/40 bg-background/80">
                    <Image src="/d4logo_black.webp" alt="" width={150} height={104} className="h-auto w-4/5 object-contain dark:hidden" />
                    <Image src="/d4logo.webp" alt="" width={150} height={104} className="hidden h-auto w-4/5 object-contain dark:block" />
                  </div>
                ) : index === 1 || index === 3 || index === 5 || index === 7 ? (
                  <span className="h-2 w-2 border border-[#5ccb5f]/60 bg-[#5ccb5f]/15" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-8 grid max-w-7xl gap-2 sm:grid-cols-3">
        {metadata.map((item) => (
          <div key={item.label} className={`${item.label === "Website" ? "border-l-2 border-[#5ccb5f]" : "border-l border-border"} bg-background/80 px-4 py-3 backdrop-blur-sm`}>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{item.label}</p>
            <p className="break-words text-sm font-semibold">{renderInline(item.value, `metadata-${item.label}`)}</p>
          </div>
        ))}
      </div>
    </header>

    <div id="terms-content" className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      <aside aria-label="Terms and Conditions section navigation">
        <TermsNavigation sections={sections.map(({ number, title: sectionTitle }) => ({ number, title: sectionTitle }))} />
      </aside>

      <article className="min-w-0">
        {sections.map((section) => (
          <section key={section.number} id={`terms-section-${section.number}`} data-terms-section className="scroll-mt-24 border-b border-border/60 py-8 first:pt-0 sm:py-10">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <span className="mt-1 shrink-0 font-mono text-xs font-semibold text-[#5ccb5f]">{section.number}.</span>
              <h2 className="min-w-0 break-words text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">{section.title.replace(/^\d+\.\s*/, "")}</h2>
            </div>
            <div>{renderBlocks(section.blocks, `section-${section.number}`)}</div>
          </section>
        ))}

        <section className="mt-10 border-t border-border/70 pt-10 sm:mt-14 sm:pt-14">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/d4logo_black.webp" alt="D4 Community" width={58} height={40} className="h-8 w-auto object-contain dark:hidden" />
            <Image src="/d4logo.webp" alt="D4 Community" width={58} height={40} className="hidden h-8 w-auto object-contain dark:block" />
          </div>
          <div className="max-w-3xl">
            {commitment.map((block, index) => block.type === "heading" ? (
              <h2 key={`commitment-heading-${index}`} className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{renderInline(block.text, "commitment-heading")}</h2>
            ) : renderBlocks([block], `commitment-${index}`))}
          </div>
          <a href="#terms-top" className="mt-6 inline-flex min-h-10 items-center border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ccb5f]">
            Back to top ↑
          </a>
        </section>
      </article>
    </div>
  </main>
);

export default Terms;
