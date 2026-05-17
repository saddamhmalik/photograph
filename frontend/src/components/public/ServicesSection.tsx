"use client";

import { StaggerItem, StaggerReveal } from "@/components/animations/StaggerReveal";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { SectionHeader } from "@/components/ui/section-header";
import type { HomepageSections } from "@/types";

interface Service {
  name: string;
  description: string;
}

interface ServicesSectionProps {
  services: Service[];
  section?: HomepageSections["services"];
}

export function ServicesSection({ services, section }: ServicesSectionProps) {
  if (!services?.length) return null;

  return (
    <section className="py-24 px-6 bg-surface/50">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label={section?.label ?? "Services"}
          title={section?.title ?? "What We Create"}
        />

        <StaggerReveal className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {services.map((service, i) => (
            <StaggerItem key={service.name}>
              <Tilt3D className="h-full">
                <div className="card-hover group relative h-full overflow-hidden rounded-2xl border border-white/5 p-8">
                  <span className="font-display text-6xl text-gold/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-2xl">{service.name}</h3>
                  <p className="mt-3 text-foreground/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Tilt3D>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
