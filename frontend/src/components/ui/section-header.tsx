"use client";

import { motion } from "framer-motion";
import { FadeReveal } from "@/components/animations/FadeReveal";
import { ShimmerHeading } from "@/components/animations/ShimmerHeading";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <FadeReveal className={cn(align === "center" && "text-center", className)}>
      <motion.p
        className="text-xs uppercase tracking-[0.4em] text-gold"
        initial={{ opacity: 0, x: align === "center" ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {label}
      </motion.p>
      <ShimmerHeading
        className="mt-3 block text-4xl md:text-5xl lg:text-6xl"
        as="h2"
      >
        {title}
      </ShimmerHeading>
      <motion.div
        className={cn(
          "mt-4 h-px bg-gradient-to-r from-gold via-gold/50 to-transparent",
          align === "center" ? "mx-auto w-24" : "w-16"
        )}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: align === "center" ? "center" : "left" }}
      />
    </FadeReveal>
  );
}
