import { getAuthToken } from "@/lib/api";

export async function revalidatePublicCache(albumSlug?: string): Promise<void> {
  const token = getAuthToken();
  if (!token) return;

  try {
    await fetch("/revalidate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumSlug }),
    });
  } catch {}
}
