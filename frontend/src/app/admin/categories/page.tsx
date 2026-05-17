"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, getAuthToken } from "@/lib/api";
import { revalidatePublicCache } from "@/lib/revalidate-public";
import type { PortfolioCategory } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.admin.categories(token);
      setCategories(res.categories);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createCategory = async () => {
    const token = getAuthToken();
    if (!token || !name.trim()) return;
    setCreating(true);
    try {
      await api.admin.createCategory(token, { name: name.trim() });
      setName("");
      await revalidatePublicCache();
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not create category");
    } finally {
      setCreating(false);
    }
  };

  const saveEdit = async (cat: PortfolioCategory) => {
    const token = getAuthToken();
    if (!token || !editName.trim()) return;
    try {
      await api.admin.updateCategory(token, cat.uuid, { name: editName.trim() });
      setEditingId(null);
      await revalidatePublicCache();
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not update category");
    }
  };

  const deleteCategory = async (cat: PortfolioCategory) => {
    if (
      !confirm(
        `Delete "${cat.name}"? Albums in this category will stay published but won't appear under this filter.`
      )
    ) {
      return;
    }
    const token = getAuthToken();
    if (!token) return;
    try {
      await api.admin.deleteCategory(token, cat.uuid);
      await revalidatePublicCache();
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not delete category");
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-gold">Portfolio</p>
      <h1 className="mt-2 font-display text-4xl font-light">Categories</h1>
      <p className="mt-2 max-w-2xl text-sm text-foreground/50">
        Categories power the filters on your public portfolio page (Weddings, Portraits,
        Birthdays, etc.). Assign a category when editing each album.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="New category name (e.g. Birthdays)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createCategory()}
        />
        <Button onClick={createCategory} disabled={creating || !name.trim()}>
          {creating ? "Adding..." : "Add category"}
        </Button>
      </div>

      {loading ? (
        <div className="mt-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : categories.length === 0 ? (
        <p className="mt-16 text-center text-foreground/50">
          No categories yet. Add Weddings, Portraits, or Birthdays above.
        </p>
      ) : (
        <div className="mt-10 space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.uuid}
              className="glass flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-4"
            >
              <div>
                {editingId === cat.uuid ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="max-w-xs"
                  />
                ) : (
                  <>
                    <p className="font-display text-xl">{cat.name}</p>
                    <p className="text-xs text-foreground/50">
                      /portfolio?category={cat.slug} · {cat.albums_count ?? 0} album
                      {(cat.albums_count ?? 0) === 1 ? "" : "s"}
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {editingId === cat.uuid ? (
                  <>
                    <Button size="sm" onClick={() => saveEdit(cat)}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(cat.uuid);
                        setEditName(cat.name);
                      }}
                    >
                      Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400"
                      onClick={() => deleteCategory(cat)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-sm text-foreground/50">
        <Link href="/admin/albums" className="text-gold hover:underline">
          Go to Albums
        </Link>{" "}
        to assign categories to your galleries.
      </p>
    </div>
  );
}
