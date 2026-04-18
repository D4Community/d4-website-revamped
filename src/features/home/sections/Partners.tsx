"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ALL_PARTNERS = [
  { id: "v0", name: "v0", logo: "/images/partners/v0w.png", darkLogo: "/images/partners/v0.png" },
  { id: "n8n", name: "n8n", logo: "/images/partners/n8nw.png", darkLogo: "/images/partners/n8n.png" },
  { id: "appwrite", name: "Appwrite", logo: "/images/partners/appwrite.png" },
  { id: "GoogleForDevelopers", name: "Google for Developers", logo: "/images/partners/GoogleForDevelopers.png" },
  { id: "github", name: "GitHub", logo: "/images/partners/githubW.png", darkLogo: "/images/partners/github.png"  },
  { id: "mastra", name: "Mastra", logo: "/images/partners/Mastra.svg", darkLogo: "/images/partners/MastraW.svg"  },
  { id: "requestly", name: "Requestly", logo: "/images/partners/requestly.png" },
  { id: "devfolio", name: "Devfolio", logo: "/images/partners/devfolio.png" },
  { id: "commudle", name: "commudle", logo: "/images/partners/commudle.png" },
  { id: "xyz", name: "XYZ", logo: "/images/partners/xyz.png" },
  { id: "techRbm", name: "TechRBM", logo: "/images/partners/TechRBM.png" },
  { id: "niwi", name: "NIWIAI", logo: "/images/partners/niwi.png" },
  { id: "AppWrk", name: "AppWrk IT Solutions", logo: "/images/partners/appwrk.png" },
  { id: "osen", name: "OSEN", logo: "/images/partners/osen.png" },
  { id: "VentureNest", name: "Venture Nest", logo: "/images/partners/VentureNestW.png", darkLogo: "/images/partners/VentureNest.png" },
  { id: "slay", name: "Slay", logo: "/images/partners/Slay.png" },
];

export function Partners({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 992) setItemsToShow(5);
      else if (width >= 768) setItemsToShow(4);
      else setItemsToShow(ALL_PARTNERS.length);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % Math.ceil(ALL_PARTNERS.length / itemsToShow));
    }, 5000); 
    return () => clearInterval(timer);
  }, [itemsToShow]);

  const currentPartners = ALL_PARTNERS.slice(
    index * itemsToShow,
    (index + 1) * itemsToShow
  );

  return (
    <div className={cn("w-full py-16 md:py-20  overflow-hidden", className)}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* <div className="text-center mb-12">
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
            Our{" "}
            <span className="text-neutral-400">
              {"Partners.".split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h2>
        </div> */}

        <div className="mb-10 md:mb-12 text-center gap-3">
        <div>
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight text-center">
            Our {" "}
            <span className="text-gray-400 dark:text-white/30">Partners.</span>
          </h2>
          <p className="text-base md:text-lg text-neutral-500 max-w-5xl mx-auto py-2 md:py-4 leading-relaxed">
            Trusted partners supporting our community journey
          </p>
        </div>
      </div>

        {/* --- DESKTOP & TABLET VIEW --- */}
        <div className="hidden md:flex relative justify-center items-center w-full min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${index}-${itemsToShow}`}
              className="flex justify-center items-center gap-10 lg:gap-16 w-full"
            >
              {currentPartners.map((partner, i) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                  transition={{
                    duration: 0.3, // Faster transition
                    delay: i * 0.05, // Faster stagger
                    ease: "easeOut"
                  }}
                >
                  <PartnerLogo partner={partner} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- MOBILE VIEW (Marquee) --- */}
        <div className="md:hidden flex w-full">
           <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee flex items-center whitespace-nowrap py-4">
              {ALL_PARTNERS.concat(ALL_PARTNERS).map((partner, idx) => (
                <div key={`${partner.id}-${idx}`} className="mx-8">
                  <PartnerLogo partner={partner} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite; // Slightly faster marquee (20s)
        }
      `}</style>
    </div>
  );
}

function PartnerLogo({ partner }: { partner: typeof ALL_PARTNERS[0] }) {
  return (
    <div className="flex flex-col items-center justify-center group w-28 md:w-32 lg:w-40 flex-shrink-0">
      <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-3">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className={cn(
            "object-contain grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105",
            partner.darkLogo && "dark:hidden"
          )}
        />
        {partner.darkLogo && (
          <Image
            src={partner.darkLogo}
            alt={partner.name}
            fill
            className="hidden dark:block object-contain grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="text-[10px] md:text-xs font-semibold text-neutral-500 dark:text-neutral-400 truncate w-full text-center">
        {partner.name}
      </h3>
    </div>
  );
}