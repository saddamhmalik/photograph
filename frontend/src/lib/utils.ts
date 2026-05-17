import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getMediaUrl(path: string) {
  if (path.startsWith("http")) return path;
  const cdn = process.env.NEXT_PUBLIC_CDN_URL ?? "";
  return `${cdn}/${path.replace(/^\//, "")}`;
}
