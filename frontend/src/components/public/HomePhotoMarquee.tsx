"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HomePhotoMarqueeProps {
  images: string[];
  variant?: "light" | "dark";
}

function MarqueeRow({
  images,
  reverse,
}: {
  images: string[];
  reverse?: boolean;
}) {
  const track = [...images, ...images];
  const direction = reverse ? "marquee-reverse" : "marquee-forward";

  return (
    <div className="marquee-mask relative overflow-hidden py-3">
      <div className={"marquee-track flex w-max gap-4 " + direction}>
        {track.map((src, i) => (
          <div
            key={src + "-" + i}
            className="relative h-36 w-52 shrink-0 overflow-hidden rounded-xl border border-gold/20 shadow-lg shadow-black/40 md:h-44 md:w-64"
          >
            <Image src={src} alt="" fill className="object-cover" sizes="260px" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePhotoMarquee({ images, variant = "dark" }: HomePhotoMarqueeProps) {
  if (images.length < 3) return null;

  const rowA = images.filter((_, i) => i % 2 === 0);
  const rowB = images.filter((_, i) => i % 2 === 1);
  const sectionClass =
    "relative overflow-hidden py-10 " + (variant === "light" ? "bg-surface/30" : "");

  return (
    <section className={sectionClass}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="space-y-4"
      >
        <MarqueeRow images={rowA.length ? rowA : images} />
        <MarqueeRow images={rowB.length ? rowB : images} reverse />
      </motion.div>
    </section>
  );
}
