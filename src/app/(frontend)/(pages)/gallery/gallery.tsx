"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  ChevronLeft,
  X,
  Copy,
  Check,
  Filter,
  Camera,
  Calendar,
  Image as ImageIcon,
  ArrowUp,
  MapPin,
  Flame,
  Zap,
  Heart,
} from "lucide-react";

// --- DATA ---
const getOptimizedDriveImageUrl = (fileId: string, width = 800) => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
};

const ALBUMS = [
  {
    link: "https://photos.app.goo.gl/Wib85ubpFdJbZvJj8",
    name: "D4 Moments",
    count: 6,
    images: [
      { id: "h-1", src: getOptimizedDriveImageUrl("1QepStOk3MxZ7iNLQ8VRvwNgAbZKCxFxs"), alt: "Every frame tells a story", width: 600, height: 450 },
      { id: "h-2", src: getOptimizedDriveImageUrl("1vQZdLxUXWXzUwWjn4fWTlRbWGWd4rub5"), alt: "Small moments building bigger things", width: 600, height: 450 },
      { id: "h-3", src: getOptimizedDriveImageUrl("13-3y_84no-tGxP2XAn3noeLf09bWoA4S"), alt: "Discite leads to Develop", width: 600, height: 338 },
      { id: "h-4", src: getOptimizedDriveImageUrl("11KJA0XwNvp40bofD_52wRRmtVZhzUAW-"), alt: "Moments that matter", width: 600, height: 450 },
      { id: "h-5", src: getOptimizedDriveImageUrl("1Z6JYJx-aD5p1lqSMlzF3fbUcyw3jByD7"), alt: "People and passion", width: 600, height: 750 },
      { id: "h-6", src: getOptimizedDriveImageUrl("1plapE6m0LeGFM4i3C2T6T_XVBgrfKP_F"), alt: "Story in every frame", width: 600, height: 338 },
    ],
  },
  {
    link: "https://photos.app.goo.gl/RrAQXnrZ8FuYsbZZA",
    name: "Through the Lens",
    count: 4,
    images: [
      { id: "w-1", src: getOptimizedDriveImageUrl("14tbHWOW6cHWtLqAH3NZB1VPxmmuks8zf"), alt: "D4 Community passion", width: 600, height: 525 },
      { id: "w-2", src: getOptimizedDriveImageUrl("1hvWSqq9HvorawF_1Ge6R8XiuRg4DzQMH"), alt: "D4 Family story", width: 600, height: 375 },
      { id: "w-3", src: getOptimizedDriveImageUrl("1HC7RGt9yPsAMIxUxVNo3mkIBcwaiIJ0b"), alt: "Debug and Deploy", width: 600, height: 675 },
      { id: "w-4", src: getOptimizedDriveImageUrl("1TeG28iv-g0E6no9YhFt5IIQagxf2bW7Z"), alt: "Meaningful moments", width: 600, height: 375 },
    ],
  },
  {
    link: "https://photos.app.goo.gl/rDaR2ApLyi5tDUwM7",
    name: "Our Journey",
    count: 3,
    images: [
      { id: "c-1", src: getOptimizedDriveImageUrl("1XJS93cIPge8AhC4WT2Fh74GScR77OPr-"), alt: "Developing progress", width: 600, height: 488 },
      { id: "c-2", src: getOptimizedDriveImageUrl("1j4N65m3yWapWLq5f45WHy4WtxgVFX1fQ"), alt: "Celebrating community", width: 600, height: 413 },
      { id: "c-3", src: getOptimizedDriveImageUrl("1LbwPQ7LTj4kzquzTmBVFLACAlSCtZj_q"), alt: "D4 Family frame", width: 600, height: 563 },
    ],
  },
];

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  albumName: string;
  albumLink: string;
}

// --- SUB-COMPONENTS ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#fd7d6e] origin-left z-[60]" style={{ scaleX }} />;
};

const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-3 px-6 py-4 bg-secondary/30 rounded-2xl border border-border transition-all hover:bg-secondary/50">
    <div className="p-2 bg-[#fd7d6e]/10 rounded-lg text-[#fd7d6e]">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black leading-none mb-1">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
    <div className="inline-flex p-6 bg-secondary rounded-full mb-4">
      <ImageIcon className="w-12 h-12 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-bold">No images found</h3>
    <p className="text-muted-foreground mb-6">Try selecting a different filter.</p>
    <button onClick={onReset} className="text-[#fd7d6e] font-medium hover:underline">Clear all filters</button>
  </motion.div>
);

// --- MAIN PAGE ---

