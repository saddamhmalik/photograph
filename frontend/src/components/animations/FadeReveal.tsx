"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function FadeReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: FadeRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px", amount: 0.15 });

  const offsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: "blur(12px)", scale: 0.98, ...offsets[direction] }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)", scale: 1 }
          : {}
      }
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
