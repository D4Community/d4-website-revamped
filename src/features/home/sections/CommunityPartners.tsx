"use client";

import { useState, useEffect, useRef } from "react";
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
    id: "partner-1",
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    description: "Technology Partner",
  },
  {
    id: "partner-2",
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    description: "Cloud & AI Partner",
  },
  {
    id: "partner-3",
    name: "Amazon Web Services",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    description: "Cloud Infrastructure Partner",
  },
  {
    id: "partner-4",
    name: "GitHub",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    description: "Development Platform Partner",
  },
  {
    id: "partner-5",
    name: "Figma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    description: "Design Tools Partner",
  },
  {
    id: "partner-6",
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    description: "Communication Partner",
  },
  {
    id: "partner-7",
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg",
    description: "Productivity Partner",
  },
  {
    id: "partner-8",
    name: "Vercel",
    logo: "https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/180x180.png",
    description: "Deployment Platform Partner",
  },
  {
    id: "partner-9",
    name: "Tailwind CSS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    description: "Styling Framework Partner",
  },
  {
    id: "partner-10",
    name: "OpenAI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    description: "AI Research Partner",
  },
];

interface CommunityPartnersProps {
  className?: string;
}

export function CommunityPartners({ 
  className 
}: CommunityPartnersProps) {
  const [topLineHovered, setTopLineHovered] = useState(false);
  const [bottomLineHovered, setBottomLineHovered] = useState(false);
  const topLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const topAnimationRef = useRef<number>(0);
  const bottomAnimationRef = useRef<number>(0);
  const topPositionRef = useRef<number>(0);
  const bottomPositionRef = useRef<number>(0);
  const topVelocityRef = useRef<number>(-0.5);
  const bottomVelocityRef = useRef<number>(0.5);
  const lastTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({
    cardWidth: 160,
    cardHeight: 110,
    logoSize: 56,
    gap: 32,
    visibleCount: 4,
  });

  // Smooth easing function
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // Calculate dimensions based on screen size
  const calculateDimensions = () => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    let cardWidth, cardHeight, logoSize, gap, visibleCount;
    
    if (width < 640) {
      // Mobile
      cardWidth = 120;
      cardHeight = 90;
      logoSize = 40;
      gap = 16;
      visibleCount = 3;
    } else if (width < 1024) {
      // Tablet
      cardWidth = 140;
      cardHeight = 100;
      logoSize = 48;
      gap = 24;
      visibleCount = 4;
    } else {
      // Desktop
      cardWidth = 160;
      cardHeight = 110;
      logoSize = 56;
      gap = 32;
      visibleCount = 5;
    }
    
    setDimensions({ cardWidth, cardHeight, logoSize, gap, visibleCount });
  };

  useEffect(() => {
    calculateDimensions();
    const handleResize = () => calculateDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main animation loop
  useEffect(() => {
    let isAnimating = true;
    
    const animate = (currentTime: number) => {
      if (!isAnimating) return;
      
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      
      const topLine = topLineRef.current;
      const bottomLine = bottomLineRef.current;
      
      if (topLine) {
        // Calculate total width for seamless loop
        const totalPartnersWidth = (dimensions.cardWidth + dimensions.gap) * PARTNERS.length;
        
        if (topLineHovered) {
          // Smooth deceleration when hovering
          topVelocityRef.current *= 0.95;
          if (Math.abs(topVelocityRef.current) < 0.01) {
            topVelocityRef.current = 0;
          }
        } else {
          // Smooth acceleration when not hovering
          const targetVelocity = -0.5;
          const acceleration = 0.002;
          
          if (topVelocityRef.current > targetVelocity) {
            topVelocityRef.current = Math.max(targetVelocity, topVelocityRef.current - acceleration * deltaTime);
          } else if (topVelocityRef.current < targetVelocity) {
            topVelocityRef.current = Math.min(targetVelocity, topVelocityRef.current + acceleration * deltaTime);
          }
        }
        
        // Update position
        topPositionRef.current += topVelocityRef.current * (deltaTime / 16);
        
        // Handle seamless loop
        if (topPositionRef.current <= -totalPartnersWidth) {
          topPositionRef.current += totalPartnersWidth;
        }
        if (topPositionRef.current > 0) {
          topPositionRef.current -= totalPartnersWidth;
        }
        
        topLine.style.transform = `translateX(${topPositionRef.current}px)`;
        topLine.style.transition = 'transform 0.1s linear';
      }
      
      if (bottomLine) {
        // Calculate total width for seamless loop
        const totalPartnersWidth = (dimensions.cardWidth + dimensions.gap) * PARTNERS.length;
        
        if (bottomLineHovered) {
          // Smooth deceleration when hovering
          bottomVelocityRef.current *= 0.95;
          if (Math.abs(bottomVelocityRef.current) < 0.01) {
            bottomVelocityRef.current = 0;
          }
        } else {
          // Smooth acceleration when not hovering
          const targetVelocity = 0.5;
          const acceleration = 0.002;
          
          if (bottomVelocityRef.current > targetVelocity) {
            bottomVelocityRef.current = Math.max(targetVelocity, bottomVelocityRef.current - acceleration * deltaTime);
          } else if (bottomVelocityRef.current < targetVelocity) {
            bottomVelocityRef.current = Math.min(targetVelocity, bottomVelocityRef.current + acceleration * deltaTime);
          }
        }
        
        // Update position
        bottomPositionRef.current += bottomVelocityRef.current * (deltaTime / 16);
        
        // Handle seamless loop (reverse direction)
        if (bottomPositionRef.current >= 0) {
          bottomPositionRef.current -= totalPartnersWidth;
        }
        if (bottomPositionRef.current < -totalPartnersWidth) {
          bottomPositionRef.current += totalPartnersWidth;
        }
        
        bottomLine.style.transform = `translateX(${bottomPositionRef.current}px)`;
        bottomLine.style.transition = 'transform 0.1s linear';
      }
      
      topAnimationRef.current = requestAnimationFrame(animate);
      bottomAnimationRef.current = topAnimationRef.current;
    };
    
    topAnimationRef.current = requestAnimationFrame(animate);
    
    return () => {
      isAnimating = false;
      cancelAnimationFrame(topAnimationRef.current);
      cancelAnimationFrame(bottomAnimationRef.current);
    };
  }, [topLineHovered, bottomLineHovered, dimensions]);

  // Duplicate partners for seamless loop
  const getDuplicatedPartners = () => {
    const neededDuplicates = Math.ceil((window.innerWidth * 3) / (dimensions.cardWidth + dimensions.gap));
    const duplicated = [];
    
    for (let i = 0; i < neededDuplicates; i++) {
      duplicated.push(...PARTNERS);
    }
    
    return duplicated;
  };

  const duplicatedPartners = getDuplicatedPartners();

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

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* First Line - Right to Left */}
          <div 
            className="mb-6 md:mb-8 overflow-hidden"
            onMouseEnter={() => setTopLineHovered(true)}
            onMouseLeave={() => setTopLineHovered(false)}
          >
            <div 
              ref={topLineRef}
              className="flex will-change-transform"
              style={{
                gap: `${dimensions.gap}px`,
                width: 'max-content',
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`top-${partner.id}-${index}`}
                  className="flex-shrink-0"
                  style={{
                    width: `${dimensions.cardWidth}px`,
                    height: `${dimensions.cardHeight}px`,
                  }}
                >
                  <div className={cn(
                    "w-full h-full rounded-xl",
                    "bg-white/10 dark:bg-black/10",
                    "backdrop-blur-md",
                    "border border-white/20 dark:border-gray-800/30",
                    "flex flex-col items-center justify-center p-3 md:p-4",
                    "transition-all duration-300",
                    topLineHovered && "bg-white/20 dark:bg-black/20"
                  )}>
                    {/* Logo */}
                    <div 
                      className="relative mb-2"
                      style={{
                        width: `${dimensions.logoSize}px`,
                        height: `${dimensions.logoSize}px`,
                      }}
                    >
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                        sizes={`${dimensions.logoSize}px`}
                        unoptimized
                      />
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-xs md:text-sm font-medium text-center text-gray-900 dark:text-white truncate w-full">
                      {partner.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[10px] md:text-xs text-center text-gray-600 dark:text-gray-400 truncate w-full">
                      {partner.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Line - Left to Right */}
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setBottomLineHovered(true)}
            onMouseLeave={() => setBottomLineHovered(false)}
          >
            <div 
              ref={bottomLineRef}
              className="flex will-change-transform"
              style={{
                gap: `${dimensions.gap}px`,
                width: 'max-content',
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`bottom-${partner.id}-${index}`}
                  className="flex-shrink-0"
                  style={{
                    width: `${dimensions.cardWidth}px`,
                    height: `${dimensions.cardHeight}px`,
                  }}
                >
                  <div className={cn(
                    "w-full h-full rounded-xl",
                    "bg-white/10 dark:bg-black/10",
                    "backdrop-blur-md",
                    "border border-white/20 dark:border-gray-800/30",
                    "flex flex-col items-center justify-center p-3 md:p-4",
                    "transition-all duration-300",
                    bottomLineHovered && "bg-white/20 dark:bg-black/20"
                  )}>
                    {/* Logo */}
                    <div 
                      className="relative mb-2"
                      style={{
                        width: `${dimensions.logoSize}px`,
                        height: `${dimensions.logoSize}px`,
                      }}
                    >
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                        sizes={`${dimensions.logoSize}px`}
                        unoptimized
                      />
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-xs md:text-sm font-medium text-center text-gray-900 dark:text-white truncate w-full">
                      {partner.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[10px] md:text-xs text-center text-gray-600 dark:text-gray-400 truncate w-full">
                      {partner.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-background via-background/90 to-transparent z-10" />
        </div>
      </div>
    </div>
  );
}