import 'next-auth';

export interface SiteSettings {
  hero_title_line1: string; hero_title_line2: string; hero_title_line3: string;
  hero_badge_text: string; hero_badge_sub1: string; hero_badge_sub2: string;
  about_title_line1: string; about_title_line2: string;
  about_paragraph1: string; about_paragraph2: string;
  about_quote: string; about_image: string;
  contact_desc: string; contact_whatsapp: string; contact_location: string;
}
export interface ProductData {
  id: number; productSlug: string; name: string; origin: string;
  description: string; roastLevel: string; image: string; sortOrder: number; notes: string[];
}
export interface TestimonialData {
  id: number; name: string; location: string; rating: number;
  review: string; date: string; initial: string;
}
export interface GalleryData { id: number; image: string; title: string; icon: string; sortOrder: number }
export interface ReviewData {
  id: number; rating: number; comment: string; status: string; createdAt: string;
  user: { name: string; image: string | null };
}

declare module 'next-auth' {
  interface Session {
    user: { id: string; name?: string|null; email?: string|null; image?: string|null; role: string }
  }
  interface User { role: string }
}
declare module 'next-auth/jwt' {
  interface JWT { id: string; role: string }
}
