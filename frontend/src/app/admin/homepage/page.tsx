"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, getAuthToken } from "@/lib/api";
import { defaultHomepageSections, mergeHomepageSections } from "@/lib/homepage-defaults";
import type { HomepageSections, Photographer, Testimonial, WebsiteSettings } from "@/types";

type Tab = "profile" | "homepage" | "services" | "testimonials";

export default function AdminHomepagePage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [sections, setSections] = useState<HomepageSections>(defaultHomepageSections);
  const [services, setServices] = useState<{ name: string; description: string }[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [profileForm, setProfileForm] = useState({
    business_name: "",
    tagline: "",
    bio: "",
    hero_image_path: "",
    hero_video_url: "",
    whatsapp_number: "",
    city: "",
    state: "",
    country: "",
    instagram: "",
    youtube: "",
  });

  const [newTestimonial, setNewTestimonial] = useState({
    client_name: "",
    event_type: "",
    content: "",
    rating: 5,
  });

  const load = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    setLoading(true);
    try {
      const [site, testimonialRes] = await Promise.all([
        api.admin.getSite(token),
        api.admin.testimonials(token),
      ]);
      setPhotographer(site.photographer);
      setSections(mergeHomepageSections(site.settings.homepage_sections));
      setServices(site.settings.services ?? []);
      setSeoTitle(site.settings.seo?.title ?? "");
      setSeoDescription(site.settings.seo?.description ?? "");
      setTestimonials(testimonialRes.testimonials);
      setProfileForm({
        business_name: site.photographer.business_name ?? "",
        tagline: site.photographer.tagline ?? "",
        bio: site.photographer.bio ?? "",
        hero_image_path: site.photographer.hero_image_path ?? "",
        hero_video_url: site.photographer.hero_video_url ?? "",
        whatsapp_number: site.photographer.whatsapp_number ?? "",
        city: site.photographer.city ?? "",
        state: site.photographer.state ?? "",
        country: site.photographer.country ?? "",
        instagram: site.photographer.social_links?.instagram ?? "",
        youtube: site.photographer.social_links?.youtube ?? "",
      });
    } catch {
      alert("Could not load site content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = async () => {
    const token = getAuthToken();
    if (!token) return;
    setSaving(true);
    try {
      const res = await api.admin.updateProfile(token, {
        business_name: profileForm.business_name,
        tagline: profileForm.tagline,
        bio: profileForm.bio,
        hero_image_path: profileForm.hero_image_path || null,
        hero_video_url: profileForm.hero_video_url || null,
        whatsapp_number: profileForm.whatsapp_number || null,
        city: profileForm.city,
        state: profileForm.state,
        country: profileForm.country,
        social_links: {
          instagram: profileForm.instagram || undefined,
          youtube: profileForm.youtube || undefined,
        },
      });
      setPhotographer(res.photographer);
      alert("Profile saved");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const saveHomepage = async () => {
    const token = getAuthToken();
    if (!token) return;
    setSaving(true);
    try {
      const res = await api.admin.updateHomepage(token, {
        homepage_sections: sections,
        services,
        seo: { title: seoTitle, description: seoDescription },
      });
      setSections(mergeHomepageSections(res.settings.homepage_sections));
      setServices(res.settings.services ?? []);
      alert("Homepage content saved");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    setServices([...services, { name: "", description: "" }]);
  };

  const addTestimonial = async () => {
    const token = getAuthToken();
    if (!token || !newTestimonial.client_name.trim() || !newTestimonial.content.trim()) return;
    try {
      await api.admin.createTestimonial(token, {
        ...newTestimonial,
        is_featured: true,
        is_active: true,
      });
      setNewTestimonial({ client_name: "", event_type: "", content: "", rating: 5 });
      const res = await api.admin.testimonials(token);
      setTestimonials(res.testimonials);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not add testimonial");
    }
  };

  const removeTestimonial = async (uuid: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await api.admin.deleteTestimonial(token, uuid);
      setTestimonials((t) => t.filter((x) => x.uuid !== uuid));
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile & Hero" },
    { id: "homepage", label: "Homepage Text" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
  ];

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-gold">Content</p>
      <h1 className="mt-2 font-display text-4xl font-light">Homepage & Site</h1>
      <p className="mt-2 max-w-xl text-sm text-foreground/50">
        Edit section headings, call-to-action copy, SEO, services, and testimonials on your public site.
      </p>
      <Link
        href="/"
        target="_blank"
        className="mt-4 inline-block text-xs uppercase tracking-widest text-gold hover:underline"
      >
        Preview site →
      </Link>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
              tab === t.id
                ? "bg-gold text-background"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="glass mt-8 max-w-2xl space-y-4 rounded-xl p-6">
          <Input
            value={profileForm.business_name}
            onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
            placeholder="Business name"
          />
          <Input
            value={profileForm.tagline}
            onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
            placeholder="Tagline"
          />
          <textarea
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            placeholder="About bio (homepage)"
            rows={4}
            className="flex w-full border border-white/10 bg-white/5 px-4 py-3 text-sm focus-visible:border-gold focus-visible:outline-none"
          />
          <Input
            value={profileForm.hero_image_path}
            onChange={(e) => setProfileForm({ ...profileForm, hero_image_path: e.target.value })}
            placeholder="Hero image URL"
          />
          <Input
            value={profileForm.hero_video_url}
            onChange={(e) => setProfileForm({ ...profileForm, hero_video_url: e.target.value })}
            placeholder="Hero video URL (optional)"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              value={profileForm.city}
              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
              placeholder="City"
            />
            <Input
              value={profileForm.state}
              onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
              placeholder="State"
            />
            <Input
              value={profileForm.country}
              onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
              placeholder="Country"
            />
          </div>
          <Input
            value={profileForm.whatsapp_number}
            onChange={(e) => setProfileForm({ ...profileForm, whatsapp_number: e.target.value })}
            placeholder="WhatsApp number"
          />
          <Input
            value={profileForm.instagram}
            onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
            placeholder="Instagram URL"
          />
          <Input
            value={profileForm.youtube}
            onChange={(e) => setProfileForm({ ...profileForm, youtube: e.target.value })}
            placeholder="YouTube URL"
          />
          <Button onClick={saveProfile} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </div>
      )}

      {tab === "homepage" && (
        <div className="glass mt-8 max-w-2xl space-y-6 rounded-xl p-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-gold">About section</p>
            <label className="mb-3 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={sections.about?.enabled ?? true}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    about: { ...sections.about, enabled: e.target.checked },
                  })
                }
                className="accent-gold"
              />
              Show about section on homepage
            </label>
            <Input
              value={sections.about?.label ?? ""}
              onChange={(e) =>
                setSections({
                  ...sections,
                  about: { ...sections.about, label: e.target.value },
                })
              }
              placeholder="About label"
            />
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-gold">Services heading</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={sections.services?.label ?? ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    services: { ...sections.services, label: e.target.value },
                  })
                }
                placeholder="Label"
              />
              <Input
                value={sections.services?.title ?? ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    services: { ...sections.services, title: e.target.value },
                  })
                }
                placeholder="Title"
              />
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-gold">Testimonials heading</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={sections.testimonials?.label ?? ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    testimonials: { ...sections.testimonials, label: e.target.value },
                  })
                }
                placeholder="Label"
              />
              <Input
                value={sections.testimonials?.title ?? ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    testimonials: { ...sections.testimonials, title: e.target.value },
                  })
                }
                placeholder="Title"
              />
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-gold">Call to action</p>
            <div className="space-y-3">
              <Input
                value={sections.cta?.title ?? ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    cta: { ...sections.cta, title: e.target.value },
                  })
                }
                placeholder="CTA title"
              />
              <textarea
                value={sections.cta?.subtitle ?? ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    cta: { ...sections.cta, subtitle: e.target.value },
                  })
                }
                placeholder="CTA subtitle"
                rows={2}
                className="flex w-full border border-white/10 bg-white/5 px-4 py-3 text-sm focus-visible:border-gold focus-visible:outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  value={sections.cta?.primary_button ?? ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      cta: { ...sections.cta, primary_button: e.target.value },
                    })
                  }
                  placeholder="Primary button"
                />
                <Input
                  value={sections.cta?.secondary_button ?? ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      cta: { ...sections.cta, secondary_button: e.target.value },
                    })
                  }
                  placeholder="WhatsApp button label"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-gold">SEO</p>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Page title"
              className="mb-3"
            />
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Meta description"
              rows={2}
              className="flex w-full border border-white/10 bg-white/5 px-4 py-3 text-sm focus-visible:border-gold focus-visible:outline-none"
            />
          </div>
          <Button onClick={saveHomepage} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save homepage text"}
          </Button>
        </div>
      )}

      {tab === "services" && (
        <div className="mt-8 max-w-2xl space-y-4">
          {services.map((service, i) => (
            <div key={i} className="glass space-y-3 rounded-xl p-4">
              <Input
                value={service.name}
                onChange={(e) => {
                  const next = [...services];
                  next[i] = { ...next[i], name: e.target.value };
                  setServices(next);
                }}
                placeholder="Service name"
              />
              <Input
                value={service.description}
                onChange={(e) => {
                  const next = [...services];
                  next[i] = { ...next[i], description: e.target.value };
                  setServices(next);
                }}
                placeholder="Description"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400"
                onClick={() => setServices(services.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addService}>
            Add service
          </Button>
          <Button onClick={saveHomepage} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save services"}
          </Button>
        </div>
      )}

      {tab === "testimonials" && (
        <div className="mt-8 max-w-2xl space-y-6">
          {testimonials.map((t) => (
            <div key={t.uuid} className="glass rounded-xl p-4">
              <p className="font-display text-lg">{t.client_name}</p>
              <p className="text-xs text-gold">{t.event_type}</p>
              <p className="mt-2 text-sm text-foreground/70">{t.content}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-red-400"
                onClick={() => removeTestimonial(t.uuid)}
              >
                Delete
              </Button>
            </div>
          ))}
          <div className="glass space-y-3 rounded-xl p-6">
            <p className="text-xs uppercase tracking-widest text-gold">Add testimonial</p>
            <Input
              value={newTestimonial.client_name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, client_name: e.target.value })}
              placeholder="Client name"
            />
            <Input
              value={newTestimonial.event_type}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, event_type: e.target.value })}
              placeholder="Event type"
            />
            <textarea
              value={newTestimonial.content}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
              placeholder="Quote"
              rows={3}
              className="flex w-full border border-white/10 bg-white/5 px-4 py-3 text-sm focus-visible:border-gold focus-visible:outline-none"
            />
            <Button onClick={addTestimonial}>Add testimonial</Button>
          </div>
        </div>
      )}
    </div>
  );
}
