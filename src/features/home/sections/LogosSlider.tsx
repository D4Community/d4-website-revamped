'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

type Logo = {
  src: string;
  alt: string;
};

const programmingLanguages: Logo[] = [
  { src: "https://svgl.app/library/javascript.svg", alt: "JavaScript" },
  { src: "https://svgl.app/library/typescript.svg", alt: "TypeScript" },
  { src: "https://svgl.app/library/python.svg", alt: "Python" },
  { src: "https://svgl.app/library/java.svg", alt: "Java" },
  { src: "https://svgl.app/library/rust.svg", alt: "Rust" },
  { src: "https://svgl.app/library/php.svg", alt: "PHP" },
  { src: "https://svgl.app/library/kotlin.svg", alt: "Kotlin" },
  { src: "https://svgl.app/library/swift.svg", alt: "Swift" },
];

const technologies: Logo[] = [
  { src: "https://svgl.app/library/nextjs_icon_dark.svg", alt: "Next.js" },
  { src: "https://svgl.app/library/react.svg", alt: "React" },
  { src: "https://svgl.app/library/vue.svg", alt: "Vue.js" },
  { src: "https://svgl.app/library/angular.svg", alt: "Angular" },
  { src: "https://svgl.app/library/nodejs.svg", alt: "Node.js" },
  { src: "https://svgl.app/library/docker.svg", alt: "Docker" },
  { src: "https://svgl.app/library/kubernetes.svg", alt: "Kubernetes" },
  { src: "https://svgl.app/library/tailwindcss.svg", alt: "Tailwind CSS" },
];

const tools: Logo[] = [
  { src: "https://svgl.app/library/vscode.svg", alt: "VS Code" },
  { src: "https://svgl.app/library/git.svg", alt: "Git" },
  { src: "https://svgl.app/library/figma.svg", alt: "Figma" },
  { src: "https://svgl.app/library/aws.svg", alt: "AWS" },
  { src: "https://svgl.app/library/vercel_dark.svg", alt: "Vercel" },
  { src: "https://svgl.app/library/firebase.svg", alt: "Firebase" },
  { src: "https://svgl.app/library/mongodb.svg", alt: "MongoDB" },
  { src: "https://svgl.app/library/redis.svg", alt: "Redis" },
];

interface LogoSliderRowProps {
  logos: Logo[];
  direction?: 'left' | 'right';
  duration?: number;
  isActive: boolean;
}

const LogoSliderRow = ({
  logos,
  direction = 'left',
  duration = 60,
  isActive,
}: LogoSliderRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  const shouldAnimate = isActive && !isHovered;

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex w-max gap-16 md:gap-24"
        animate={
          shouldAnimate
            ? { x: direction === 'left' ? '-50%' : '0%' }
            : { x: direction === 'left' ? '0%' : '-50%' }
        }
        initial={{ x: direction === 'left' ? '0%' : '-50%' }}
        transition={{
          duration,
          ease: 'linear',
          repeat: shouldAnimate ? Infinity : 0,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.alt}-${index}`}
            className="flex shrink-0 items-center justify-center"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={48}
              height={48}
              className="h-10 w-10 md:h-12 md:w-12 object-contain opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 dark:brightness-200"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const LogosSlider = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(sectionRef, {
    margin: '-100px',
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-background py-12 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 mb-16 text-center">
        <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
          Our Tech Stack
        </h2>
        <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base text-center">
          We leverage the most reliable and cutting-edge technologies to build performant digital experiences.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <LogoSliderRow
          logos={programmingLanguages}
          direction="left"
          duration={50}
          isActive={isInView}
        />

        <LogoSliderRow
          logos={technologies}
          direction="right"
          duration={60}
          isActive={isInView}
        />

        <LogoSliderRow
          logos={tools}
          direction="left"
          duration={55}
          isActive={isInView}
        />
      </div>
    </section>
  );
};

export default LogosSlider;