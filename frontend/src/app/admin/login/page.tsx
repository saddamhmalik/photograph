"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await api.auth.login(
        form.get("email") as string,
        form.get("password") as string
      );
      localStorage.setItem("token", res.token);
      router.push("/admin/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("credentials") || msg.includes("422")
          ? "Invalid credentials. Try demo@lenscraft.in / password123"
          : msg || "Cannot reach API. Start backend on http://localhost:8000"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-md rounded-2xl p-10">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Admin</p>
        <h1 className="mt-2 font-display text-4xl">Sign In</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input name="email" type="email" placeholder="Email" defaultValue="demo@lenscraft.in" required />
          <Input name="password" type="password" placeholder="Password" defaultValue="password123" required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  );
}
