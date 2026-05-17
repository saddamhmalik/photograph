"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FadeReveal } from "@/components/animations/FadeReveal";

interface AboutSectionProps {
  label: string;
  bio: string;
  images: string[];
}

export function AboutSection({ label, bio, images }: AboutSectionProps) {
  const floats = images.slice(0, 3);

  return (
    <section className="relative overflow-hidden py-28 px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,169,98,0.08),transparent)]" />

      {floats[0] && (
        <motion.div
          className="float-drift-a pointer-events-none absolute -left-8 top-16 hidden h-48 w-36 overflow-hidden rounded-2xl border border-gold/25 shadow-2xl md:block lg:h-56 lg:w-44"
          initial={{ opacity: 0, x: -60, rotate: -8 }}
          whileInView={{ opacity: 0.85, x: 0, rotate: -6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={floats[0]} alt="" fill className="object-cover" sizes="180px" />
        </motion.div>
      )}

      {floats[1] && (
        <motion.div
          className="float-drift-b pointer-events-none absolute -right-6 top-1/3 hidden h-52 w-40 overflow-hidden rounded-2xl border border-gold/25 shadow-2xl md:block"
          initial={{ opacity: 0, x: 60, rotate: 8 }}
          whileInView={{ opacity: 0.85, x: 0, rotate: 5 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.15 }}
        >
          <Image src={floats[1]} alt="" fill className="object-cover" sizes="200px" />
        </motion.div>
      )}

      <FadeReveal className="relative mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">{label}</p>
        <motion.p
          className="mt-8 font-display text-2xl leading-relaxed text-foreground/85 md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {bio}
        </motion.p>
      </FadeReveal>

      {floats[2] && (
        <motion.div
          className="pointer-events-none absolute bottom-8 left-1/2 hidden h-32 w-48 -translate-x-1/2 overflow-hidden rounded-xl border border-gold/20 opacity-70 lg:block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Image src={floats[2]} alt="" fill className="object-cover" sizes="200px" />
        </motion.div>
      )}
    </section>
  );
}
