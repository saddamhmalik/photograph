"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { getMediaUrl } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import type { Album, HomepageSections } from "@/types";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface FeaturedAlbumsProps {
  albums: Album[];
  section?: HomepageSections["featured"];
}

export function FeaturedAlbums({ albums, section }: FeaturedAlbumsProps) {
  if (!albums.length) return null;

  return (
    <section className="relative py-24 px-6">
      <div className="pointer-events-none absolute inset-0 aurora-layer opacity-30" aria-hidden />
      <motion.div className="relative mx-auto max-w-7xl">
        <SectionHeader
          label={section?.label ?? "Portfolio"}
          title={section?.title ?? "Featured Stories"}
        />

        <div className="mt-12 hidden lg:block">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="rounded-2xl overflow-hidden"
          >
            {albums.map((album) => (
              <SwiperSlide key={album.uuid}>
                <Link
                  href={`/albums/${album.slug}`}
                  className="group relative block aspect-[21/9] overflow-hidden"
                >
                  <Image
                    src={getMediaUrl(album.cover_path ?? "")}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10">
                    <p className="text-xs uppercase tracking-widest text-gold">
                      {album.location}
                    </p>
                    <h3 className="mt-2 font-display text-4xl">{album.title}</h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {albums.map((album) => (
            <motion.div
              key={album.uuid}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.94, filter: "blur(8px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <Tilt3D>
                <Link
                  href={`/albums/${album.slug}`}
                  className="card-hover group relative block aspect-[4/5] overflow-hidden rounded-xl"
                >
                <Image
                  src={getMediaUrl(album.cover_path ?? "")}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="font-display text-2xl">{album.title}</h3>
                  <p className="mt-1 text-sm text-foreground/60">{album.location}</p>
                </div>
                </Link>
              </Tilt3D>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
