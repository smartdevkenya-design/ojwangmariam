export interface SiteSettings {
  id: number
  site_title: string
  logo_line1: string
  logo_line2: string
  logo_image_url: string | null
  press_banner_text: string
  phone: string
  email: string
  address: string
  footer_about: string
  footer_copyright: string
  footer_tagline: string
  footer_tags: string[]
  mpesa_paybill: string
  mpesa_account: string
  mpesa_account_name: string
  nav_links: { label: string; to: string }[]
  theme: Record<string, string>
}

export interface Story {
  id: string
  tag: string
  title: string
  date: string
  summary: string
  paragraphs: string[]
  cta_label: string
  cta_href: string
  image_url?: string | null
  sort_order: number
}

export interface GalleryImage {
  id: string
  url: string
  caption: string
  sort_order: number
}

export type SectionBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'image'; url: string; alt?: string }
  | { type: 'cta'; label: string; href: string }

export interface CustomPage {
  id: string
  slug: string
  title: string
  nav_label: string
  show_in_nav: boolean
  sort_order: number
  sections: SectionBlock[]
}

// ---- Per-page content shapes (page_content.data) ----

export interface HeroItem {
  title: string
  body: string
  to: string
}

export interface HomeContent {
  hero_eyebrow: string
  hero_heading: string
  hero_body: string
  hero_image_url: string
  ribbon_items: HeroItem[]
  highlights_eyebrow: string
  highlights_heading: string
  issues_panel_image_url: string
  issues: HeroItem[]
}

export interface CardItem {
  title: string
  body: string
}

export interface AboutContent {
  eyebrow: string
  heading: string
  intro: string
  portrait_url: string
  cards: CardItem[]
}

export interface BookContent {
  cover_url: string
  eyebrow: string
  title: string
  subtitle: string
  description: string
  launch_note: string
  price_standard_label: string
  price_standard: string
  price_sponsor_label: string
  price_sponsor: string
  cta_label: string
}

export interface PillarItem {
  title: string
  body: string
  image_url: string
}

export interface ManifestoContent {
  eyebrow: string
  heading: string
  intro: string
  quote: string
  quote_note: string
  banner_url: string
  pillars: PillarItem[]
}

export interface MediaItem {
  title: string
  body: string
  image_url: string
}

export interface MediaContent {
  eyebrow: string
  heading: string
  items: MediaItem[]
}

export interface GalleryContent {
  eyebrow: string
  heading: string
  intro: string
}

export interface VolunteerItem {
  title: string
  body: string
  cta: string
  to: string
}

export interface VolunteerContent {
  banner_url: string
  eyebrow: string
  heading: string
  intro: string
  items: VolunteerItem[]
}

export interface ContactContent {
  eyebrow: string
  heading: string
  cta_label: string
}
