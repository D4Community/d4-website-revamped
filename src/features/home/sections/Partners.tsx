"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const PARTNERS: Partner[] = [
  {
    id: "ml-chandigarh",
    name: "ML Chandigarh",
    logo: "/images/partners/ML Chandigarh.png",
    description: "Partner",
  },
  {
    id: "osen",
    name: "OSEN",
    logo: "/images/partners/osen.png",
    description: "Partner",
  },
  {
    id: "requestly",
    name: "Requestly",
    logo: "/images/partners/requestly.png",
    description: "Partner",
  },
  {
    id: "bharatxr",
    name: "BharatXR",
    logo: "/images/partners/bharatxr.png",
    description: "Partner",
  },
  {
    id: "slay",
    name: "Slay",
    logo: "/images/partners/Slay.png",
    description: "Partner",
  },
];

interface PartnersProps {
  className?: string;
}

export function Partners({ className }: PartnersProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className={cn("w-full py-16 md:py-20", className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Partners
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Trusted by industry leaders and innovators
          </p>
        </div>

        {/* First Row - Partners 1-5 */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
            {PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="shrink-0"
                onMouseEnter={() => setHoveredCard(partner.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={cn(
                    "w-36 md:w-44 lg:w-52 xl:w-56",
                    "rounded-2xl",
                    "backdrop-blur-xl",
                    "bg-gradient-to-br",
                    "from-white/10 via-white/5 to-white/0",
                    "dark:from-black/10 dark:via-black/5 dark:to-black/0",
                    "border",
                    "border-white/30 dark:border-gray-800/50",
                    "flex flex-col items-center justify-center p-4 md:p-5 lg:p-6",
                    "transition-all duration-500 ease-out",
                    "relative",
                    "overflow-hidden",
                    "group",
                    hoveredCard === partner.id
                      ? "scale-105 bg-white/20 dark:bg-black/20 shadow-lg"
                      : "scale-100",
                  )}
                >
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent dark:from-black/5" />

                  {/* Logo Container */}
                  <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 mb-2 z-10">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      className="object-contain transition-all duration-500"
                      sizes="(max-width: 768px) 56px, 64px"
                    />
                  </div>

                  {/* Partner Name */}
                  <h3
                    className={cn(
                      "text-sm md:text-base font-medium text-center",
                      "text-gray-900 dark:text-white",
                      "truncate w-full z-10",
                      "transition-all duration-500",
                      hoveredCard === partner.id &&
                        "text-gray-800 dark:text-gray-100",
                    )}
                  >
                    {partner.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "text-xs md:text-sm text-center",
                      "text-gray-600 dark:text-gray-400",
                      "truncate w-full z-10",
                      "transition-all duration-500",
                      hoveredCard === partner.id &&
                        "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {partner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
