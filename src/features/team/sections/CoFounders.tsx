"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Twitter, Github, Users } from "lucide-react";

const organizers = [
  {
    name: "Ayush Kumar Tiwari",
    title: "Organizer",
    bio: "Ayush is a Software Engineer with 3+ years of experience building user-focused web applications using React.js, Next.js, TypeScript, and Angular, with experience across B2B platforms and cross-platform mobile apps.",
    image: "/images/team/ayush-tiwari.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/itsayu/",
      twitter: "https://twitter.com/its_AKT_/",
      github: "https://github.com/itsayu/",
    },
  },
  {
    name: "Sagar Malhotra",
    title: "Organizer",
    bio: "Sagar Malhotra is a friendly neighborhood Android Engineer passionate about helping developers grow. He supports the community through mentoring peers, teaching, writing blogs, and creating educational content.",
    image: "/images/team/sagar-malhotra.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/sagar0-0malhotra/",
      twitter: "#",
      github: "https://github.com/Sagar0-0",
    },
  },
  {
    name: "Qazi Zaid",
    title: "Co-Organizer",
    bio: "Qazi Zaid is a Co-Organizer at D4 Community, contributing to the growth of the developer ecosystem by organizing events, managing collaborations, and supporting community initiatives. He actively works to create opportunities for students and developers to learn, connect, and build together. With interests in technology, design, and community building, he helps drive impactful initiatives within the community.",
    image: "/images/team/qazi-zaid.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/qazi-zaid/",
      twitter: "#",
      github: "https://github.com/QaziZaid16",
    },
  },
];

export const CoFounders = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative w-full py-24 overflow-hidden" ref={ref}>
     
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-4 mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            <Users className="w-3 h-3" />
            <span>Organizers</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Meet the <span className="text-primary">Organizers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The visionaries and organizers behind D4, dedicated to building a vibrant,
            collaborative community.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 lg:gap-12 w-full">
          {/* Top Row: 2 Founders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
            {organizers.slice(0, 2).map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group flex flex-col w-full h-full"
              >
                {/* Outer sharp accent border */}
                <div
                  className="absolute inset-0 bg-linear-to-br from-white/10 via-border/50 to-white/10 group-hover:from-primary group-hover:to-primary/30 transition-colors duration-500"
                  style={{ clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 40px 100%, 0 calc(100% - 40px))" }}
                />

                {/* Inner main card */}
                <div
                  className="relative m-[1px] h-full bg-background/95 backdrop-blur-2xl flex flex-col gap-0"
                  style={{ clipPath: "polygon(0 0, calc(100% - 39px) 0, 100% 39px, 100% 100%, 39px 100%, 0 calc(100% - 39px))" }}
                >
                  {/* Image Box - Filling the top area completely */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden group-hover:opacity-90 transition-opacity duration-300">
                    <img
                        src={founder.image}
                        alt={founder.name}
                        className="object-cover w-full h-full object-top transition-all duration-700 group-hover:scale-[1.03]"
                      />
                      {/* Gradient fade to background */}
                      <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/20 to-transparent" />

                    
                  </div>

                  {/* Content taking the bottom space, overflowing slightly */}
                  <div className="relative z-10 flex flex-col flex-grow px-6 md:px-10 pb-8 pt-2 -mt-12">
                    <div className="flex flex-col gap-3">
                      <div
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-bold self-start uppercase tracking-[0.2em] backdrop-blur-md"
                        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                      >
                        {founder.title}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                        {founder.name}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-base mt-4 mb-8">
                      {founder.bio}
                    </p>

                    {/* Socials anchored to bottom */}
                    <div className="mt-auto flex gap-3 pt-6 border-t border-white/10">
                      <a href={founder.socials.linkedin} className="relative p-2.5 bg-secondary/50 hover:bg-primary text-foreground transition-all duration-300" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                          <Linkedin className="w-5 h-5 relative z-10" />
                      </a>
                      <a href={founder.socials.twitter} className="relative p-2.5 bg-secondary/50 hover:bg-primary text-foreground transition-all duration-300" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                          <Twitter className="w-5 h-5 relative z-10" />
                      </a>
                      <a href={founder.socials.github} className="relative p-2.5 bg-secondary/50 hover:bg-primary text-foreground transition-all duration-300" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                          <Github className="w-5 h-5 relative z-10" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row: 1 Co-Organizer spanning full width */}
          {organizers.slice(2).map((organizer, index) => (
            <motion.div
              key={organizer.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative group flex flex-col w-full mt-4"
            >
              {/* Glow shadow to emphasize the wide panel */}
              <div className="absolute inset-0 bg-[#6d9eeb]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Outer sharp accent border */}
              <div
                className="absolute inset-0 bg-linear-to-br from-white/10 via-border/50 to-white/10 group-hover:from-[#6d9eeb]/80 group-hover:to-[#6d9eeb]/20 transition-colors duration-500"
                style={{ clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 40px 100%, 0 calc(100% - 40px))" }}
              />

              {/* Inner main card */}
              <div
                className="relative m-[1px] bg-background/95 backdrop-blur-2xl flex flex-col md:flex-row gap-0"
                style={{ clipPath: "polygon(0 0, calc(100% - 39px) 0, 100% 39px, 100% 100%, 39px 100%, 0 calc(100% - 39px))" }}
              >
                {/* Horizontal Image Section */}
                <div className="relative w-full md:w-[40%] aspect-[4/3] md:aspect-auto md:min-h-[350px] overflow-hidden bg-secondary/10 border-r border-white/5">
                  <img
                      src={organizer.image}
                      alt={organizer.name}
                      className="object-cover w-full h-full object-center transition-all duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-background/95 via-background/40 md:via-background/20 to-transparent" />
                </div>

                {/* Horizontal Content Section */}
                <div className="relative z-10 w-full md:w-[60%] px-6 md:px-12 py-8 md:py-10 flex flex-col justify-center gap-5 -mt-16 md:mt-0">
                  <div className="flex flex-col gap-3">
                    <div
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#6d9eeb]/10 border border-[#6d9eeb]/30 text-[#6d9eeb] text-xs font-bold self-start uppercase tracking-[0.2em] backdrop-blur-md"
                      style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                    >
                      {organizer.title}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-foreground group-hover:text-[#6d9eeb] transition-colors duration-300 tracking-tight">
                      {organizer.name}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-xl">
                    {organizer.bio}
                  </p>

                  {/* Socials horizontal card */}
                  <div className="flex gap-3 pt-6 md:pt-4 md:mt-auto border-t border-white/10">
                    <a href={organizer.socials.linkedin} className="relative p-2.5 bg-secondary/50 hover:bg-[#6d9eeb] hover:text-black text-foreground transition-all duration-300" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                        <Linkedin className="w-5 h-5 relative z-10" />
                    </a>
                    <a href={organizer.socials.twitter} className="relative p-2.5 bg-secondary/50 hover:bg-[#6d9eeb] hover:text-black text-foreground transition-all duration-300" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                        <Twitter className="w-5 h-5 relative z-10" />
                    </a>
                    <a href={organizer.socials.github} className="relative p-2.5 bg-secondary/50 hover:bg-[#6d9eeb] hover:text-black text-foreground transition-all duration-300" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                        <Github className="w-5 h-5 relative z-10" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
