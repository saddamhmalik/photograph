"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Magnetic } from "@/components/animations/Magnetic";
import { ParticleField } from "@/components/animations/ParticleField";
import { TextReveal } from "@/components/animations/TextReveal";
import { WeddingAmbience } from "@/components/public/WeddingAmbience";
import { Button } from "@/components/ui/button";
import type { HomepageSections, Photographer } from "@/types";

interface HeroSectionProps {
  photographer: Photographer;
  hero?: HomepageSections["hero"];
  galleryImages: string[];
}

export function HeroSection({ photographer, hero, galleryImages }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Use the provided hero_video_url if it's a YouTube link, or fallback to a cinematic placeholder
  const videoUrl = photographer.hero_video_url || "https://www.youtube.com/watch?v=ufyi9-AqBb0";
  let youtubeId = "ufyi9-AqBb0";
  const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (match) {
    youtubeId = match[1];
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(145deg,#1a1410_0%,#0f0d0b_45%,#12100e_100%)]"
        aria-hidden
      />

      <motion.div
        className="absolute inset-0 will-change-transform bg-black"
        style={{ y: bgY, scale: bgScale }}
      >
        <div className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-[100vh] w-[100vw] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${youtubeId}&playsinline=1&iv_load_policy=3`}
            className="pointer-events-none absolute left-0 top-0 h-full w-full select-none border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            tabIndex={-1}
          />
        </div>
      </motion.div>

      <WeddingAmbience />
      <ParticleField density={56} />

      <div className="hero-overlay absolute inset-0 z-[2]" aria-hidden />
      <div className="hero-vignette absolute inset-0 z-[2]" aria-hidden />
      <div className="hero-grain absolute inset-0 z-[2] opacity-50" aria-hidden />
      <div className="aurora-layer absolute inset-0 z-[2] opacity-60" aria-hidden />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.35 }}
      >
        <motion.p
          className="mb-4 text-xs uppercase tracking-[0.4em] text-gold drop-shadow-sm"
          initial={{ opacity: 0, letterSpacing: "0.15em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 1.4, delay: 0.5 }}
        >
          {photographer.city}, {photographer.country}
        </motion.p>
        <TextReveal
          text={photographer.business_name}
          className="font-display text-5xl font-light tracking-wide text-foreground drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] md:text-7xl lg:text-8xl"
        />
        {photographer.tagline && (
          <motion.p
            className="mt-6 max-w-xl text-lg text-foreground/85 md:text-xl drop-shadow-md"
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {photographer.tagline}
          </motion.p>
        )}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.85 }}
        >
          <Magnetic strength={0.22}>
            <Button asChild size="lg" className="shadow-lg shadow-gold/25">
              <Link href="/portfolio">{hero?.primary_cta ?? "View Portfolio"}</Link>
            </Button>
          </Magnetic>
          <Magnetic strength={0.18}>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">{hero?.secondary_cta ?? "Book a Session"}</Link>
            </Button>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/40">Scroll</span>
        <div className="h-14 w-px bg-gradient-to-b from-gold/80 to-transparent" />
      </motion.div>
    </section>
  );
}
