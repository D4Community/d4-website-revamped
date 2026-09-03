"use client";

import React, { useRef, useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export const CTASection = memo(function CTASection() {
  const containerRef = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], // Track full scroll through the element
  });

  // Expand when 40% scrolled into view, collapse when scrolled back up
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.4 && !isExpanded) {
      setIsExpanded(true);
    } else if (latest < 0.4 && isExpanded) {
      setIsExpanded(false);
    }
  });

  return (
    <section ref={containerRef} className="relative z-10 flex justify-center w-full px-4 sm:px-6 md:px-0">
      {/* CTA Container with hardware-accelerated expansion */}
      <motion.div
        animate={{
          maxWidth: isExpanded ? "100%" : "85%",
          borderRadius: isExpanded ? "2.5rem" : "3.5rem",
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1], // High-performance spring-like bezier
        }}
        className="w-full bg-black dark:bg-white min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 md:py-32 will-change-[max-width,border-radius] transform-gpu"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-black leading-tight tracking-tight">
            Join the Community
            <br />
            <span className="text-white/90 dark:text-black/90">Build Together</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 dark:text-black/80 max-w-2xl mx-auto leading-relaxed">
            Connect with passionate developers, share knowledge, and collaborate
            on exciting projects. Your journey starts here.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="https://connect.d4community.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90 font-semibold px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 group"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export default CTASection;