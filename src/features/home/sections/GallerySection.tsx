"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  ExternalLink, 
  Shuffle, 
  ChevronRight, 
  X, 
  Share2, 
  Download,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Maximize2,
} from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  albumName: string;
  albumLink: string;
}

// Optimized helper function for Google Drive images with lower resolution
const getOptimizedDriveImageUrl = (fileId: string, width = 600) => {
  // Use optimized thumbnail URL with specific width for better performance
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
};

// Google Photos album links and sample images with optimized sizes
const ALBUMS = [
  {
    link: "https://photos.app.goo.gl/Wib85ubpFdJbZvJj8",
    name: "D4 Moments",
    images: [
      {
        id: "hackathon-1",
        src: getOptimizedDriveImageUrl("1QepStOk3MxZ7iNLQ8VRvwNgAbZKCxFxs", 600),
        alt: "Every frame tells a story of our D4 family",
        width: 600,
        height: 450,
      },
      {
        id: "hackathon-2",
        src: getOptimizedDriveImageUrl("1vQZdLxUXWXzUwWjn4fWTlRbWGWd4rub5", 600),
        alt: "Small moments that quietly build something bigger",
        width: 600,
        height: 450,
      },
      {
        id: "hackathon-3",
        src: getOptimizedDriveImageUrl("13-3y_84no-tGxP2XAn3noeLf09bWoA4S", 600),
        alt: "Where Discite leads to Develop, Debug, and Deploy",
        width: 600,
        height: 338,
      },
      {
        id: "hackathon-4",
        src: getOptimizedDriveImageUrl("1iH5lWFI_u5MaHz0Op2QHtqKwA7UQFskT", 600),
        alt: "Moments that matter",
        width: 600,
        height: 450,
      },
      {
        id: "hackathon-5",
        src: getOptimizedDriveImageUrl("1Z6JYJx-aD5p1lqSMlzF3fbUcyw3jByD7", 600),
        alt: "A canvas of people and passion",
        width: 600,
        height: 750,
      },
      {
        id: "hackathon-6",
        src: getOptimizedDriveImageUrl("1plapE6m0LeGFM4i3C2T6T_XVBgrfKP_F", 600),
        alt: "Every frame holds a story",
        width: 600,
        height: 338,
      },
    ],
  },
  {
    link: "https://photos.app.goo.gl/RrAQXnrZ8FuYsbZZA",
    name: "Through the D4 Lens",
    images: [
      {
        id: "workshop-1",
        src: getOptimizedDriveImageUrl("14tbHWOW6cHWtLqAH3NZB1VPxmmuks8zf", 600),
        alt: "Celebrating the people and passion that make up our D4 community",
        width: 600,
        height: 525,
      },
      {
        id: "workshop-2",
        src: getOptimizedDriveImageUrl("1hvWSqq9HvorawF_1Ge6R8XiuRg4DzQMH", 600),
        alt: "Every frame tells a story of our D4 family",
        width: 600,
        height: 375,
      },
      {
        id: "workshop-3",
        src: getOptimizedDriveImageUrl("1m9M0iEyjVjNLW38mfsaPR1oV2jn0zQgl", 600),
        alt: "Where Discite leads to Develop, Debug, and Deploy",
        width: 600,
        height: 675,
      },
      {
        id: "workshop-4",
        src: getOptimizedDriveImageUrl("1TeG28iv-g0E6no9YhFt5IIQagxf2bW7Z", 600),
        alt: "Moments that matter",
        width: 600,
        height: 375,
      },
      {
        id: "workshop-5",
        src: getOptimizedDriveImageUrl("1Hmx2qNyWo-cEefNWP_TO9iN6k2JQ_He0", 600),
        alt: "A canvas of people and passion",
        width: 600,
        height: 675,
      },
      {
        id: "workshop-6",
        src: getOptimizedDriveImageUrl("11qNevKLHwwe58PXewxGo5bz4poLxUleH", 600),
        alt: "Where ideas find people, and moments find meaning",
        width: 600,
        height: 675,
      },
    ],
  },
  {
    link: "https://photos.app.goo.gl/rDaR2ApLyi5tDUwM7",
    name: "Our journey",
    images: [
      {
        id: "community-1",
        src: getOptimizedDriveImageUrl("1XJS93cIPge8AhC4WT2Fh74GScR77OPr-", 600),
        alt: "Where Discite leads to Develop, Debug, and Deploy",
        width: 600,
        height: 488,
      },
      {
        id: "community-2",
        src: getOptimizedDriveImageUrl("1j4N65m3yWapWLq5f45WHy4WtxgVFX1fQ", 600),
        alt: "Celebrating the people and passion that make up our D4 community",
        width: 600,
        height: 413,
      },
      {
        id: "community-3",
        src: getOptimizedDriveImageUrl("1LbwPQ7LTj4kzquzTmBVFLACAlSCtZj_q", 600),
        alt: "Every frame tells a story of our D4 family",
        width: 600,
        height: 563,
      },
      {
        id: "community-4",
        src: getOptimizedDriveImageUrl("1ya71AecbxMZiwTv3ol8peR0pgLNy2PZw", 600),
        alt: "Moments that matter",
        width: 600,
        height: 488,
      },
      {
        id: "community-5",
        src: getOptimizedDriveImageUrl("1u96Il8AWXiyCVnOJqje6ZRC1yTvsWW7x", 600),
        alt: "A canvas of people and passion",
        width: 600,
        height: 413,
      },
      {
        id: "community-6",
        src: getOptimizedDriveImageUrl("1HC7RGt9yPsAMIxUxVNo3mkIBcwaiIJ0b", 600),
        alt: "More than code",
        width: 600,
        height: 563,
      },
    ],
  },
  {
    link: "https://photos.app.goo.gl/NZfTe2TjWo8bc23M8",
    name: "D4 in Focus",
    images: [
      {
        id: "special-1",
        src: getOptimizedDriveImageUrl("1WOc7srIdU76qvQBw1i6uD7Jjta20jHCs", 600),
        alt: "Moments that matter",
        width: 600,
        height: 500,
      },
      {
        id: "special-2",
        src: getOptimizedDriveImageUrl("1kgd6WGgSZKOJVKflA4zuAH2YAOHpjYcx", 600),
        alt: "Where Discite leads to Develop, Debug, and Deploy",
        width: 600,
        height: 638,
      },
      {
        id: "special-3",
        src: getOptimizedDriveImageUrl("1DDUygBu_449jEke1kkc3NZfcqZAhl6XL", 600),
        alt: "Celebrating the people and passion that make up our D4 community",
        width: 600,
        height: 338,
      },
      {
        id: "special-4",
        src: getOptimizedDriveImageUrl("1E3BcsP5y2qJRA3diOYCYdCeKgjvxLVLD", 600),
        alt: "A journey shaped by people, passion, and progress",
        width: 600,
        height: 638,
      },
      {
        id: "special-5",
        src: getOptimizedDriveImageUrl("11KJA0XwNvp40bofD_52wRRmtVZhzUAW-", 600),
        alt: "A canvas of people and passion",
        width: 600,
        height: 360,
      },
      {
        id: "special-6",
        src: getOptimizedDriveImageUrl("1JFCp_vyFkJoVF7Oe7FhOSZgsSG9brSHQ", 600),
        alt: "Shared moments from a journey we’re building together",
        width: 600,
        height: 360,
      },
    ],
  },
];

export interface GallerySectionProps {
  className?: string;
  showAllLink?: boolean;
}

export function GallerySection({ className, showAllLink = true }: GallerySectionProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [shuffled, setShuffled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [columns, setColumns] = useState(2);

  // Check for screen size and set columns accordingly
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setColumns(2);
      } else if (width < 768) {
        setColumns(2);
      } else if (width < 1024) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Initialize images from albums
  useEffect(() => {
    const allImages: GalleryImage[] = [];
    
    ALBUMS.forEach((album) => {
      album.images.forEach((img) => {
        allImages.push({
          ...img,
          albumName: album.name,
          albumLink: album.link,
        });
      });
    });

    setImages(allImages);
  }, []);

  const shuffleImages = () => {
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);
    setImages(shuffledImages);
    setShuffled(!shuffled);
  };

  const resetImages = () => {
    const allImages: GalleryImage[] = [];
    
    ALBUMS.forEach((album) => {
      album.images.forEach((img) => {
        allImages.push({
          ...img,
          albumName: album.name,
          albumLink: album.link,
        });
      });
    });

    setImages(allImages);
    setShuffled(false);
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setCopied(false);
    document.body.style.overflow = "auto";
  };

  const handleDownload = async () => {
    if (!selectedImage) return;
    
    try {
      // For Google Drive images, we need to use the proper download URL
      const driveId = selectedImage.src.split('id=')[1]?.split('&')[0];
      const downloadUrl = driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : selectedImage.src;
      
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `community-gallery-${selectedImage.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const copyToClipboard = async () => {
    if (!selectedImage) return;
    
    try {
      await navigator.clipboard.writeText(selectedImage.src);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const shareOnSocial = (platform: string) => {
    if (!selectedImage) return;
    
    const text = `Check out this photo from our Community Gallery: ${selectedImage.alt}`;
    const url = selectedImage.src;
    const hashtags = "CommunityGallery #Hackathon #Workshop";
    
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  // Create tight masonry columns
  const columnImages = Array.from({ length: columns }, () => [] as GalleryImage[]);

  // Distribute images across columns for tight masonry effect
  images.forEach((image, index) => {
    columnImages[index % columns].push(image);
  });

  return (
    <>
      <div className={cn("w-full max-w-6xl mx-auto px-4 py-16 md:py-24", className)}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
              Community Gallery
            </h2>
            <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
              Moments from our hackathons, workshops, and community gatherings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={shuffled ? resetImages : shuffleImages}
              className="flex items-center gap-2 px-2 py-2 rounded-3xl border border-border bg-background hover:bg-accent transition-colors text-sm font-medium"
            >
              <Shuffle className="w-4 h-4" />
              {/* {shuffled ? "Reset" : "Shuffle"} */}
            </button>

            {showAllLink && (
              <Link
                href="/gallery"
                className="flex items-center gap-1 px-2 py-2 rounded-3xl bg-[#fd7d6e] text-white hover:bg-[#e56d5e] transition-colors text-sm font-medium group"
              >
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Tight Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {columnImages.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-2 md:gap-3">
              {column.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <div className="aspect-auto">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized={true}
                        loading="lazy"
                      />
                    </div>

                    {/* Hover Overlay with Single Share Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(image);
                        }}
                      >
                        <Share2 className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                      </motion.button>
                    </div>

                    {/* Album Name Badge */}
                    <div className="absolute bottom-1.5 left-1.5 md:bottom-2 md:left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-black/60 text-white rounded-full backdrop-blur-sm">
                        {image.albumName}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* View More on Mobile */}
        {showAllLink && (
          <div className="mt-8 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#fd7d6e] text-white hover:bg-[#e56d5e] transition-colors rounded-4xl font-medium"
            >
              View All Photos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Responsive Centered Modal with 74vh max-height */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            {/* Modal Content - Max 74vh */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            >
              <div className="relative w-full max-w-6xl mx-auto max-h-[74vh] flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 z-50 p-2 bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/30 text-white dark:text-gray-900 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Image Section */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden min-h-0 relative">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        width={selectedImage.width}
                        height={selectedImage.height}
                        className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg md:rounded-xl"
                        sizes="(max-width: 768px) 90vw, 60vw"
                        priority={true}
                        unoptimized={true}
                      />
                      
                      {/* View Album Button - Centered at Bottom */}
                      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Link
                          href={selectedImage.albumLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm 
                                   border border-white/20 text-white rounded-xl hover:bg-white/20 
                                   transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm font-medium">View Album</span>
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Info & Share Panel */}
                <div className="w-full md:w-[40%] lg:w-[35%] border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {/* Image Info */}
                    <div className="mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedImage.albumName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {selectedImage.alt}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {selectedImage.width} × {selectedImage.height}px
                      </div>
                    </div>

                    {/* Share Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Share this image
                      </h4>

                      {/* Single Line Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Twitter */}
                        <button
                          onClick={() => shareOnSocial("twitter")}
                          title="Share on Twitter"
                          className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Twitter className="w-4 h-4" />
                        </button>

                        {/* Facebook */}
                        <button
                          onClick={() => shareOnSocial("facebook")}
                          title="Share on Facebook"
                          className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Facebook className="w-4 h-4" />
                        </button>

                        {/* LinkedIn */}
                        <button
                          onClick={() => shareOnSocial("linkedin")}
                          title="Share on LinkedIn"
                          className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Linkedin className="w-4 h-4" />
                        </button>

                        {/* Divider */}
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

                        {/* Download */}
                        <button
                          onClick={handleDownload}
                          title="Download Image"
                          className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Copy */}
                        <button
                          onClick={copyToClipboard}
                          title="Copy Image Link"
                          className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Full Album Link */}
                    {/* <Link
                      href={selectedImage.albumLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#fd7d6e] hover:bg-[#e56d5e] text-white rounded-xl transition-colors duration-200 text-sm font-medium"
                    >
                      <Maximize2 className="w-4 h-4" />
                      View Full Album
                    </Link> */}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}