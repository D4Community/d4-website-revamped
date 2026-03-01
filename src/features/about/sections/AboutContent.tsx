"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Cpu, 
  ScanSearch, 
  Globe2, 
  Blocks, 
  Users, 
  Heart,
  Sparkles,
  Zap,
  GitFork
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Neon Glass Feature Card ---
const FeatureCard = ({ icon: Icon, title, description, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 hover:bg-card p-6 transition-all duration-300 hover:border-border/80 hover:shadow-lg"
  >
    {/* Top Border Accent */}
    <div 
        className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
    />

    <div className="relative z-10 flex flex-col gap-4">
      {/* Icon Container (Neon Glass Style) */}
      <div 
        className="relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{ 
            backgroundColor: `${color}15`, // 15% opacity hex
            color: color
        }}
      >
        <Icon className="h-6 w-6" />
      </div>
      
      <div>
        <h3 className="text-lg font-bold tracking-tight mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

const AboutContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      title: "Discrete",
      icon: Blocks,
      color: "#6d9eeb", // Blue
      desc: "Breaking down complex challenges into manageable, logical components. Atomic thinking.",
      delay: 0.1,
    },
    {
      title: "Develop",
      icon: Cpu,
      color: "#5ccb5f", // Green
      desc: "Building robust, scalable solutions. A space where code meets creativity and craftsmanship.",
      delay: 0.2,
    },
    {
      title: "Debug",
      icon: ScanSearch,
      color: "#f6b26b", // Orange
      desc: "Resilience in the face of errors. Fixing bugs is a collaborative learning experience.",
      delay: 0.3,
    },
    {
      title: "Deploy",
      icon: Globe2,
      color: "#a2c4c9", // Teal
      desc: "Shipping value to the world. From CI/CD pipelines to end-user delivery.",
      delay: 0.4,
    },
  ];

  return (
    <section className="relative w-full py-24 overflow-hidden" ref={ref}>
      
      {/* Background Grid (Matches the other component) */}
      <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
        style={{ 
           backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
           backgroundSize: '32px 32px' 
        }} 
      />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* --- Top Section: Text & Stats --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-muted-foreground uppercase w-fit">
              <Users className="w-3 h-3" />
              <span>Who We Are</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
              We are the <span className="text-primary">D4 Community</span>
            </h2>
            
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                D4 is more than just an acronym; it's our methodology. We are an 
                <span className="text-foreground font-semibold"> inclusive, open-source initiative </span> 
                driven by passionate developers building tools for the next generation.
                </p>
                
                <p className="text-base">
                Whether you are just starting your journey or are a seasoned engineer, 
                D4 provides the platform to connect, collaborate, and contribute to 
                projects that matter. We bridge the gap between abstract theory and 
                deployed reality.
                </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/30 border border-border/50 text-xs font-medium text-foreground">
                <Globe2 className="w-3.5 h-3.5 text-primary" />
                Global Reach
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/30 border border-border/50 text-xs font-medium text-foreground">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                Open Source
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/30 border border-border/50 text-xs font-medium text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Innovation
              </div>
            </div>
          </motion.div>

          {/* Right: Bento Grid Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              
              {/* Stat 1: Members */}
              <div className="space-y-4 translate-y-8">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users size={64} className="text-[#6d9eeb]" />
                   </div>
                   <h4 className="text-4xl font-bold text-[#6d9eeb]">5k+</h4>
                   <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Community Members</p>
                </div>

                {/* Stat 2: Projects */}
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <GitFork size={64} className="text-[#5ccb5f]" />
                   </div>
                   <h4 className="text-4xl font-bold text-[#5ccb5f]">50+</h4>
                   <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Open Source Projects</p>
                </div>
              </div>

              {/* Stat 3: Partners */}
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap size={64} className="text-[#f6b26b]" />
                   </div>
                   <h4 className="text-4xl font-bold text-[#f6b26b]">120+</h4>
                   <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Partners & Sponsors</p>
                </div>

                {/* Stat 4: Driven */}
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Heart size={64} className="text-[#a2c4c9]" />
                   </div>
                   <h4 className="text-4xl font-bold text-[#a2c4c9]">100%</h4>
                   <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Community Driven</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* --- Bottom: The 4 D's Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <FeatureCard 
              key={i} 
              title={f.title} 
              description={f.desc} 
              icon={f.icon} 
              color={f.color}
              delay={f.delay} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutContent;