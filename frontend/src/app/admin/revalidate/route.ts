import type { NextRequest } from "next/server";
import { revalidatePublicPost } from "@/server/revalidate-post";

export async function POST(request: NextRequest) {
  return revalidatePublicPost(request);
}
