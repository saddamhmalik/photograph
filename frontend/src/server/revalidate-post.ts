import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolveApiBaseUrl } from "@/lib/api-base";

async function verifyAdminToken(token: string): Promise<boolean> {
  const res = await fetch(`${resolveApiBaseUrl()}/auth/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return res.ok;
}

export async function revalidatePublicPost(
  request: NextRequest
): Promise<Response> {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const albumSlug =
    typeof body.albumSlug === "string" && body.albumSlug.length > 0
      ? body.albumSlug
      : undefined;

  revalidateTag("public-site", "max");
  revalidateTag("portfolio", "max");
  revalidatePath("/", "layout");
  revalidatePath("/portfolio");

  if (albumSlug) {
    revalidatePath(`/albums/${albumSlug}`);
  }

  return NextResponse.json({ revalidated: true });
}
