import type { Photographer } from "@/types";

interface FooterProps {
  photographer: Photographer;
}

export function Footer({ photographer }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="font-display text-lg tracking-widest uppercase">
          {photographer.business_name}
        </p>
        <div className="flex gap-6">
          {photographer.social_links &&
            Object.entries(photographer.social_links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-foreground/50 hover:text-gold capitalize"
              >
                {key}
              </a>
            ))}
        </div>
        <p className="text-sm text-foreground/40">© {year}</p>
      </div>
      <p className="mx-auto mt-8 max-w-7xl border-t border-white/5 pt-6 text-center text-xs text-foreground/35">
        Built with{" "}
        <span className="text-gold" aria-hidden>
          ♥
        </span>{" "}
        by{" "}
        <a
          href="https://codikal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/50 transition-colors hover:text-gold"
        >
          Codikal.com
        </a>
      </p>
    </footer>
  );
}
