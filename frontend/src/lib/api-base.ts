export function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
  }
  const backend = process.env.API_BACKEND_URL ?? "http://127.0.0.1:8000";
  return process.env.API_INTERNAL_URL ?? `${backend.replace(/\/$/, "")}/api/v1`;
}
