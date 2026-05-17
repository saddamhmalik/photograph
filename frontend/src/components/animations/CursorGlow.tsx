"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });
  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(201,169,98,0.09), transparent 65%)`;

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[5] mix-blend-screen"
      style={{ background }}
      aria-hidden
    />
  );
}
