"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import Image from "next/image";
import { volunteersData } from "../data/volunteers";

/* ===================== MARQUEE ROW COMPONENT ===================== */

const MarqueeRow = ({ 
  items, 
  direction = "left", 
  speed = 50 
}: { 
  items: typeof volunteersData, 
  direction?: "left" | "right", 
  speed?: number 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const isHovered = useRef(false);

  // Triple the items to ensure seamless looping without gaps
  const tripledItems = [...items, ...items, ...items];

  const animate = () => {
    if (!scrollRef.current || isHovered.current) return;

    const container = scrollRef.current;
    const maxScroll = container.scrollWidth / 3;
    
    // speed is pixels per second, roughly
    const step = speed / 15; 

    if (direction === "left") {
      positionRef.current -= step;
      if (Math.abs(positionRef.current) >= maxScroll) positionRef.current = 0;
    } else {
      positionRef.current += step;
      if (positionRef.current >= 0) positionRef.current = -maxScroll;
    }

    container.style.transform = `translateX(${positionRef.current}px)`;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Initial position for right-moving row to avoid starting at 0
    if (direction === "right" && scrollRef.current) {
        positionRef.current = -(scrollRef.current.scrollWidth / 3);
    }
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div 
      className="overflow-hidden w-full py-4 select-none"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; animate(); }}
    >
      <div 
        ref={scrollRef} 
        className="flex gap-8 w-max will-change-transform"
      >
        {tripledItems.map((member, index) => (
          <div key={`${member.name}-${index}`} className="flex flex-col items-center gap-3 w-32">
            <div className="relative w-20 h-20 rounded-full bg-secondary overflow-hidden shadow-sm shadow-black/20">
              <Image 
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${member.name}${direction === 'right' ? 'alt' : ''}`} 
                alt={member.name} 
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="text-sm font-semibold text-muted-foreground text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {member.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== MAIN COMPONENT ===================== */

export const Volunteers = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const half = Math.ceil(volunteersData.length / 2);
  const row1 = volunteersData.slice(0, half);
  const row2 = volunteersData.slice(half);

  return (
    <section 
      className="relative w-full py-24 overflow-hidden border-t border-border/50 bg-secondary/5" 
      ref={containerRef}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-[#5ccb5f] uppercase">
             <HeartHandshake className="w-3 h-3" />
             <span>Community</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#5ccb5f]">Volunteers</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Our incredible volunteers who passionately contribute their time and energy to our cause and events.
          </p>
        </motion.div>
      </div>

      <div className="relative w-full">
        {/* Top Fade Gradient */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-20" />
        
        <MarqueeRow items={row1} direction="left" speed={60} />
        <MarqueeRow items={row2} direction="right" speed={50} />
      </div>
    </section>
  );
};