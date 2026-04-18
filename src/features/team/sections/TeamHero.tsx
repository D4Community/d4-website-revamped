"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────
   Animated grid-dot canvas (parallax on mouse)
───────────────────────────────────────────── */
const DotField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mx = 0,
      my = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 36;
      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;
      const ox = mx * 18;
      const oy = my * 18;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing + ox;
          const y = r * spacing + oy;
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          const maxD = Math.sqrt(cx ** 2 + cy ** 2);
          const alpha = 0.06 + 0.18 * (1 - dist / maxD);
          ctx.beginPath();
          ctx.arc(x, y, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(92,203,95,${alpha})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

/* ─────────────────────────────────────────────
   Floating geometric ring (SVG)
───────────────────────────────────────────── */
const Ring = ({
  size,
  delay,
  className,
}: {
  size: number;
  delay: number;
  className?: string;
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 28 + delay * 4, repeat: Infinity, ease: "linear" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          stroke="#5ccb5f"
          strokeWidth="0.75"
          strokeDasharray="4 8"
          opacity="0.25"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          stroke="#5ccb5f"
          strokeWidth="0.5"
          opacity="0.12"
        />
      </svg>
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Counter pill (animates number up)
───────────────────────────────────────────── */
const CountPill = ({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col items-center gap-0.5 px-6 py-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-sm"
  >
    <span
      className="text-2xl font-black tracking-tight"
      style={{ color: "#5ccb5f" }}
    >
      {value}
    </span>
    <span className="text-[10px] uppercase tracking-[0.18em] text-black/40 dark:text-white/35 font-medium">
      {label}
    </span>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export const TeamHero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const glowX = useTransform(springX, [-0.5, 0.5], ["-6%", "6%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["-6%", "6%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  };

  const words = ["Our", "Community"];

  return (
    <section
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-[#080a08] px-6 transition-colors duration-500"
      onMouseMove={handleMouseMove}
    >
      {/* Dot field */}
      <DotField />

      {/* Ambient glow — follows mouse */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(92,203,95,0.13) 0%, transparent 70%)",
          x: glowX,
          y: glowY,
          top: "calc(50% - 200px)",
          left: "calc(50% - 350px)",
          filter: "blur(40px)",
        }}
      />

      {/* Decorative rings */}
      <Ring size={520} delay={0.3} className="-top-20 -right-20 opacity-70" />
      <Ring size={300} delay={0.6} className="-bottom-10 -left-16 opacity-50" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center max-w-6xl w-full mx-auto text-center">

        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-3 mb-10"
        >
          <div className="h-px w-10" style={{ background: "rgba(92,203,95,0.4)" }} />
          <span
            className="text-[10px] font-mono tracking-[0.3em] uppercase"
            style={{ color: "#5ccb5f" }}
          >
            D4 Force
          </span>
          <div className="h-px w-10" style={{ background: "rgba(92,203,95,0.4)" }} />
        </motion.div>

        {/* Main headline — word-by-word stagger */}
        <h1 className="font-black tracking-[-0.03em] leading-[1] mb-6 text-black dark:text-white">
          <div className="overflow-hidden mb-2">
            <motion.span
              className="block text-4xl sm:text-4xl md:text-5xl lg:text-[6rem]"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              The Minds Behind
            </motion.span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4">
            {words.map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.span
                  className="block text-5xl sm:text-5xl md:text-6xl lg:text-[6rem]"
                  style={{
                    WebkitTextStroke: "1px #5ccb5f",
                    color: "transparent",
                  }}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.12 * (i + 1),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-base md:text-lg leading-relaxed mb-12 text-black/60 dark:text-white/40"
        >
          A collective of developers, designers, and visionaries building
          relentlessly at the <span className="text-black dark:text-white font-semibold">edge { }</span> of what&apos;s possible.
        </motion.p>

        {/* Stats row */}
        {/* <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <CountPill label="Members" value="2.4k+" delay={0.75} />
          <CountPill label="Projects" value="180+" delay={0.85} />
          <CountPill label="Countries" value="34" delay={0.95} />
        </motion.div> */}
      </div>

    </section>
  );
};

export default TeamHero;