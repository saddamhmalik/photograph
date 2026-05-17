import { getMediaUrl } from "@/lib/utils";
import type { Album, AlbumMedia } from "@/types";

function mediaImageUrl(item: AlbumMedia): string {
  const path = item.webp_path ?? item.path ?? item.thumbnail_path ?? "";
  return path ? getMediaUrl(path) : "";
}

export function collectAlbumGalleryImages(albums: Album[], max = 24): string[] {
  const seen = new Set<string>();
  const list: string[] = [];

  const push = (src?: string | null) => {
    const url = src?.trim();
    if (!url || seen.has(url)) return;
    seen.add(url);
    list.push(url);
  };

  for (const album of albums) {
    push(getMediaUrl(album.cover_path ?? ""));

    const items = [...(album.media ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    for (const item of items) {
      if (item.type && item.type !== "image") continue;
      push(mediaImageUrl(item));
    }
  }

  return list.slice(0, max);
}
