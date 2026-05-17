export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="site-orb site-orb-a" />
      <div className="site-orb site-orb-b" />
      <div className="site-orb site-orb-c" />
      <div className="site-grain absolute inset-0 opacity-[0.22]" />
    </div>
  );
}
