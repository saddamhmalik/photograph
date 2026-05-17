"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/albums", label: "Albums" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin && !localStorage.getItem("token")) {
      router.replace("/admin/login");
    }
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-white/5 bg-surface p-6">
        <Link href="/" className="font-display text-xl tracking-widest uppercase text-gold">
          Studio
        </Link>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-4 py-3 text-sm uppercase tracking-widest transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-gold/10 text-gold"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="mt-10 text-xs uppercase tracking-widest text-foreground/40 hover:text-gold"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/admin/login");
          }}
        >
          Sign Out
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
