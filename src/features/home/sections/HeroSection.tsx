"use client";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui/button";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { MoveRight, PhoneCall, Users } from "lucide-react";
import { motion } from "motion/react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden w-full -mt-18 pt-12">
      <BackgroundRippleEffect  />
      <div className="container mx-auto relative">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="relative z-10">
            <Button variant="secondary" size="sm" className="gap-4">
              View our upcoming events
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <motion.div className="relative z-10 mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
              <LayoutTextFlip
                text="Welcome to D4"
                words={["Discrete", "Develop", "Debug", "Deploy"]}
              />
            </motion.div>

            <p className="relative z-10 text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
             D4 Community is an inclusive, open-source initiative driven by passionate individuals from diverse backgrounds. With contributions from a dedicated group of members and continuous input from the wider community.
            </p>
          </div>
          <div className="relative z-10 flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Join Community <Users className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4">
              Explore More <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
