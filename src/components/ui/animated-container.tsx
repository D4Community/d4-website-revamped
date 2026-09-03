"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

type ViewAnimationProps = {
  delay?: number;
  className?: React.ComponentProps<typeof motion.div>["className"];
  children: React.ReactNode;
};

export default function AnimatedContainer({
  className,
  delay = 0,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ translateY: 12, opacity: 0 }}
      whileInView={{ translateY: 0, opacity: 1 }}
      // '100px' pre-triggers the animation before the element fully rolls into view
      viewport={{ once: true, margin: "100px" }}
      // Accelerated duration (0.3s) and smoother spring-like ease
      transition={{ delay, duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}