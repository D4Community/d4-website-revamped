"use client";
import { FeatureCard } from "@/components/grid-feature-cards";
import AnimatedContainer from "@/components/ui/animated-container";
import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Users, GraduationCap, Building } from "lucide-react";

const features = [
  {
    title: "20+",
    icon: Users,
    description: "Members",
  },
  {
    title: "04+",
    icon: Cpu,
    description: "Tech Partners",
  },

  {
    title: "100+",
    icon: GraduationCap,
    description: "Student Members",
  },
  {
    title: "15+",
    icon: Building,
    description: "Community Partners",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
        <AnimatedContainer className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
            Building. Connecting. Growing.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            A thriving community of developers, partners, and students driving innovation together.
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.4}
          className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2"
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default FeatureSection;


