// "use client";

// import React, { useEffect, useState, useRef, memo } from "react";
// import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
// import { Button } from "@/components/ui/button";
// import { MoveRight, Users, Sparkles } from "lucide-react";
// import { motion, useInView, animate } from "motion/react";
// import Link from "next/link";

// /* ===================== COUNTER ===================== */
// const Counter = memo(({ value, suffix = "" }: { value: number; suffix?: string }) => {
//   const ref = useRef<HTMLSpanElement | null>(null);
//   const isInView = useInView(ref, { once: true });
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (!isInView) return;
//     const controls = animate(0, value, {
//       duration: 2.5,
//       ease: "easeOut",
//       onUpdate: (v) => setCount(Math.floor(v)),
//     });
//     return () => controls.stop();
//   }, [isInView, value]);

//   return (
//     <span ref={ref} className="tabular-nums">
//       {count}
//       {suffix}
//     </span>
//   );
// });
// Counter.displayName = "Counter";

// /* ===================== TYPEWRITER ===================== */
// const Typewriter = memo(({ words }: { words: string[] }) => {
//   const [i, setI] = useState(0);
//   const [sub, setSub] = useState(0);
//   const [rev, setRev] = useState(false);

//   useEffect(() => {
//     const current = words[i];

//     if (!rev && sub === current.length) {
//       const t = setTimeout(() => setRev(true), 1200);
//       return () => clearTimeout(t);
//     }

//     if (rev && sub === 0) {
//       setRev(false);
//       setI((p) => (p + 1) % words.length);
//       return;
//     }

//     const t = setTimeout(
//       () => setSub((p) => p + (rev ? -1 : 1)),
//       rev ? 50 : 110
//     );

//     return () => clearTimeout(t);
//   }, [sub, rev, i, words]);

//   return (
//     <span>
//       {words[i].slice(0, sub)}
//       <span className="ml-1 inline-block w-[3px] h-[0.9em] bg-primary animate-pulse align-middle" />
//     </span>
//   );
// });
// Typewriter.displayName = "Typewriter";

// /* ===================== HERO ===================== */
// export default function HeroSection() {
//   const container = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.12 },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 16 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.7, ease: "easeOut" },
//     },
//   };

//   return (
//     <section className="relative isolate overflow-hidden bg-background pt-[clamp(5rem,10vw,9rem)] pb-[clamp(4rem,8vw,6rem)] -mt-18">
//       {/* Background */}
//       <div className="absolute inset-0 -z-10">
//         <BackgroundRippleEffect />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_75%)]" />
//       </div>

//       <motion.div
//         variants={container}
//         initial="hidden"
//         animate="visible"
//         className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-2"
//       >
//         <div className="flex flex-col items-center text-center gap-10 sm:gap-14">

//           {/* Badge */}
//           <motion.div variants={item}>
//             <Button
//               variant="secondary"
//               size="sm"
//               className="rounded-full gap-2 px-5 backdrop-blur-md border border-white/10"
//             >
//               <Sparkles className="w-4 h-4 text-primary" />
//               Upcoming events
//               <MoveRight className="w-4 h-4" />
//             </Button>
//           </motion.div>

//           {/* Heading */}
//           <div className="space-y-4 sm:space-y-6">
//             <motion.h1
//               variants={item}
//               className="font-black tracking-tight text-[clamp(2.25rem,6.5vw,5.5rem)]"
//             >
//               Welcome to <span className="text-primary">D4</span>
//             </motion.h1>

//             <motion.div
//               variants={item}
//               className="h-[clamp(2.5rem,6vw,5.5rem)] flex items-center justify-center text-[clamp(1.5rem,4vw,3.5rem)] font-bold text-muted-foreground"
//             >
//               <Typewriter words={["Discrete", "Develop", "Debug", "Deploy"]} />
//             </motion.div>

//             <motion.p
//               variants={item}
//               className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
//             >
//               An inclusive,{" "}
//               <span className="font-bold text-foreground underline underline-offset-4 decoration-primary/40">
//                 open-source
//               </span>{" "}
//               initiative driven by passionate individuals building tools for the next generation of developers.
//             </motion.p>
//           </div>

//           {/* Actions */}
//           <motion.div
//             variants={item}
//             className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
//           >
//             <Link href="https://connect.d4community.com" target="_blank" rel="noopener noreferrer">
//   <Button size="lg" className="rounded-2xl px-10 h-14 font-bold">
//     Explore More <MoveRight className="w-5 h-5 ml-1" />
//   </Button>
// </Link>
//             <Button size="lg" variant="outline" className="rounded-2xl px-10 h-14 font-bold">
//               <Users className="w-5 h-5 mr-1" /> Join Community
//             </Button>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             variants={item}
//             className="grid grid-cols-3 gap-8 sm:gap-14 pt-10 border-t border-white/10 w-full max-w-3xl"
//           >
//             {[
//               { value: 5000, suffix: "+", label: "Members" },
//               { value: 120, suffix: "+", label: "Partners" },
//               { value: 50, suffix: "+", label: "Events" },
//             ].map((s) => (
//               <div key={s.label} className="flex flex-col items-center">
//                 <span className="text-2xl md:text-3xl font-black">
//                   <Counter value={s.value} suffix={s.suffix} />
//                 </span>
//                 <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">
//                   {s.label}
//                 </span>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }



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