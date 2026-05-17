export interface Photographer {
  uuid: string;
  business_name: string;
  tagline?: string;
  bio?: string;
  logo_path?: string;
  hero_video_url?: string;
  hero_image_path?: string;
  whatsapp_number?: string;
  city?: string;
  state?: string;
  country?: string;
  social_links?: Record<string, string>;
}

export interface PortfolioCategory {
  uuid: string;
  name: string;
  slug: string;
  sort_order?: number;
  albums_count?: number;
}

export interface Album {
  uuid: string;
  title: string;
  slug: string;
  description?: string;
  cover_path?: string;
  cover_thumbnail_path?: string;
  event_date?: string;
  location?: string;
  layout?: string;
  is_public?: boolean;
  is_featured?: boolean;
  is_password_protected?: boolean;
  view_count?: number;
  category?: { uuid: string; name: string; slug: string };
  media?: AlbumMedia[];
}

export interface AlbumMedia {
  uuid: string;
  type: string;
  path: string;
  thumbnail_path?: string;
  webp_path?: string;
  blur_hash?: string;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  sort_order?: number;
}

export interface Testimonial {
  uuid: string;
  client_name: string;
  event_type?: string;
  content: string;
  rating?: number;
}

export interface HomepageSections {
  hero?: {
    primary_cta?: string;
    secondary_cta?: string;
  };
  featured?: {
    label?: string;
    title?: string;
  };
  about?: {
    label?: string;
    enabled?: boolean;
  };
  services?: {
    label?: string;
    title?: string;
  };
  testimonials?: {
    label?: string;
    title?: string;
  };
  cta?: {
    title?: string;
    subtitle?: string;
    primary_button?: string;
    secondary_button?: string;
  };
}

export interface WebsiteSettings {
  branding?: { primary_color?: string; accent_color?: string };
  seo?: { title?: string; description?: string; keywords?: string };
  services?: { name: string; description: string }[];
  homepage_sections?: HomepageSections;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    map_embed?: string;
  };
}

export interface AdminSiteContent {
  photographer: Photographer;
  settings: WebsiteSettings;
}

export interface PublicSiteData {
  photographer: Photographer;
  featured_albums: Album[];
  gallery_albums?: Album[];
  testimonials: Testimonial[];
  settings: WebsiteSettings;
  gallery_sections?: unknown[];
}

export interface DashboardStats {
  total_albums: number;
  total_views: number;
  total_inquiries: number;
  new_inquiries: number;
  storage_used_bytes: number;
  storage_limit_bytes: number;
  views_last_30_days: number;
}
