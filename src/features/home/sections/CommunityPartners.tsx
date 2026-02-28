"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const PARTNERS: Partner[] = [
  {
    id: "acm-cgcu",
    name: "ACM CGCU",
    logo: "/images/community-partner/acm_cgcu.png",
    description: "Community Partner",
  },
  {
    id: "bud-to-build",
    name: "Bud to Build",
    logo: "/images/community-partner/budtobuild.png",
    description: "Community Partner",
  },
  {
    id: "codezen",
    name: "CodeZen",
    logo: "/images/community-partner/codezen.png",
    description: "Community Partner",
  },
  {
    id: "coding-club-iit-jmu",
    name: "Coding Club IIT Jammu",
    logo: "/images/community-partner/codingclubiitjmu.jpeg",
    description: "Community Partner",
  },
  {
    id: "csquare",
    name: "C Square",
    logo: "/images/community-partner/csquare.png",
    description: "Community Partner",
  },
  {
    id: "cu-updates",
    name: "CU Updates",
    logo: "/images/community-partner/cu_updates.png",
    description: "Community Partner",
  },
  {
    id: "d4",
    name: "D4",
    logo: "/images/community-partner/D.png",
    description: "Community Partner",
  },
  {
    id: "devhive",
    name: "DevHive",
    logo: "/images/community-partner/Devhive.png",
    description: "Community Partner",
  },
  {
    id: "dream-coders",
    name: "Dream Coders",
    logo: "/images/community-partner/dreamcoders.jpg",
    description: "Community Partner",
  },
  {
    id: "encrypt-edge",
    name: "Encrypt Edge",
    logo: "/images/community-partner/encrypt-edge.png",
    description: "Community Partner",
  },
  {
    id: "event-dev-x",
    name: "Event Dev X",
    logo: "/images/community-partner/event_dev_x.png",
    description: "Community Partner",
  },
  {
    id: "ffdg",
    name: "FFDG",
    logo: "/images/community-partner/FFDG.png",
    description: "Community Partner",
  },
  {
    id: "gdg-pec",
    name: "GDG PEC",
    logo: "/images/community-partner/gdg-pec.jpg",
    description: "Community Partner",
  },
  {
    id: "gdg",
    name: "GDG",
    logo: "/images/community-partner/gdg.jpg",
    description: "Community Partner",
  },
  {
    id: "gdgc-sviet",
    name: "GDGoC SVIET",
    logo: "/images/community-partner/gdgc_sviet.png",
    description: "Community Partner",
  },
  {
    id: "gdgoc-tae",
    name: "GDGoC TAE",
    logo: "/images/community-partner/GDGoC-TAE.jpg",
    description: "Community Partner",
  },
  {
    id: "gdgoc-dgil",
    name: "GDGoC DGIL",
    logo: "/images/community-partner/gdgocdgil.png",
    description: "Community Partner",
  },
  {
    id: "gdg-bbdniit-lucknow",
    name: "GDG BBDNIIT Lucknow",
    logo: "/images/community-partner/gdg_bbdniit_lucknow.jpg",
    description: "Community Partner",
  },
  {
    id: "gdg-cgc-coe",
    name: "GDG CGC COE",
    logo: "/images/community-partner/gdg_cgc_coe.png",
    description: "Community Partner",
  },
  {
    id: "gdg-iet-davv",
    name: "GDG IET DAVV",
    logo: "/images/community-partner/gdg_iet_davv.jpeg",
    description: "Community Partner",
  },
  {
    id: "gdg-iiit-kalyani",
    name: "GDG IIIT Kalyani",
    logo: "/images/community-partner/gdg_iiit_kalyani.png",
    description: "Community Partner",
  },
  {
    id: "gdg-indo-global",
    name: "GDG Indo Global College",
    logo: "/images/community-partner/gdg_indo_global_college.jpg",
    description: "Community Partner",
  },
  {
    id: "gdg-mmdu",
    name: "GDG MMDU",
    logo: "/images/community-partner/gdg_mmdu.jpg",
    description: "Community Partner",
  },
  {
    id: "gdg-techno-main",
    name: "GDG Techno",
    logo: "/images/community-partner/gdg_techno_main_salt_lake.jpg",
    description: "Community Partner",
  },
  {
    id: "gic",
    name: "GIC",
    logo: "/images/community-partner/GIC.png",
    description: "Community Partner",
  },
  {
    id: "godc",
    name: "GODC",
    logo: "/images/community-partner/godc.jpg",
    description: "Community Partner",
  },
  {
    id: "gsa-itmbu",
    name: "GSA ITMBU",
    logo: "/images/community-partner/GSA_itmbu.png",
    description: "Community Partner",
  },
  {
    id: "hackhalt",
    name: "HackHalt",
    logo: "/images/community-partner/hackhalt.jpeg",
    description: "Community Partner",
  },
  {
    id: "ica",
    name: "ICA",
    logo: "/images/community-partner/ica.jpg",
    description: "Community Partner",
  },
  {
    id: "ieee-cgcu",
    name: "IEEE CGCU",
    logo: "/images/community-partner/IEEE_CGCU.jpeg",
    description: "Community Partner",
  },
  {
    id: "innovatex",
    name: "InnovateX",
    logo: "/images/community-partner/innovatex.jpg",
    description: "Community Partner",
  },
  {
    id: "iste-cgcu",
    name: "ISTE CGCU",
    logo: "/images/community-partner/iste_cgcu.jpg",
    description: "Community Partner",
  },
  {
    id: "kailshians",
    name: "Kailshians",
    logo: "/images/community-partner/kailshians.png",
    description: "Community Partner",
  },
  {
    id: "mern-matrix",
    name: "MERN Matrix",
    logo: "/images/community-partner/mern_matrix.png",
    description: "Community Partner",
  },
  {
    id: "node-zero",
    name: "Node Zero",
    logo: "/images/community-partner/node_zero.png",
    description: "Community Partner",
  },
  {
    id: "nv",
    name: "NV",
    logo: "/images/community-partner/nv.jpg",
    description: "Community Partner",
  },
  {
    id: "off-sec-diary",
    name: "Off Sec Diary",
    logo: "/images/community-partner/off_sec_diary.png",
    description: "Community Partner",
  },
  {
    id: "open-source-chandigarh",
    name: "Open Source Chandigarh",
    logo: "/images/community-partner/open_source_chandigarh.png",
    description: "Community Partner",
  },
  {
    id: "papaya-coders",
    name: "Papaya Coders",
    logo: "/images/community-partner/papapya_coders.png",
    description: "Community Partner",
  },
  {
    id: "react-rajasthan",
    name: "React Rajasthan",
    logo: "/images/community-partner/react_rajasthan.png",
    description: "Community Partner",
  },
  {
    id: "react-kolkata",
    name: "React Kolkata",
    logo: "/images/community-partner/reac_kolkate.png",
    description: "Community Partner",
  },
  {
    id: "shadow-script",
    name: "Shadow Script",
    logo: "/images/community-partner/shadow_script.png",
    description: "Community Partner",
  },
  {
    id: "shebuilds",
    name: "SheBuilds",
    logo: "/images/community-partner/shebuilds.jpg",
    description: "Community Partner",
  },
  {
    id: "tensorik",
    name: "Tensorik",
    logo: "/images/community-partner/tensorik.png",
    description: "Community Partner",
  },
  {
    id: "the-dev-army",
    name: "The Dev Army",
    logo: "/images/community-partner/thedevarmy.png",
    description: "Community Partner",
  },
  {
    id: "the-uniques",
    name: "The Uniques",
    logo: "/images/community-partner/theuniques.png",
    description: "Community Partner",
  },
  {
    id: "the-seed-club",
    name: "The Seed Club",
    logo: "/images/community-partner/the_seed_club.jpg",
    description: "Community Partner",
  },
  {
    id: "wiztron",
    name: "Wiztron",
    logo: "/images/community-partner/wiztron.png",
    description: "Community Partner",
  },
  {
    id: "yatu",
    name: "YATU",
    logo: "/images/community-partner/YATU.png",
    description: "Community Partner",
  },
  {
    id: "zenyukti",
    name: "Zenyukti",
    logo: "/images/community-partner/zenyukti.png",
    description: "Community Partner",
  },
];

