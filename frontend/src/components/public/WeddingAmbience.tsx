"use client";

export function WeddingAmbience() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="mandala-glow absolute left-1/2 top-1/3 h-[min(90vw,520px)] w-[min(90vw,520px)] opacity-[0.14]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(201,169,98,0.12),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(180,60,50,0.08),transparent_45%)]" />
      {[
        { top: "12%", left: "8%", delay: 0 },
        { top: "22%", right: "12%", delay: 1.2 },
        { top: "55%", left: "15%", delay: 0.6 },
        { top: "70%", right: "18%", delay: 2 },
        { top: "40%", left: "45%", delay: 1.8 },
        { top: "85%", left: "35%", delay: 0.9 },
      ].map((dot, i) => (
        <span
          key={i}
          className="bokeh-dot absolute h-2 w-2 rounded-full bg-gold/80 shadow-[0_0_20px_rgba(201,169,98,0.8)]"
          style={{
            top: dot.top,
            left: "left" in dot ? dot.left : undefined,
            right: "right" in dot ? dot.right : undefined,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
      <div className="shimmer-line absolute left-0 top-[18%] h-px w-full opacity-40" />
      <div className="shimmer-line absolute bottom-[22%] left-0 h-px w-full opacity-30" />
    </div>
  );
}
