"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { FadeReveal } from "@/components/animations/FadeReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { mockSiteData } from "@/lib/mock-data";
import { cn, getMediaUrl } from "@/lib/utils";
import type { Album } from "@/types";

export default function AlbumPage({
  params,
}: {
  params: Promise<{ albumSlug: string }>;
}) {
  const { albumSlug } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideshow, setSlideshow] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async (pwd?: string) => {
      try {
        const res = await api.public.getAlbum(albumSlug, pwd);
        setAlbum(res.album);
        setNeedsPassword(false);
        setNotFound(false);
        setCurrentIndex(0);
      } catch (err) {
        const message = err instanceof Error ? err.message.toLowerCase() : "";
        if (message.includes("password")) {
          setAlbum(null);
          setNotFound(false);
          setNeedsPassword(true);
          return;
        }
        const mock = mockSiteData.featured_albums.find((a) => a.slug === albumSlug);
        if (mock) {
          setAlbum(mock);
          setNeedsPassword(false);
          setNotFound(false);
          return;
        }
        setAlbum(null);
        setNeedsPassword(false);
        setNotFound(true);
      }
    };
    load();
  }, [albumSlug]);

  const media = album?.media?.length
    ? album.media
    : album?.cover_path
      ? [{ uuid: "cover", type: "image", path: album.cover_path, sort_order: 0 }]
      : [];

  const { consumeClick: consumeGridClick } = useDragScroll(gridRef, {
    enabled: !slideshow && media.length > 0,
  });

  const goPrev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + media.length) % media.length),
    [media.length]
  );
  const goNext = useCallback(
    () => setCurrentIndex((i) => (i + 1) % media.length),
    [media.length]
  );

  const toggleFullscreen = useCallback(async () => {
    const el = slideshowRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === slideshowRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!slideshow || media.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slideshow, media.length, goPrev, goNext, toggleFullscreen]);

  useEffect(() => {
    if (!slideshow && document.fullscreenElement === slideshowRef.current) {
      document.exitFullscreen();
    }
  }, [slideshow]);

  useEffect(() => {
    if (!slideshow || media.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % media.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideshow, media.length]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <h1 className="font-display text-4xl font-light">Album not found</h1>
        <p className="mt-4 max-w-md text-foreground/60">
          This gallery does not exist or is no longer public.
        </p>
        <Button asChild className="mt-8">
          <Link href="/portfolio">Back to portfolio</Link>
        </Button>
      </div>
    );
  }

  if (needsPassword && !album) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <FadeReveal className="glass max-w-md w-full rounded-2xl p-8">
          <h1 className="font-display text-3xl">Private Gallery</h1>
          <p className="mt-2 text-foreground/60">Enter the password to view this album.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await api.public.getAlbum(albumSlug, password);
                setAlbum(res.album);
                setNeedsPassword(false);
              } catch {
                alert("Invalid password");
              }
            }}
          >
            <Input
              type="password"
              placeholder="Album password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Unlock Gallery
            </Button>
          </form>
        </FadeReveal>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <FadeReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-gold">{album.location}</p>
          <h1 className="mt-2 font-display text-4xl font-light md:text-6xl">{album.title}</h1>
          {album.description && (
            <p className="mt-4 max-w-2xl text-foreground/60">{album.description}</p>
          )}
        </FadeReveal>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setSlideshow(true)}
              className={cn(
                "rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-all",
                slideshow ? "bg-gold text-background" : "text-foreground/60 hover:text-foreground"
              )}
            >
              Slideshow
            </button>
            <button
              type="button"
              onClick={() => setSlideshow(false)}
              className={cn(
                "rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-all",
                !slideshow ? "bg-gold text-background" : "text-foreground/60 hover:text-foreground"
              )}
            >
              Grid
            </button>
          </div>
          {slideshow && media.length > 0 && (
            <>
              <span className="text-xs text-foreground/40">
                {currentIndex + 1} / {media.length}
              </span>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-foreground/60 transition-colors hover:border-gold/40 hover:text-gold"
              >
                {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              </button>
            </>
          )}
        </div>

        {slideshow ? (
          <div className="mt-10">
            <div
              ref={slideshowRef}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-black/50",
                "aspect-[16/10]",
                "fullscreen:fixed fullscreen:inset-0 fullscreen:z-[100] fullscreen:flex fullscreen:aspect-auto fullscreen:h-screen fullscreen:w-screen fullscreen:max-h-none fullscreen:rounded-none fullscreen:border-0 fullscreen:bg-black"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={media[currentIndex]?.uuid ?? currentIndex}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-full min-h-0 w-full flex-1"
                >
                  <Image
                    src={getMediaUrl(
                      media[currentIndex]?.path ?? album.cover_path ?? ""
                    )}
                    alt={album.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {isFullscreen && (
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 md:p-6">
                  <span className="pointer-events-auto max-w-[50%] truncate rounded-full glass px-4 py-2 text-xs uppercase tracking-widest text-foreground/80">
                    {album.title}
                  </span>
                  <span className="pointer-events-auto rounded-full glass px-4 py-2 text-xs tabular-nums text-foreground/80">
                    {currentIndex + 1} / {media.length}
                  </span>
                </div>
              )}

              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass text-lg transition-transform hover:scale-105 md:left-8"
                    onClick={goPrev}
                    aria-label="Previous"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass text-lg transition-transform hover:scale-105 md:right-8"
                    onClick={goNext}
                    aria-label="Next"
                  >
                    →
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={toggleFullscreen}
                className={cn(
                  "absolute right-4 top-4 z-20 rounded-full glass px-4 py-2 text-xs uppercase tracking-widest transition-all hover:scale-105",
                  isFullscreen ? "opacity-100" : "opacity-70 hover:opacity-100"
                )}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? "Exit" : "Fullscreen"}
              </button>
            </div>

            {media.length > 1 && !isFullscreen && (
              <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                {media.map((item, i) => (
                  <button
                    key={item.uuid}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      i === currentIndex
                        ? "border-gold scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={getMediaUrl(item.path)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <motion.div
            ref={gridRef}
            className="masonry mt-12 cursor-grab touch-pan-y data-[dragging=true]:cursor-grabbing"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {media.map((item, i) => (
              <motion.div
                key={item.uuid}
                className="masonry-item cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                onClick={() => {
                  if (consumeGridClick()) return;
                  setCurrentIndex(i);
                  setSlideshow(true);
                }}
              >
                <div
                  className={cn(
                    "card-hover relative w-full overflow-hidden rounded-xl",
                    i % 2 ? "aspect-[4/5]" : "aspect-square"
                  )}
                >
                  <Image
                    src={getMediaUrl(item.path)}
                    alt={item.alt_text ?? album.title}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
