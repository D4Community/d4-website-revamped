"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import type { PartnerLogo } from "@/features/partners/queries";

function PartnerCard({ partner }: { partner: PartnerLogo }) {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center w-30 sm:w-35 md:w-40 p-4 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/30 dark:border-gray-800/50">
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            fill
            className="object-contain"
            sizes="56px"
          />
        </div>
        <span className="mt-2 text-xs md:text-sm font-medium text-center text-gray-900 dark:text-white truncate w-full">
          {partner.name}
        </span>
      </div>
    </div>
  );
}

export function CommunityPartners({
  partners,
  className,
}: {
  partners: PartnerLogo[];
  className?: string;
}) {
  if (partners.length === 0) return null;

  const mid = Math.ceil(partners.length / 2);
  const row1 = partners.slice(0, mid);
  const row2 = partners.slice(mid);

  return (
    <div className={cn("w-full py-12 md:py-16", className)}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 md:mb-12 text-center gap-3">
          <div>
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight text-center">
              Community {" "}
              <span className="text-gray-400 dark:text-white/30">Partners.</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 max-w-5xl mx-auto py-2 md:py-4 leading-relaxed">
              Trusted by industry leaders and innovators
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          <InfiniteSlider
            direction="left"
            speed={40}
            pauseOnHover={false}
            showFade
            gap={24}
            className="py-2"
          >
            {row1.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </InfiniteSlider>

          {row2.length > 0 && (
            <InfiniteSlider
              direction="right"
              speed={40}
              pauseOnHover={false}
              showFade
              gap={24}
              className="py-2"
            >
              {row2.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </InfiniteSlider>
          )}
        </div>
      </div>
    </div>
  );
}
