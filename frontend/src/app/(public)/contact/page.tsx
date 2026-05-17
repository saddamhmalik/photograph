"use client";

import { useEffect, useState } from "react";
import { FadeReveal } from "@/components/animations/FadeReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { fetchSiteData } from "@/lib/mock-data";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<{
    email?: string;
    phone?: string;
    address?: string;
    map_embed?: string;
  }>({});

  useEffect(() => {
    fetchSiteData().then((d) => setContact(d.settings?.contact ?? {}));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;
    try {
      await api.public.submitInquiry(data);
    } catch {
      //
    }
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2">
        <FadeReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Contact</p>
          <h1 className="mt-2 font-display text-5xl font-light">Let&apos;s Connect</h1>
          <p className="mt-4 text-foreground/60">
            Share your vision — weddings, pre-weddings, portraits, and celebrations across India.
          </p>
          <div className="mt-10 space-y-4 text-foreground/70">
            {contact.email && <p>{contact.email}</p>}
            {contact.phone && <p>{contact.phone}</p>}
            {contact.address && <p>{contact.address}</p>}
          </div>
        </FadeReveal>

        <FadeReveal delay={0.2}>
          {submitted ? (
            <div className="glass rounded-2xl p-10 text-center">
              <h2 className="font-display text-3xl text-gold">Thank You</h2>
              <p className="mt-4 text-foreground/60">
                Your message has been received. We&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-4">
              <Input name="name" placeholder="Your name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" placeholder="Phone (+91)" />
              <Input name="event_type" placeholder="Event type (Wedding, Birthday...)" />
              <Input name="event_date" type="date" />
              <Input name="location" placeholder="Location" />
              <textarea
                name="message"
                placeholder="Tell us about your story..."
                rows={4}
                className="flex w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-white/30 focus-visible:border-gold focus-visible:outline-none"
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          )}
        </FadeReveal>
      </div>

      {contact.map_embed && (
        <FadeReveal className="mt-16 max-w-7xl mx-auto">
          <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/5">
            <iframe
              src={contact.map_embed}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio location"
            />
          </div>
        </FadeReveal>
      )}
    </div>
  );
}
