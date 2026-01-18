'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

// Programming Languages
const programmingLanguages: Logo[] = [
  {
    src: "https://svgl.app/library/javascript.svg",
    alt: "JavaScript",
  },
  {
    src: "https://svgl.app/library/typescript.svg",
    alt: "TypeScript",
  },
  {
    src: "https://svgl.app/library/python.svg",
    alt: "Python",
  },
  {
    src: "https://svgl.app/library/java.svg",
    alt: "Java",
  },
  {
    src: "https://svgl.app/library/rust.svg",
    alt: "Rust",
  },
  {
    src: "https://svgl.app/library/php.svg",
    alt: "PHP",
  },
  {
    src: "https://svgl.app/library/kotlin.svg",
    alt: "Kotlin",
  },
  {
    src: "https://svgl.app/library/swift.svg",
    alt: "Swift",
  },
];

// Technologies & Frameworks
const technologies: Logo[] = [
  {
    src: "https://svgl.app/library/nextjs_icon_dark.svg",
    alt: "Next.js",
  },
  {
    src: "https://svgl.app/library/vue.svg",
    alt: "Vue.js",
  },
  {
    src: "https://svgl.app/library/angular.svg",
    alt: "Angular",
  },
  {
    src: "https://svgl.app/library/nodejs.svg",
    alt: "Node.js",
  },
  {
    src: "https://svgl.app/library/docker.svg",
    alt: "Docker",
  },
  {
    src: "https://svgl.app/library/kubernetes.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://svgl.app/library/postgresql.svg",
    alt: "PostgreSQL",
  },
  {
    src: "https://svgl.app/library/tailwindcss.svg",
    alt: "Tailwind CSS",
  },
];

interface LogoSliderRowProps {
  logos: Logo[];
  direction?: 'left' | 'right';
  duration?: number;
}

const LogoSliderRow = ({ logos, direction = 'left', duration = 30 }: LogoSliderRowProps) => {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fade effect on left */}
      <div className="absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-background to-transparent" />
      {/* Fade effect on right */}
      <div className="absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-background to-transparent" />

      <motion.div
        className="flex gap-12 py-4"
        initial={{ x: direction === 'left' ? '0%' : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : '0%' }}
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.alt}-${index}`}
            className="shrink-0 flex items-center justify-center"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 48}
              height={logo.height || 48}
              className="h-12 w-12 object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const LogosSlider = () => {
  return (
    <section className="w-full py-12">
      <div className="flex flex-col gap-8">
        {/* First slider: moves from right to left (starts from right) */}
        <LogoSliderRow logos={programmingLanguages} direction="left" duration={25} />
        
        {/* Second slider: moves from left to right (starts from left) */}
        <LogoSliderRow logos={technologies} direction="right" duration={30} />
      </div>
    </section>
  );
};

export default LogosSlider;