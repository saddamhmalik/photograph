import { resolveApiBaseUrl } from "@/lib/api-base";

const API_URL = resolveApiBaseUrl();

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const fieldErrors = Object.values(error.errors ?? {}).flat() as string[];
    const message =
      fieldErrors.length > 0
        ? fieldErrors.join(" ")
        : (error.message ?? `Request failed: ${res.status}`);
    throw new Error(String(message));
  }

  return res.json();
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export const api = {
  public: {
    getSite: () => request<import("@/types").PublicSiteData>("/public"),
    getPortfolio: (category?: string) =>
      request<{
        albums: import("@/types").Album[];
        categories: import("@/types").PortfolioCategory[];
      }>(`/public/portfolio${category ? `?category=${category}` : ""}`),
    getCategories: () =>
      request<{ categories: import("@/types").PortfolioCategory[] }>("/public/categories"),
    getAlbum: (albumSlug: string, password?: string) =>
      request<{ album: import("@/types").Album }>(`/public/albums/${albumSlug}`, {
        method: "GET",
        ...(password ? { headers: { "X-Album-Password": password } } : {}),
      }),
    submitInquiry: (data: Record<string, string>) =>
      request("/public/inquiries", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  auth: {
    login: (email: string, password: string) =>
      request<{ user: unknown; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: Record<string, string>) =>
      request<{ user: unknown; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: (token: string) => request<{ user: unknown }>("/auth/me", {}, token),
    logout: (token: string) =>
      request("/auth/logout", { method: "POST" }, token),
  },
  admin: {
    dashboard: (token: string) =>
      request<{ stats: import("@/types").DashboardStats }>(
        "/admin/dashboard",
        {},
        token
      ),
    albums: async (token: string, page = 1) => {
      const res = await request<{ data: import("@/types").Album[] }>(
        `/admin/albums?per_page=50&page=${page}`,
        {},
        token
      );
      return res.data ?? [];
    },
    getAlbum: (token: string, uuid: string) =>
      request<{ album: import("@/types").Album }>(`/admin/albums/${uuid}`, {}, token),
    createAlbum: (token: string, data: Record<string, unknown>) =>
      request<{ album: import("@/types").Album }>(
        "/admin/albums",
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    updateAlbum: (token: string, uuid: string, data: Record<string, unknown>) =>
      request<{ album: import("@/types").Album }>(
        `/admin/albums/${uuid}`,
        { method: "PUT", body: JSON.stringify(data) },
        token
      ),
    deleteAlbum: (token: string, uuid: string) =>
      request(`/admin/albums/${uuid}`, { method: "DELETE" }, token),
    uploadMedia: (token: string, albumUuid: string, files: File[]) => {
      const form = new FormData();
      if (files.length === 1) {
        form.append("file", files[0]);
      } else {
        files.forEach((f) => form.append("files[]", f));
      }
      return request<{ media: import("@/types").AlbumMedia[] }>(
        `/admin/albums/${albumUuid}/media`,
        { method: "POST", body: form },
        token
      );
    },
    deleteMedia: (token: string, albumUuid: string, mediaUuid: string) =>
      request(`/admin/albums/${albumUuid}/media/${mediaUuid}`, {
        method: "DELETE",
      }, token),
    categories: (token: string) =>
      request<{ categories: import("@/types").PortfolioCategory[] }>(
        "/admin/categories",
        {},
        token
      ),
    createCategory: (token: string, data: Record<string, unknown>) =>
      request<{ category: import("@/types").PortfolioCategory }>(
        "/admin/categories",
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    updateCategory: (token: string, uuid: string, data: Record<string, unknown>) =>
      request<{ category: import("@/types").PortfolioCategory }>(
        `/admin/categories/${uuid}`,
        { method: "PUT", body: JSON.stringify(data) },
        token
      ),
    deleteCategory: (token: string, uuid: string) =>
      request(`/admin/categories/${uuid}`, { method: "DELETE" }, token),
    getSite: (token: string) =>
      request<import("@/types").AdminSiteContent>("/admin/site", {}, token),
    updateProfile: (token: string, data: Record<string, unknown>) =>
      request<{ photographer: import("@/types").Photographer }>(
        "/admin/site/profile",
        { method: "PUT", body: JSON.stringify(data) },
        token
      ),
    updateHomepage: (token: string, data: Record<string, unknown>) =>
      request<{ settings: import("@/types").WebsiteSettings }>(
        "/admin/site/homepage",
        { method: "PUT", body: JSON.stringify(data) },
        token
      ),
    testimonials: (token: string) =>
      request<{ testimonials: import("@/types").Testimonial[] }>(
        "/admin/testimonials",
        {},
        token
      ),
    createTestimonial: (token: string, data: Record<string, unknown>) =>
      request<{ testimonial: import("@/types").Testimonial }>(
        "/admin/testimonials",
        { method: "POST", body: JSON.stringify(data) },
        token
      ),
    updateTestimonial: (token: string, uuid: string, data: Record<string, unknown>) =>
      request<{ testimonial: import("@/types").Testimonial }>(
        `/admin/testimonials/${uuid}`,
        { method: "PUT", body: JSON.stringify(data) },
        token
      ),
    deleteTestimonial: (token: string, uuid: string) =>
      request(`/admin/testimonials/${uuid}`, { method: "DELETE" }, token),
  },
};

export function getAuthToken() {
  return getToken();
}
