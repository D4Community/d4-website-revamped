"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/features/gallery/queries";
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  Shuffle,
  Maximize2,
  Minimize2,
} from "lucide-react";

/* ===================== MAIN COMPONENT ===================== */

export function GallerySection({
  images: sourceImages,
  className,
  showAllLink = true,
}: {
  images: GalleryImage[];
  className?: string;
  showAllLink?: boolean;
}) {
  const [images, setImages] = useState<GalleryImage[]>(sourceImages);
  const [shuffled, setShuffled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Use useMemo to prevent unnecessary recalculations of columns
  const getColumns = (imgList: GalleryImage[], count: number) => {
    const cols: GalleryImage[][] = Array.from({ length: count }, () => []);
    imgList.forEach((img, index) => {
      cols[index % count].push(img);
    });
    return cols;
  };

  const shuffleImages = () => {
    const nextImages = [...images].sort(() => Math.random() - 0.5);
    setImages(nextImages);
    setShuffled(true);
  };

  const resetImages = () => {
    setImages(sourceImages);
    setShuffled(false);
  };

  const handleImageClick = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    setIsExpanded(false);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setCopied(false);
    setIsExpanded(false);
    document.body.style.overflow = "auto";
  };

  const handleDownload = async () => {
    if (!selectedImage) return;
    try {
      const response = await fetch(selectedImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `d4-gallery-${selectedImage.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const shareOnSocial = (platform: string) => {
    if (!selectedImage) return;
    const url = selectedImage.src;
    const text = encodeURIComponent(`Captured at D4: ${selectedImage.title}`);
    const shares: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    window.open(shares[platform], "_blank", "noopener,noreferrer");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (sourceImages.length === 0) return null;

  // Helper to render a column of images for the marquee
  const MarqueeColumn = ({ colImages, reverse = false, className }: { colImages: GalleryImage[], reverse?: boolean, className?: string }) => (
    <div className={cn("col-wrapper flex-1 relative overflow-hidden h-full", className)}>
      <div className={cn(
        "marquee-col flex flex-col gap-5 py-5", 
        reverse ? "animate-down" : "animate-up"
      )}>
        {/* Render three sets for truly seamless infinite loop and to fill height */}
        {[...colImages, ...colImages, ...colImages].map((img, idx) => (
          <div 
            key={`${img.id}-${idx}`} 
            className="relative group cursor-pointer overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 transition-all duration-500 hover:shadow-2xl"
            onClick={() => handleImageClick(img)}
          >
            <Image 
              src={img.src} 
              alt={img.alt} 
              width={img.width} 
              height={img.height} 
              className="w-full h-auto object-cover transition-transform duration-700" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="p-3 bg-white/10 backdrop-blur-xl rounded-full text-white border border-white/20">
                  <Share2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-33.333%); }
          100% { transform: translateY(0); }
        }
        .gallery-mask {
          mask-image: linear-gradient(to bottom, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 8%, black 92%, transparent);
        }
        .animate-up { animation: marquee-up 60s linear infinite; }
        .animate-down { animation: marquee-down 60s linear infinite; }
        .col-wrapper:hover .marquee-col { animation-play-state: paused; }
        
        /* Ensure no layout shift on hover */
        .marquee-col {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>

      <section className={cn("w-full max-w-7xl mx-auto px-4 py-24", className)}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl dark:text-white text-black tracking-tighter">
              Community <span className="text-[#fd7d6e]">Gallery</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md font-medium">
              Moments from our hackathons, workshops, and community gatherings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={shuffled ? resetImages : shuffleImages}
              className="p-3 rounded-full border border-border bg-background hover:bg-accent transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label={shuffled ? "Reset gallery order" : "Shuffle gallery"}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <Link
              href="/gallery"
              className="p-3 rounded-full border border-border bg-[#fd7d6e] hover:bg-accent transition-all duration-300 hover:scale-105 active:scale-95 group"
              aria-label="View full gallery"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Responsive Gallery Layout */}
        <div className="gallery-mask relative h-[600px] md:h-[700px] lg:h-[850px] overflow-hidden">
          
          {/* 4 Columns (Desktop: 993px+) */}
          <div className="hidden lg:flex flex-row gap-5 h-full">
            {getColumns(images, 4).map((col, idx) => (
              <MarqueeColumn key={`lg-${idx}`} colImages={col} reverse={idx % 2 !== 0} />
            ))}
          </div>

          {/* 3 Columns (Tablet: 577px - 992px) */}
          <div className="hidden md:flex lg:hidden flex-row gap-4 h-full">
            {getColumns(images, 3).map((col, idx) => (
              <MarqueeColumn key={`md-${idx}`} colImages={col} reverse={idx % 2 !== 0} />
            ))}
          </div>

          {/* 2 Columns (Mobile: 0px - 576px) */}
          <div className="flex md:hidden flex-row gap-3 h-full">
            {getColumns(images, 2).map((col, idx) => (
              <MarqueeColumn key={`sm-${idx}`} colImages={col} reverse={idx % 2 !== 0} />
            ))}
          </div>
          
        </div>

        {/* BOTTOM CTA BUTTON */}
        {showAllLink && (
          <div className="mt-16 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] 
                         text-white hover:from-[#e56d5e] hover:to-[#ff8a7b] 
                         transition-all duration-300 rounded-full font-bold uppercase tracking-widest
                         shadow-xl hover:shadow-[#fd7d6e]/30 transform hover:-translate-y-1 text-sm md:text-base"
            >
              Explore Full Gallery
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 mt-5 text-xs font-bold uppercase tracking-[0.2em]">
              Step into our world of building
            </p>
          </div>
        )}
      </section>

      {/* MODAL */}
      {/* MODAL */}
      {/* MODAL */}
      {isModalOpen && selectedImage && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 dark:bg-black/95 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className={cn(
                "relative w-full overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-500 ease-in-out",
                isExpanded ? "max-w-6xl h-[73vh]" : "max-w-5xl h-[75vh] md:h-[73vh]",
                "rounded-3xl"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Controls */}
              <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                  onClick={toggleExpand}
                  className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title={isExpanded ? "Show Info" : "Expand Image"}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className={cn(
                  "relative flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/30 transition-all duration-500 ease-in-out",
                  isExpanded ? "w-full h-full p-4 md:p-12" : "w-full md:w-[60%] h-[40%] md:h-full p-6 md:p-10 border-r border-zinc-100 dark:border-zinc-900"
                )}>
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={selectedImage.width}
                    height={selectedImage.height}
                    className={cn(
                      "object-contain w-full h-full rounded-xl transition-transform duration-500",
                      isExpanded ? "scale-100" : "scale-95"
                    )}
                    priority
                  />
                  
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium tracking-wide border border-white/10"
                    >
                      {selectedImage.title}
                    </motion.div>
                  )}
                </div>

                {/* Info Sidebar (Collapsible) */}
                <AnimatePresence>
                  {!isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="w-full md:w-[40%] flex flex-col h-[60%] md:h-full p-6 md:p-10 overflow-y-auto"
                    >
                      <div className="mb-auto">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                          {selectedImage.title}
                        </h3>
                        {selectedImage.description ? (
                          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {selectedImage.description}
                          </p>
                        ) : null}

                        {/* Minimalist Socials - No BG */}
                        <div className="flex items-center gap-6 mt-8">
                          <button onClick={() => shareOnSocial('twitter')} className="text-zinc-400 hover:text-[#1DA1F2] transition-colors">
                            <Twitter className="w-5 h-5" />
                          </button>
                          <button onClick={() => shareOnSocial('facebook')} className="text-zinc-400 hover:text-[#1877F2] transition-colors">
                            <Facebook className="w-5 h-5" />
                          </button>
                          <button onClick={() => shareOnSocial('linkedin')} className="text-zinc-400 hover:text-[#0A66C2] transition-colors">
                            <Linkedin className="w-5 h-5" />
                          </button>
                          <button onClick={handleDownload} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedImage.src);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-xs uppercase tracking-widest transition-transform active:scale-[0.97]"
                        >
                          {copied ? (
                            <><Check className="w-4 h-4" /> Copied</>
                          ) : (
                            <><Copy className="w-4 h-4" /> Copy Link</>
                          )}
                        </button>
                        <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium uppercase tracking-tighter">
                          HD Quality • {selectedImage.width}x{selectedImage.height}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </>
  );
}