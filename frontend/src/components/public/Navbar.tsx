"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  businessName: string;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ businessName }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 md:py-5"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.nav
        style={{ backgroundColor: scrolled ? "rgba(20,20,20,0.95)" : undefined }}
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 md:px-6",
          scrolled
            ? "border-gold/20 shadow-lg shadow-black/30 glass"
            : "border-white/10 glass"
        )}
      >
        <Link
          href="/"
          className="font-display text-lg tracking-widest text-foreground uppercase md:text-xl"
        >
          {businessName}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative text-xs uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-gold"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={cn("block h-0.5 w-6 bg-gold transition-all", open && "translate-y-1.5 rotate-45")} />
          <span className={cn("mt-1.5 block h-0.5 w-6 bg-gold transition-all", open && "opacity-0")} />
          <span className={cn("mt-1.5 block h-0.5 w-6 bg-gold transition-all", open && "-translate-y-2 -rotate-45")} />
        </button>
      </motion.nav>

      {open && (
        <motion.div
          className="mt-2 glass rounded-2xl p-6 md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm uppercase tracking-widest text-foreground/80 hover:text-gold"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
