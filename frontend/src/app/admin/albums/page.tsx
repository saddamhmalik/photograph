"use client";

import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, getAuthToken } from "@/lib/api";
import { revalidatePublicCache } from "@/lib/revalidate-public";
import type { Album } from "@/types";

export default function AdminAlbumsPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = getAuthToken();
    if (!token) return;
    setLoading(true);
    try {
      const list = await api.admin.albums(token);
      setAlbums(list);
    } catch {
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createAlbum = async () => {
    const token = getAuthToken();
    if (!token || !title.trim()) return;
    setCreating(true);
    try {
      const res = await api.admin.createAlbum(token, {
        title: title.trim(),
        is_public: true,
        is_featured: false,
      });
      setTitle("");
      router.push(`/admin/albums/${res.album.uuid}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create album");
    } finally {
      setCreating(false);
    }
  };

  const deleteAlbum = async (album: Album) => {
    if (!confirm(`Delete "${album.title}"? This cannot be undone.`)) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await api.admin.deleteAlbum(token, album.uuid);
      await revalidatePublicCache(album.slug);
      router.refresh();
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-gold">Manage</p>
      <h1 className="mt-2 font-display text-4xl font-light">Albums</h1>
      <p className="mt-2 text-sm text-foreground/50">
        Create an album, then open it to upload photos to Cloudflare R2.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="New album title (e.g. Arjun Weds Anjani)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createAlbum()}
        />
        <Button onClick={createAlbum} disabled={creating || !title.trim()}>
          {creating ? "Creating..." : "Create & Add Photos"}
        </Button>
      </div>

      {loading ? (
        <div className="mt-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : albums.length === 0 ? (
        <p className="mt-16 text-center text-foreground/50">No albums yet. Create one above.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div key={album.uuid} className="glass overflow-hidden rounded-xl">
              <div className="relative aspect-[4/3] bg-surface">
                {album.cover_path ? (
                  <MediaImage
                    src={album.cover_path}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-foreground/30">
                    No photos yet
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-xl">{album.title}</h3>
                <p className="mt-1 text-sm text-foreground/50">
                  {album.view_count ?? 0} views · {album.is_public ? "Public" : "Private"}
                  {album.category?.name ? ` · ${album.category.name}` : ""}
                  {album.is_featured ? " · Featured" : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/admin/albums/${album.uuid}`}>Manage Photos</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/albums/${album.slug}`} target="_blank">
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => deleteAlbum(album)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
