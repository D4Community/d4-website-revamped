"use client";
import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <div className="py-12 w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          Our Collabrations{" "}
          <span className="text-neutral-400">
            {"Connectivity".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Break free from traditional boundaries. Work from anywhere, at the
          comfort of your own studio apartment. Perfect for Nomads and
          Travellers.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <WorldMap
          locations={[
            { lat: 40.7128, lng: -74.006, label: "New York" },
            { lat: 51.5074, lng: -0.1278, label: "London" },
            { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
            { lat: 12.1471, lng: 80.3412, label: "Punjab" },
            { lat: 0.9416, lng: 85.5946, label: "Bangalore" },
          ]}
        />
      </div>
    </div>
  );
}