export default function DetailedGalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [columns, setColumns] = useState(2);
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const allImages = useMemo(() => {
    const flat: GalleryImage[] = [];
    ALBUMS.forEach((album) => {
      album.images.forEach((img) => {
        flat.push({ ...img, albumName: album.name, albumLink: album.link });
      });
    });
    return flat;
  }, []);

  const filteredImages = useMemo(() => 
    filter === "All" ? allImages : allImages.filter(img => img.albumName === filter)
  , [filter, allImages]);

  useEffect(() => {
    const handleEvents = () => {
      setColumns(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4);
      setShowBackToTop(window.scrollY > 400);
    };
    handleEvents();
    window.addEventListener("resize", handleEvents);
    window.addEventListener("scroll", handleEvents);
    return () => {
      window.removeEventListener("resize", handleEvents);
      window.removeEventListener("scroll", handleEvents);
    };
  }, []);

  const masonryColumns = useMemo(() => {
    const cols = Array.from({ length: columns }, () => [] as GalleryImage[]);
    filteredImages.forEach((img, i) => cols[i % columns].push(img));
    return cols;
  }, [filteredImages, columns]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />

      {/* 2. HERO COMPONENT */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-border bg-dot-black/[0.05] dark:bg-dot-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-12"
          >
            <div className="max-w-2xl">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.8] mb-6">
                DISCITE. DEVELOP. <br />
                <span className="text-[#fd7d6e]">DISPLAY.</span> { }
                DEPLOY.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Exploring the intersection of code, creativity, and community. This gallery documents our evolution through every hackathon, meetup, and workshop.
              </p>
            </div>

            {/* RELEVANT CONTEXT CARDS (Replaces generic stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
              <StatCard icon={Flame} label="Community Energy" value="High Impact" />
              <StatCard icon={MapPin} label="Global Footprint" value="Distributed" />
              <StatCard icon={Zap} label="Innovation" value="Always On" />
              <StatCard icon={Heart} label="Vibe Check" value="100% Passion" />
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* 3. FILTER CHIPS COMPONENT */}
        {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter("All")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all border",
                filter === "All" ? "bg-[#fd7d6e] text-white border-[#fd7d6e]" : "bg-background border-border hover:bg-secondary"
              )}
            >
              The Full Stack
            </button>
            {ALBUMS.map((album) => (
              <button
                key={album.name}
                onClick={() => setFilter(album.name)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-bold transition-all border",
                  filter === album.name ? "bg-[#fd7d6e] text-white border-[#fd7d6e]" : "bg-background border-border hover:bg-secondary"
                )}
              >
                {album.name}
              </button>
            ))}
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            Indexing {filteredImages.length} Memories
          </p>
        </div> */}

        {/* 4. MASONRY GRID COMPONENT */}
        {filteredImages.length > 0 ? (
          <div className="flex gap-4 md:gap-6">
            {masonryColumns.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-4 md:gap-6 flex-1">
                {col.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative group cursor-pointer"
                    onClick={() => {
                      setSelectedImage(image);
                      document.body.style.overflow = "hidden";
                    }}
                  >
                    <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-secondary border border-border shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[#fd7d6e]/30">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                         <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                           <span className="text-[10px] uppercase tracking-widest text-[#fd7d6e] font-black">Archive ID: {image.id}</span>
                           <h4 className="text-white font-bold text-lg">{image.albumName}</h4>
                           <p className="text-white/70 text-sm line-clamp-2">{image.alt}</p>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState onReset={() => setFilter("All")} />
        )}
      </main>

      {/* 5. BACK TO TOP COMPONENT */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-[100] p-4 bg-[#fd7d6e] text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-transform"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 6. MODAL LIGHTBOX COMPONENT */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl bg-secondary/50 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => { setSelectedImage(null); document.body.style.overflow = 'auto'; }}
                className="absolute top-6 right-6 z-[120] p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="lg:flex-[2.5] bg-black flex items-center justify-center min-h-[40vh]">
                <Image
                  src={selectedImage.src.replace("sz=w800", "sz=w1600")}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="max-h-[85vh] w-auto object-contain"
                  priority
                />
              </div>

              <div className="lg:flex-1 p-8 md:p-12 flex flex-col justify-center bg-background/50 backdrop-blur-md">
                <div className="space-y-8">
                  <div>
                    <span className="px-3 py-1 bg-[#fd7d6e]/10 text-[#fd7d6e] rounded-full text-xs font-black uppercase tracking-widest">Metadata</span>
                    <h2 className="text-4xl font-black mt-4 tracking-tighter leading-none">{selectedImage.albumName}</h2>
                    <p className="text-muted-foreground mt-4 text-sm font-medium leading-relaxed">{selectedImage.alt}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                      <Calendar className="w-4 h-4 text-[#fd7d6e] mb-2" />
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Timeframe</p>
                      <p className="text-sm font-bold">2024 - 2026</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                      <Camera className="w-4 h-4 text-[#fd7d6e] mb-2" />
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Source</p>
                      <p className="text-sm font-bold">D4 Lens</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-6">
                    <button 
                      onClick={async () => {
                        await navigator.clipboard.writeText(selectedImage.src);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Link Copied" : "Copy Shared URL"}
                    </button>
                    <a 
                      href={selectedImage.albumLink} 
                      target="_blank"
                      className="w-full flex items-center justify-center gap-2 py-4 border border-border hover:bg-secondary rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                    >
                      Browse Source Album <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}