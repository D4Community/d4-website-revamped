// "use client";
// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";

// const logoGroups = [
//   [
//     { name: "Aceternity UI", src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png" },
//     { name: "Gamity", src: "https://assets.aceternity.com/pro/logos/gamity.png" },
//     { name: "Host it", src: "https://assets.aceternity.com/pro/logos/hostit.png" },
//     { name: "Asteroid Kit", src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png" },
//   ],
//   [
//     { name: "Aceternity UI", src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png" },
//     { name: "Gamity", src: "https://assets.aceternity.com/pro/logos/gamity.png" },
//     { name: "Host it", src: "https://assets.aceternity.com/pro/logos/hostit.png" },
//     { name: "Asteroid Kit", src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png" },
//   ],
// ];

// export default function LoopingLogos() {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % logoGroups.length);
//     }, 4000); // 4-second interval
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="relative z-20 py-20 bg-white dark:bg-black overflow-hidden flex flex-col items-center">
//       <h2 className="bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-center font-sans text-2xl font-bold text-transparent md:text-5xl dark:from-white dark:to-neutral-600 mb-20">
//         Trusted by the best companies
//       </h2>

//       <div className="relative flex justify-center items-center w-full h-40">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={index}
//             className="flex flex-wrap justify-center gap-10 md:gap-20 absolute"
//           >
//             {logoGroups[index].map((logo, i) => (
//               <motion.div
//                 key={logo.name}
//                 initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} // Start from bottom
//                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}   // Move to center
//                 exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}   // Exit to top
//                 transition={{
//                   duration: 0.8,
//                   delay: i * 0.1, // Staggered entry
//                   ease: [0.4, 0, 0.2, 1],
//                 }}
//               >
//                 <Image
//                   src={logo.src}
//                   alt={logo.name}
//                   width={160}
//                   height={80}
//                   className="h-10 w-20 object-contain md:h-20 md:w-40 dark:invert grayscale"
//                 />
//               </motion.div>
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }











"use client";
import React from "react";
import Image from "next/image";

// 1. Logo Data
const logos = [
  { name: "Aceternity UI", src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png" },
  { name: "Gamity", src: "https://assets.aceternity.com/pro/logos/gamity.png" },
  { name: "Host it", src: "https://assets.aceternity.com/pro/logos/hostit.png" },
  { name: "Asteroid Kit", src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png" },
];

export default function MarqueePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-20 flex flex-col justify-center overflow-hidden">
      
      {/* 2. Keyframes for smooth infinite looping */}
      <style jsx global>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 25s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>

      <div className="relative z-20">
        <div className="px-4 mb-16">
          <h2 className="bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-center font-sans text-3xl font-bold text-transparent md:text-5xl dark:from-white dark:to-neutral-600">
            Brands love us
          </h2>
          <p className="mt-4 text-center font-sans text-base text-neutral-700 dark:text-neutral-300 max-w-lg mx-auto">
            Aceternity UI is loved by the best companies who are serious about what they do.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:gap-16">
          
          {/* Row 1: Moving Left */}
          {/* 'group' allows us to control children based on parent hover */}
          <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex w-max animate-scroll-left group-hover:[animation-play-state:paused] py-4">
              {/* Multiplying logos x4 to ensure the track is long enough for a seamless loop */}
              {[...logos, ...logos, ...logos, ...logos].map((logo, idx) => (
                <div key={`row1-${idx}`} className="mx-8 md:mx-12 w-32 md:w-40 flex-shrink-0 transition-transform hover:scale-110 duration-300">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={160}
                    height={80}
                    className="object-contain filter dark:invert grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Moving Right */}
          <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex w-max animate-scroll-right group-hover:[animation-play-state:paused] py-4">
              {[...logos, ...logos, ...logos, ...logos].map((logo, idx) => (
                <div key={`row2-${idx}`} className="mx-8 md:mx-12 w-32 md:w-40 flex-shrink-0 transition-transform hover:scale-110 duration-300">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={160}
                    height={80}
                    className="object-contain filter dark:invert grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}