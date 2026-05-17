"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MediaImage } from "@/components/ui/media-image";
import { useEffect, useState } from "react";

interface HeroSlidingGalleryProps {
  images: string[];
  intervalMs?: number;
}

export function HeroSlidingGallery({
  images,
  intervalMs = 5500,
}: HeroSlidingGalleryProps) {
  const slides = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (!slides.length) return null;

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.08,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1.05,
    },
    exit: (d: number) => ({
      x: d > 0 ? "-35%" : "35%",
      opacity: 0,
      scale: 1.12,
    }),
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={slides[index]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="hero-ken-burns absolute inset-0"
        >
          <MediaImage
            src={slides[index]}
            alt=""
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="100vw"
            quality={85}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
