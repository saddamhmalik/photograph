"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { FadeReveal } from "@/components/animations/FadeReveal";
import { api } from "@/lib/api";
import { mockSiteData } from "@/lib/mock-data";
import { getMediaUrl } from "@/lib/utils";
import type { Album, PortfolioCategory } from "@/types";

export default function PortfolioPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.public
      .getPortfolio(category ?? undefined)
      .then((res) => {
        setAlbums(res.albums);
        setCategories(res.categories ?? []);
      })
      .catch(() => {
        setAlbums(mockSiteData.featured_albums);
        setCategories([]);
      });
  }, [category]);

  useDragScroll(gridRef, { enabled: albums.length > 0 });

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Portfolio</p>
          <h1 className="mt-2 font-display text-5xl font-light">Our Work</h1>
        </FadeReveal>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setCategory(null)}
            className={`px-5 py-2 text-xs uppercase tracking-widest transition-all ${
              !category
                ? "bg-gold text-background"
                : "border border-white/10 hover:border-gold/40"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.uuid}
              onClick={() => setCategory(cat.slug)}
              className={`px-5 py-2 text-xs uppercase tracking-widest transition-all ${
                category === cat.slug
                  ? "bg-gold text-background"
                  : "border border-white/10 hover:border-gold/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        <div
          ref={gridRef}
          className="masonry mt-12 cursor-grab touch-pan-y data-[dragging=true]:cursor-grabbing"
        >
          {albums.map((album, i) => (
            <div key={album.uuid} className="masonry-item">
              <Link
                href={`/albums/${album.slug}`}
                className="group relative block cursor-pointer overflow-hidden rounded-xl"
              >
                <div
                  className={`relative w-full ${
                    i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={getMediaUrl(album.cover_path ?? "")}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-background/0 transition-colors group-hover:bg-background/30" />
                  <motion.div className="absolute inset-x-0 bottom-0 translate-y-full p-6 transition-transform group-hover:translate-y-0">
                    <h3 className="font-display text-2xl">{album.title}</h3>
                    {album.location && (
                      <p className="text-sm text-gold">{album.location}</p>
                    )}
                    {album.category?.name && (
                      <p className="mt-1 text-xs uppercase tracking-widest text-foreground/60">
                        {album.category.name}
                      </p>
                    )}
                  </motion.div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {albums.length === 0 && (
          <p className="mt-16 text-center text-foreground/50">
            No albums in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
