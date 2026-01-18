"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative z-10">
      {/* CTA Container with rounded top corners */}
      <div className="bg-black dark:bg-white rounded-[3rem] md:rounded-[4rem] min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 md:py-32">
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-black leading-tight">
            Join the Community
            <br />
            <span className="text-white/90 dark:text-black/90">Build Together</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 dark:text-black/80 max-w-2xl mx-auto">
            Connect with passionate developers, share knowledge, and collaborate
            on exciting projects. Your journey starts here.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="#" target="_blank">
              <Button
                size="lg"
                className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90 font-semibold px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 group"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Whatsapp Community
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
