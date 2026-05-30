export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'tel' | 'url' | 'boolean' | 'image';

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  value: string | number | boolean;
}

export interface ContentModule {
  key: string;
  label: string;
  order: number;
  fields: ContentField[];
  items?: Record<string, any>[];
}

export interface Page {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  order: number;
  sectionIds: string[];
}

export interface Section {
  id: string;
  type: string;
  category: string;
  label: string;
  moduleKey: string;
  active: boolean;
  order: number;
  presetId: string;
}

export interface LayoutPreset {
  id: string;
  sectionType: string;
  name: string;
  description?: string;
}

export interface PublicTheme {
  id: string;
  name: string;
  thumbnailUrl: string;
  tokens: Record<string, string>; // e.g. primary, secondary, bg, font, border, radius
  presetMap: Record<string, string>; // sectionType -> presetId
  active: boolean;
}

export interface Asset {
  id: string;
  url: string;
  name: string;
  category: string;
  sizeBytes: number;
}

export interface Work {
  id: string;
  title: string;
  category: string;
  year: number;
  materials: string;
  dimensions: string;
  priceCents: number;
  images: string[];
  featured: boolean;
  description?: string;
}

export interface MarketplaceItem {
  id: string;
  kind: 'section' | 'theme' | 'module';
  name: string;
  description: string;
  thumbnailUrl: string;
  version: string;
  state: 'installed' | 'available' | 'update';
}

export interface License {
  status: 'active' | 'expired';
  plan: string;
  renewsAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Album {
  id: string;
  name: string;
  coverUrl: string;
  workIds: string[];
}

export interface Category {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface PressLogo {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PressArticle {
  id: string;
  mediaName: string;
  title: string;
  date: string;
  externalUrl: string;
  excerpt: string;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl?: string;
  status: 'draft' | 'published';
  date: string;
  author: string;
}

export interface SiteBranding {
  logoUrl: string;
  faviconUrl: string;
  fontFamily: string;
  primaryColor: string;
  bgColor: string;
}
