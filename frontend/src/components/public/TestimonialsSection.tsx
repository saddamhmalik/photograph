"use client";

import { motion } from "framer-motion";
import { StaggerItem, StaggerReveal } from "@/components/animations/StaggerReveal";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { SectionHeader } from "@/components/ui/section-header";
import type { HomepageSections, Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  section?: HomepageSections["testimonials"];
}

export function TestimonialsSection({ testimonials, section }: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  return (
    <section className="relative overflow-hidden py-24 px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          label={section?.label ?? "Kind Words"}
          title={section?.title ?? "Client Love"}
          align="center"
          className="mb-16"
        />

        <StaggerReveal className="grid gap-8 md:grid-cols-2" stagger={0.14}>
          {testimonials.map((t) => (
            <StaggerItem key={t.uuid}>
              <Tilt3D>
                <blockquote className="card-hover glass block rounded-2xl p-8 md:p-10">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                      <span key={i} className="text-sm text-gold">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="font-display text-xl italic leading-relaxed text-foreground/90">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <footer className="mt-6">
                    <cite className="not-italic">
                      <span className="block font-medium text-gold">{t.client_name}</span>
                      {t.event_type && (
                        <span className="text-sm text-foreground/50">{t.event_type}</span>
                      )}
                    </cite>
                  </footer>
                </blockquote>
              </Tilt3D>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