interface CommunityPartnersProps {
  className?: string;
}

// Split into two rows
const ROW_1 = PARTNERS.slice(0, Math.ceil(PARTNERS.length / 2));
const ROW_2 = PARTNERS.slice(Math.ceil(PARTNERS.length / 2));

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center w-30 sm:w-35 md:w-40  p-4 rounded-2xl backdrop-blur-2xl bg-linear-to-br from-white/10 via-white/5 to-white/0 dark:from-black/10 dark:via-black/5 dark:to-black/0 border border-white/30 dark:border-gray-800/50 transition-all duration-500 ease-out">
      <div className="flex flex-col items-center"
      >
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            fill
            className="object-contain"
            sizes="56px"
            unoptimized
          />
        </div>
      <span className="mt-2 text-xs md:text-sm font-medium text-center text-gray-900 dark:text-white truncate w-full">
        {partner.name}
      </span>
      </div>
    </div>
  );
}

export function CommunityPartners({ className }: CommunityPartnersProps) {
  return (
    <div className={cn("w-full py-12 md:py-16", className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Community Partners
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Trusted by industry leaders and innovators
          </p>
        </div>

        {/* Two‑row slider */}
        <div className="flex flex-col gap-6 md:gap-8">
          <InfiniteSlider
            direction="left"
            speed={40}
            showFade
            gap={24}
            autoMeasure
            className="py-2"
          >
            {ROW_1.map((p) => (
              <PartnerCard key={p.id} partner={p} />
            ))}
          </InfiniteSlider>

          <InfiniteSlider
            direction="right"
            speed={40}
            showFade
            gap={24}
            autoMeasure
            className="py-2"
          >
            {ROW_2.map((p) => (
              <PartnerCard key={p.id} partner={p} />
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </div>
  );
}