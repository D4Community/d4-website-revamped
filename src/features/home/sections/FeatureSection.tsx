"use client";

import { FeatureCard } from "@/components/grid-feature-cards";
import AnimatedContainer from "@/components/ui/animated-container";
import { Cpu, Users, GraduationCap, Building } from "lucide-react";

const features = [
  {
    title: "5000+",
    icon: Users,
    description: "Members",
  },
  {
    title: "50+",
    icon: Cpu,
    description: "Tech Partners",
  },
  {
    title: "7000+",
    icon: GraduationCap,
    description: "Student Members",
  },
  {
    title: "100+",
    icon: Building,
    description: "Community Partners",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-8 md:py-20">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
        {/* Trigger title immediately */}
        <AnimatedContainer className="mx-auto text-center" delay={0}>
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
            Building. Connecting. Growing.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            A thriving community of developers, partners, and students driving
            innovation together.
          </p>
        </AnimatedContainer>

        {/* Lowered delay from 0.4s to 0.1s for fast entry */}
        <AnimatedContainer
          delay={0.1}
          className="grid grid-cols-1 border border-dashed sm:grid-cols-2"
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