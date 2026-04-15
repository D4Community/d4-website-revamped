"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function EventsHero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative w-full bg-white dark:bg-black pt-32 pb-16 px-6 lg:px-12",
        className,
      )}
    >
      {/* Background: Raw technical grid for a "Draft" or "Architect" feel */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-24">
          {/* Left: Headline & Core Narrative */}
          <div className="flex-1 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-10"
            >
              <Terminal className="w-5 h-5 text-[#fd7d6e]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 dark:text-white/30">
                D4: Events
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.85] tracking-tighter"
            >
              WHERE
              <br />
              IDEAS
              <br />
              <span className="text-[#fd7d6e]">EXECUTE.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-6 items-center"
            >
              <button
                onClick={() => {
                  const section = document.getElementById("UpcomingEvents");
                  if (section) {
                    section.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="group flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest transition-all hover:bg-black dark:hover:bg-gray-200"
              >
                Browse Schedule
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="h-10 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20">
                  Status
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Registration Open
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: The "Context Block" - This is what makes it feel human-made */}
          <div className="w-full lg:w-80 flex flex-col gap-10 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-xs font-black uppercase tracking-widest text-[#fd7d6e]">
                The Mission
              </p>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-white/40 font-medium">
                D4 events aren't just talks. They are technical deployments. We
                bring together engineers who prefer building over talking. No
                fluff, just raw execution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/20 mb-4">
                Focus Areas
              </p>
              <ul className="space-y-3">
                {[
                  "Production Systems",
                  "Full-Stack Sprints",
                  "Open Source Contribs",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-xs font-bold text-gray-700 dark:text-white/60"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#fd7d6e]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern, thin edge-to-edge line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100 dark:bg-white/5" />
    </section>
  );
}

// "use client";

// import { motion } from "framer-motion";
// import { ArrowRight, Terminal, Globe, Zap } from "lucide-react";
// import { cn } from "@/lib/utils";

// export function EventsHero({ className }: { className?: string }) {
//   const fadeInUp = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     transition: { duration: 0.6, ease: "easeOut" },
//   };

//   return (
//     <section
//       className={cn(
//         "relative w-full bg-white dark:bg-black pt-32 pb-12 overflow-hidden",
//         className
//       )}
//     >
//       {/* Background UI Accents */}
//       <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.08]"
//         style={{
//           backgroundImage: `linear-gradient(#fd7d6e 1px, transparent 1px), linear-gradient(90deg, #fd7d6e 1px, transparent 1px)`,
//           backgroundSize: "64px 64px",
//         }}
//       />

//       <div className="relative z-10 max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

//           {/* Left Side: Main Brand Statement (7 Cols) */}
//           <div className="lg:col-span-7 space-y-8">
//             <motion.div {...fadeInUp} className="inline-flex items-center gap-2">
//               <span className="h-px w-12 bg-[#fd7d6e]" />
//               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#fd7d6e]">
//                 Unified Ecosystem
//               </span>
//             </motion.div>

//             <motion.h1
//               {...fadeInUp}
//               transition={{ delay: 0.1 }}
//               className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.85] tracking-tighter"
//             >
//               CODE<br />
//               BEYOND<br />
//               <span className="text-gray-300 dark:text-white/20">LIMITS.</span>
//             </motion.h1>

//             <motion.p
//               {...fadeInUp}
//               transition={{ delay: 0.2 }}
//               className="max-w-md text-gray-500 dark:text-white/40 text-lg font-medium leading-relaxed"
//             >
//               A collective of high-performance developers. From 48-hour sprints
//               to deep-tech meetups, find your next challenge here.
//             </motion.p>

//             <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
//               <button
//                 onClick={() => document.getElementById('upcoming-section')?.scrollIntoView({ behavior: 'smooth' })}
//                 className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#fd7d6e] text-white font-black text-xs uppercase tracking-widest transition-all hover:bg-[#ef6c5d] active:scale-95 shadow-xl shadow-[#fd7d6e]/20"
//               >
//                 Explore Roadmap
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </button>
//             </motion.div>
//           </div>

//           {/* Right Side: Bento "Focus" Areas (5 Cols) */}
//           <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">

//             {/* Box 1: Hackathons */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.4 }}
//               className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col justify-between aspect-square"
//             >
//               <Zap className="w-6 h-6 text-[#fd7d6e]" />
//               <div>
//                 <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight uppercase">Sprints</h3>
//                 <p className="text-[10px] text-gray-400 dark:text-white/30 uppercase tracking-widest font-bold mt-1">Hackathons</p>
//               </div>
//             </motion.div>

//             {/* Box 2: Meetups */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.5 }}
//               className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col justify-between aspect-square lg:mt-8"
//             >
//               <Globe className="w-6 h-6 text-[#fd7d6e]" />
//               <div>
//                 <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight uppercase">Global</h3>
//                 <p className="text-[10px] text-gray-400 dark:text-white/30 uppercase tracking-widest font-bold mt-1">Meetups</p>
//               </div>
//             </motion.div>

//             {/* Box 3: Workshops */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.6 }}
//               className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col justify-between aspect-square sm:col-span-2 sm:aspect-auto sm:h-32"
//             >
//               <Terminal className="w-6 h-6 text-[#fd7d6e]" />
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight uppercase">Deep Tech</h3>
//                   <p className="text-[10px] text-gray-400 dark:text-white/30 uppercase tracking-widest font-bold mt-1">Workshops</p>
//                 </div>
//                 <div className="text-[10px] font-black text-[#fd7d6e] uppercase tracking-[0.2em]">Build fast</div>
//               </div>
//             </motion.div>

//           </div>
//         </div>
//       </div>

//       {/* Subtle Bottom Border */}
//       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100 dark:bg-white/5" />
//     </section>
//   );
// }
