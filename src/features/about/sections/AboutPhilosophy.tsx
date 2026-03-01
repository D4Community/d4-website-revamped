"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Blocks, 
  Cpu, 
  ScanSearch, 
  Globe2, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; 

const items = [
  {
    id: 1,
    title: "Discrete",
    short: "Logic",
    icon: Blocks,
    color: "#6d9eeb", // Blue
    description: "The D4 philosophy starts here. We break complex problems into atomic, discrete units. Mastering decomposition is key to scalable architecture.",
    tags: ["System Design", "Atomic Logic", "Modular"]
  },
  {
    id: 2,
    title: "Develop",
    short: "Build",
    icon: Cpu,
    color: "#5ccb5f", // Green
    description: "Builders at heart. We foster clean, self-documenting code. Whether frontend or backend, we emphasize modern stacks and craftsmanship.",
    tags: ["Clean Code", "Modern Stack", "Open Source"]
  },
  {
    id: 3,
    title: "Debug",
    short: "Refine",
    icon: ScanSearch,
    color: "#f6b26b", // Orange
    description: "Bugs are learning opportunities. We treat debugging as a collaborative detective game, turning edge cases into resilient features.",
    tags: ["Peer Review", "Resilience", "Root Cause"]
  },
  {
    id: 4,
    title: "Deploy",
    short: "Ship",
    icon: Globe2,
    color: "#a2c4c9", // Teal
    description: "Code has no value until it reaches the user. We demystify the path to production, teaching CI/CD pipelines and global strategies.",
    tags: ["CI/CD", "DevOps", "Global Scale"]
  }
];

export default function D4ExpandingAbout() {
  const [activeId, setActiveId] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll Logic (5 Seconds)
  useEffect(() => {
    if (!isAutoPlaying) return;

    intervalRef.current = setInterval(() => {
      setActiveId((prev) => (prev === items.length ? 1 : prev + 1));
    }, 5000); 

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, activeId]);

  const handleManualChange = (id: number) => {
    setActiveId(id);
    setIsAutoPlaying(false); 
  };

  const handleNext = () => {
    setActiveId((prev) => (prev === items.length ? 1 : prev + 1));
    setIsAutoPlaying(false);
  };

  const handlePrev = () => {
    setActiveId((prev) => (prev === 1 ? items.length : prev - 1));
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative w-full py-16 bg-background overflow-hidden transition-colors duration-300">

      <div className="container relative mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
          <div className="space-y-3 max-w-2xl">
             <div className="inline-block px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                The D4 Methodology
             </div>
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Built for the <span className="text-primary">Community</span>
             </h2>
             <p className="text-muted-foreground text-sm md:text-base max-w-lg">
                An end-to-end ecosystem covering the entire lifecycle of modern software engineering.
             </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button 
                variant="outline" size="icon" onClick={handlePrev} 
                className="rounded-full hover:bg-secondary w-8 h-8"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button 
                variant="ghost" size="icon" 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="rounded-full w-8 h-8 text-muted-foreground"
            >
                {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>

            <Button 
                variant="outline" size="icon" onClick={handleNext} 
                className="rounded-full hover:bg-secondary w-8 h-8"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* --- Expanding Cards (Compact Height: 400px) --- */}
        <div 
            className="flex flex-col lg:flex-row gap-3 h-[550px] lg:h-[400px] w-full"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {items.map((item) => {
            const isActive = activeId === item.id;
            
            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => handleManualChange(item.id)}
                initial={false}
                animate={{
                   flex: isActive ? 3 : 1,
                }}
                transition={{ 
                   type: "spring", 
                   stiffness: 250, 
                   damping: 25 
                }}
                className={cn(
                  "relative group cursor-pointer overflow-hidden rounded-2xl border transition-colors duration-500",
                  isActive 
                    ? "border-border shadow-lg bg-card" 
                    : "border-transparent bg-secondary/20 hover:bg-secondary/40"
                )}
                style={{
                    borderColor: isActive ? item.color : undefined
                }}
              >
                
                {/* Compact Watermark Number (Darker Opacity) */}
                <div className={cn(
                    "absolute -bottom-6 -right-2 lg:-bottom-10 lg:-right-4 pointer-events-none transition-opacity duration-700 select-none",
                    isActive ? "opacity-100" : "opacity-0"
                )}>
                    <span 
                        className="text-[8rem] lg:text-[12rem] font-black leading-none opacity-[0.12] dark:opacity-[0.1]" 
                        style={{ color: item.color }} 
                    >
                        0{item.id}
                    </span>
                </div>

                {/* Content Container */}
                <div className="relative z-10 h-full flex flex-col p-5 lg:p-6 justify-between">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-2">
                        
                        {/* Compact Icon */}
                        <div 
                            className={cn(
                                "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500",
                                isActive 
                                    ? "bg-card border border-border/50 shadow-md" 
                                    : "bg-transparent"
                            )}
                        >
                             {isActive && (
                                <div 
                                    className="absolute inset-0 opacity-20 blur-md rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                             )}

                            <item.icon 
                                size={20}
                                className={cn(
                                    "relative z-10 transition-all duration-500",
                                    isActive ? "scale-100" : "opacity-50 grayscale"
                                )}
                                style={{ color: isActive ? item.color : "currentColor" }}
                            />
                        </div>
                        
                        {/* Mobile Title */}
                        {!isActive && (
                            <div className="lg:hidden flex-1 ml-4">
                                <span className="font-bold text-base">{item.title}</span>
                            </div>
                        )}

                        {/* Number */}
                        <span className={cn(
                            "hidden lg:block text-lg font-bold font-mono transition-colors duration-300",
                            isActive ? "opacity-0" : "opacity-20 text-muted-foreground"
                        )}>
                            0{item.id}
                        </span>
                    </div>

                    {/* Active Content */}
                    <AnimatePresence mode="popLayout">
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="flex flex-col gap-3"
                            >
                                <div className="space-y-1">
                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium max-w-md">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {item.tags.map((tag, i) => (
                                        <span 
                                            key={i} 
                                            className="px-2 py-0.5 rounded-md bg-secondary text-[10px] md:text-xs font-semibold text-secondary-foreground border border-border/10"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <Button 
                                    variant="link" 
                                    className="w-fit p-0 h-auto font-bold uppercase text-[10px] tracking-wider hover:no-underline gap-1 mt-1"
                                    style={{ color: item.color }}
                                >
                                    Explore <ArrowUpRight className="w-3 h-3" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Inactive Vertical Text (Desktop) */}
                    {!isActive && (
                        <div className="hidden lg:flex absolute inset-0 items-center justify-center">
                             <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="rotate-[-90deg] whitespace-nowrap"
                             >
                                <span className="text-2xl font-black tracking-widest text-muted-foreground/30 uppercase group-hover:text-foreground/80 transition-colors">
                                    {item.title}
                                </span>
                             </motion.div>
                        </div>
                    )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}