"use client";

import { CursorGlow } from "@/components/animations/CursorGlow";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { SiteBackground } from "@/components/public/SiteBackground";
import { SmoothScroll } from "@/providers/SmoothScroll";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <CursorGlow />
      <SiteBackground />
      {children}
    </SmoothScroll>
  );
}
