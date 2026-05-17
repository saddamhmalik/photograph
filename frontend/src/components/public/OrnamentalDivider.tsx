export function OrnamentalDivider() {
  return (
    <div className="ornamental-divider mx-auto flex max-w-4xl items-center justify-center gap-4 px-6 py-6" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/70" />
      <span className="ornamental-diamond h-2 w-2 rotate-45 bg-gold/80" />
      <span className="font-display text-gold/50 text-lg">✦</span>
      <span className="ornamental-diamond h-2 w-2 rotate-45 bg-gold/80" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/70" />
    </div>
  );
}
