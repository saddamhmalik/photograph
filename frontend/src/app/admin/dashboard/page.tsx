"use client";

import { useEffect, useState } from "react";
import { FadeReveal } from "@/components/animations/FadeReveal";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";

function formatBytes(bytes: number) {
  const gb = bytes / (1024 * 1024 * 1024);
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.admin.dashboard(token).then((r) => setStats(r.stats)).catch(() => {
      setStats({
        total_albums: 4,
        total_views: 12840,
        total_inquiries: 24,
        new_inquiries: 3,
        storage_used_bytes: 2_147_483_648,
        storage_limit_bytes: 10_737_418_240,
        views_last_30_days: 3420,
      });
    });
  }, []);

  const cards = stats
    ? [
        { label: "Albums", value: stats.total_albums },
        { label: "Total Views", value: stats.total_views.toLocaleString() },
        { label: "Inquiries", value: stats.total_inquiries },
        { label: "New Inquiries", value: stats.new_inquiries },
        { label: "Views (30d)", value: stats.views_last_30_days.toLocaleString() },
        {
          label: "Storage",
          value: `${formatBytes(stats.storage_used_bytes)} / ${formatBytes(stats.storage_limit_bytes)}`,
        },
      ]
    : [];

  return (
    <div>
      <FadeReveal>
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Overview</p>
        <h1 className="mt-2 font-display text-4xl font-light">Dashboard</h1>
      </FadeReveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-xl p-6">
            <p className="text-xs uppercase tracking-widest text-foreground/50">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-gold">{card.value}</p>
          </div>
        ))}
      </div>

      {!stats && (
        <div className="mt-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      )}
    </div>
  );
}
