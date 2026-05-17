"use client";

import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, getAuthToken } from "@/lib/api";
import { revalidatePublicCache } from "@/lib/revalidate-public";
import type { Album, AlbumMedia, PortfolioCategory } from "@/types";

export default function AdminAlbumEditPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [password, setPassword] = useState("");
  const [removingPassword, setRemovingPassword] = useState(false);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [categoryUuid, setCategoryUuid] = useState<string>("");

  const load = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    setLoading(true);
    try {
      const [res, categoriesRes] = await Promise.all([
        api.admin.getAlbum(token, uuid),
        api.admin.categories(token),
      ]);
      const a = res.album;
      setAlbum(a);
      setCategories(categoriesRes.categories);
      setTitle(a.title);
      setDescription(a.description ?? "");
      setLocation(a.location ?? "");
      setEventDate(a.event_date ?? "");
      setIsPublic(a.is_public ?? true);
      setIsFeatured(a.is_featured ?? false);
      setCategoryUuid(a.category?.uuid ?? "");
    } catch {
      alert("Album not found");
      router.push("/admin/albums");
    } finally {
      setLoading(false);
    }
  }, [uuid, router]);

  useEffect(() => {
    load();
  }, [load]);

  const saveAlbum = async () => {
    const token = getAuthToken();
    if (!token || !album) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title,
        description,
        location,
        event_date: eventDate || null,
        is_public: isPublic,
        is_featured: isFeatured,
        category_uuid: categoryUuid || null,
      };
      if (password.trim()) {
        payload.password = password.trim();
        payload.is_password_protected = true;
      }
      const res = await api.admin.updateAlbum(token, uuid, payload);
      setAlbum(res.album);
      setPassword("");
      await revalidatePublicCache(res.album.slug);
      router.refresh();
      alert("Album saved");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    const token = getAuthToken();
    if (!token || !files?.length) return;
    setUploading(true);
    const list = Array.from(files);
    try {
      for (let i = 0; i < list.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${list.length}...`);
        await api.admin.uploadMedia(token, uuid, [list[i]]);
      }
      setUploadProgress("");
      await load();
      await revalidatePublicCache(album?.slug);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const deleteMedia = async (media: AlbumMedia) => {
    if (!confirm("Remove this photo from the album?")) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await api.admin.deleteMedia(token, uuid, media.uuid);
      await revalidatePublicCache(album?.slug);
      router.refresh();
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const removeGalleryPassword = async () => {
    if (!album?.is_password_protected) return;
    if (!confirm("Remove the gallery password? Anyone with the link can view this album.")) return;
    const token = getAuthToken();
    if (!token) return;
    setRemovingPassword(true);
    try {
      const res = await api.admin.updateAlbum(token, uuid, { remove_password: true });
      setAlbum(res.album);
      setPassword("");
      alert("Gallery password removed");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not remove password");
    } finally {
      setRemovingPassword(false);
    }
  };

  const deleteAlbum = async () => {
    if (!album || !confirm(`Delete "${album.title}" and all photos?`)) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await api.admin.deleteAlbum(token, uuid);
      await revalidatePublicCache(album.slug);
      router.refresh();
      router.push("/admin/albums");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!album) return null;

  const media = album.media ?? [];

  return (
    <div>
      <Link
        href="/admin/albums"
        className="text-xs uppercase tracking-widest text-foreground/50 hover:text-gold"
      >
        ← Back to albums
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Edit album</p>
          <h1 className="mt-2 font-display text-4xl font-light">{album.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/albums/${album.slug}`} target="_blank">
              Preview
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-red-400" onClick={deleteAlbum}>
            Delete album
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="glass space-y-4 rounded-xl p-6">
          <h2 className="font-display text-xl">Album details</h2>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="flex w-full border border-white/10 bg-white/5 px-4 py-3 text-sm focus-visible:border-gold focus-visible:outline-none"
          />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          <Input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-foreground/50">
              Portfolio category
            </p>
            <select
              value={categoryUuid}
              onChange={(e) => setCategoryUuid(e.target.value)}
              className="flex h-11 w-full border border-white/10 bg-white/5 px-4 text-sm focus-visible:border-gold focus-visible:outline-none"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.uuid} value={cat.uuid}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-foreground/40">
              Shown under this filter on the{" "}
              <Link href="/portfolio" target="_blank" className="text-gold hover:underline">
                portfolio page
              </Link>
              . Manage labels in{" "}
              <Link href="/admin/categories" className="text-gold hover:underline">
                Categories
              </Link>
              .
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="accent-gold"
            />
            Public album
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-gold"
            />
            Featured on homepage
          </label>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-foreground/50">Gallery password</p>
            {album.is_password_protected ? (
              <p className="text-sm text-gold">Password protection is on</p>
            ) : (
              <p className="text-sm text-foreground/50">No password set</p>
            )}
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={album.is_password_protected ? "Set a new password" : "Set a password (optional)"}
            />
            {album.is_password_protected && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-red-400/30 text-red-300 hover:bg-red-400/10"
                onClick={removeGalleryPassword}
                disabled={removingPassword}
              >
                {removingPassword ? "Removing..." : "Remove gallery password"}
              </Button>
            )}
          </div>
          <Button onClick={saveAlbum} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="font-display text-xl">Photos</h2>
          <p className="mt-1 text-sm text-foreground/50">
            JPEG, PNG, WebP, HEIC, or MP4 · max 100MB each
          </p>

          <div
            className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 px-6 py-12 transition-colors hover:border-gold/60"
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-gold");
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove("border-gold")}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-gold");
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,.heic,.heif"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <p className="text-gold text-sm uppercase tracking-widest">
              {uploading ? uploadProgress || "Uploading..." : "Click or drop photos here"}
            </p>
          </div>

          {media.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {media.map((item) => (
                <div key={item.uuid} className="group relative aspect-square overflow-hidden rounded-lg bg-surface">
                  <MediaImage
                    src={item.path}
                    alt={item.alt_text ?? ""}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <button
                    type="button"
                    onClick={() => deleteMedia(item)}
                    className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-red-300 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
