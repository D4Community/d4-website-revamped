"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Image as ImageIcon,
  ArrowUp,
  MapPin,
  Flame,
  Zap,
  Heart,
} from "lucide-react";
import type { GalleryImage } from "@/features/gallery/queries";

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

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
    <div className="inline-flex p-6 bg-secondary rounded-full mb-4">
      <ImageIcon className="w-12 h-12 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-bold">No images yet</h3>
    <p className="text-muted-foreground">Gallery photos will show up here once they are published.</p>
  </motion.div>
);

// --- MAIN PAGE ---

export default function DetailedGalleryPage({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [columns, setColumns] = useState(2);
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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
    images.forEach((img, i) => cols[i % columns].push(img));
    return cols;
  }, [images, columns]);

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
        {images.length > 0 ? (
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
                           <h4 className="text-white font-bold text-lg">{image.title}</h4>
                           {image.description ? (
                             <p className="text-white/70 text-sm line-clamp-2">{image.description}</p>
                           ) : null}
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
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
      {selectedImage && createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
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
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={selectedImage.width}
                  height={selectedImage.height}
                  className="max-h-[85vh] w-auto object-contain"
                  priority
                />
              </div>

              <div className="lg:flex-1 p-8 md:p-12 flex flex-col justify-center bg-background/50 backdrop-blur-md overflow-y-auto">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter leading-none">{selectedImage.title}</h2>
                    {selectedImage.description ? (
                      <p className="text-muted-foreground mt-4 text-sm font-medium leading-relaxed">{selectedImage.description}</p>
                    ) : null}
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
                  </div>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body,
        )}
    </div>
  );
}