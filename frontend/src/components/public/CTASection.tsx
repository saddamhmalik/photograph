"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Magnetic } from "@/components/animations/Magnetic";
import { ShimmerHeading } from "@/components/animations/ShimmerHeading";
import { Button } from "@/components/ui/button";
import type { HomepageSections } from "@/types";

interface CTASectionProps {
  whatsapp?: string;
  cta?: HomepageSections["cta"];
}

export function CTASection({ whatsapp, cta }: CTASectionProps) {
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I'd like to inquire about your photography services.")}`
    : null;

  return (
    <section className="relative overflow-hidden py-32 px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(201,169,98,0.14),transparent)]" />
      <div className="aurora-layer absolute inset-0 opacity-40" aria-hidden />
      <motion.div
        className="relative mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <ShimmerHeading className="text-4xl md:text-6xl text-gradient-gold">
          {cta?.title ?? "Let's Create Something Timeless"}
        </ShimmerHeading>
        <motion.p
          className="mt-6 text-lg text-foreground/60"
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          {cta?.subtitle ??
            "Your story deserves to be told with artistry, emotion, and cinematic beauty."}
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          <Magnetic strength={0.2}>
            <Button asChild size="lg" className="shadow-lg shadow-gold/20">
              <Link href="/contact">{cta?.primary_button ?? "Start Your Journey"}</Link>
            </Button>
          </Magnetic>
          {waLink && (
            <Magnetic strength={0.16}>
              <Button asChild variant="outline" size="lg">
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  {cta?.secondary_button ?? "WhatsApp Us"}
                </a>
              </Button>
            </Magnetic>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
