"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import AnimatedContainer from "@/components/ui/animated-container";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  title: string;
  description: string;
  imageUrl: string;
}

const events: Event[] = [
  {
    title: "AI as Your CTO Co-Founder: Build Smarter, Not Harder",
    description:
      "Pitch your idea to the world and get a chance to win exciting prizes and get a chance to work with the best companies in the world.",
    imageUrl:
      "/images/events/ai-as-your-cto.png",
  },
  {
  
    title: "Hello World Conclave",
    description:
      "Pitch your idea to the world and get a chance to win exciting prizes and get a chance to work with the best companies in the world.",
    imageUrl:
      "/images/events/hello-world-conclave.png",
  },
  {
    title: "Digital Payments & LinkedIn Opportunities",
    description:
      "Pitch your idea to the world and get a chance to win exciting prizes and get a chance to work with the best companies in the world.",
    imageUrl:
      "/images/events/digital-payments-and-linkedin-opportunies.png",
  },
  {
    title: "Hack-N-Win 2.0",
    description:
      "Pitch your idea to the world and get a chance to win exciting prizes and get a chance to work with the best companies in the world.",
    imageUrl:
      "/images/events/hack-n-win-2.png",
  }
];

export interface TestimonialCarouselProps {
  className?: string;
}

export function EventCarousel({ className }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % events.length);
  const handlePrevious = () =>
    setCurrentIndex((index) => (index - 1 + events.length) % events.length);

  const currentEvent = events[currentIndex];

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4 mb-12", className)}>
      <AnimatedContainer className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
          Hottest Events
        </h2>
      </AnimatedContainer>
      {/* Desktop layout */}
      <div className="hidden md:flex relative items-center">
        {/* Avatar */}
        <div className="w-117.5 h-117.5 rounded-3xl overflow-hidden bg-gray-200 dark:bg-neutral-800 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src={currentEvent.imageUrl}
                alt={currentEvent.title}
                width={470}
                height={470}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-2xl p-8 -ml-20 z-10 max-w-xl flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentEvent.title}
                </h2>
              </div>

              <p className="text-black dark:text-white text-base leading-relaxed mb-8">
                {currentEvent.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden max-w-sm mx-auto text-center bg-transparent">
        {/* Avatar */}
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-3xl overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src={currentEvent.imageUrl}
                alt={currentEvent.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card content */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {currentEvent.title}
              </h2>

              <p className="text-black dark:text-white text-sm leading-relaxed mb-6">
                {currentEvent.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-end items-center gap-3 mt-8">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Previous event"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Next event"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
