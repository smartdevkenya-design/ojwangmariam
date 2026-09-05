import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import type { CustomPage, GalleryImage, SiteSettings, Story } from '../lib/types'
import {
  defaultAboutContent,
  defaultBookContent,
  defaultContactContent,
  defaultGalleryContent,
  defaultHomeContent,
  defaultManifestoContent,
  defaultMediaContent,
  defaultSiteSettings,
  defaultVolunteerContent,
} from '../lib/defaults'

const PAGE_DEFAULTS: Record<string, unknown> = {
  home: defaultHomeContent,
  about: defaultAboutContent,
  book: defaultBookContent,
  manifesto: defaultManifestoContent,
  media: defaultMediaContent,
  gallery: defaultGalleryContent,
  volunteer: defaultVolunteerContent,
  contact: defaultContactContent,
}

interface SiteDataShape {
  loading: boolean
  settings: SiteSettings
  pageContent: Record<string, unknown>
  stories: Story[]
  galleryImages: GalleryImage[]
  customPages: CustomPage[]
  refetch: () => Promise<void>
}

function getPage<T>(pageContent: Record<string, unknown>, page: string, fallback: T): T {
  const data = pageContent[page]
  if (!data || typeof data !== 'object') return fallback
  return { ...fallback, ...(data as object) } as T
}

const SiteDataContext = createContext<SiteDataShape | null>(null)

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings)
  const [pageContent, setPageContent] = useState<Record<string, unknown>>({})
  const [stories, setStories] = useState<Story[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [customPages, setCustomPages] = useState<CustomPage[]>([])

  async function load() {
    if (!supabaseConfigured || !supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const [settingsRes, pageRes, storiesRes, galleryRes, customRes] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('page_content').select('page,data'),
      supabase.from('stories').select('*').order('sort_order', { ascending: true }),
      supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }),
      supabase.from('custom_pages').select('*').order('sort_order', { ascending: true }),
    ])

    // Log (rather than silently swallow) any query error, so a schema
    // mismatch or RLS issue shows up in the browser console instead of
    // just quietly falling back to default content with no clue why.
    for (const [label, res] of [
      ['site_settings', settingsRes],
      ['page_content', pageRes],
      ['stories', storiesRes],
      ['gallery_images', galleryRes],
      ['custom_pages', customRes],
    ] as const) {
      if (res.error) console.error(`[SiteDataContext] Failed to load "${label}":`, res.error.message)
    }

    if (settingsRes.data) setSettings(settingsRes.data as SiteSettings)
    if (pageRes.data) {
      const merged: Record<string, unknown> = {}
      for (const row of pageRes.data as { page: string; data: unknown }[]) {
        merged[row.page] = row.data
      }
      setPageContent(merged)
    }
    if (storiesRes.data) setStories(storiesRes.data as Story[])
    if (galleryRes.data) setGalleryImages(galleryRes.data as GalleryImage[])
    if (customRes.data) setCustomPages(customRes.data as CustomPage[])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply theme colors as CSS variable overrides so admin color edits take
  // effect immediately without a rebuild (Tailwind v4 @theme tokens compile
  // to --color-* custom properties, which we can override at runtime).
  useEffect(() => {
    const root = document.documentElement
    for (const [key, value] of Object.entries(settings.theme || {})) {
      root.style.setProperty(`--color-${key}`, value)
    }
    if (settings.site_title) document.title = settings.site_title
  }, [settings])

  const value = useMemo<SiteDataShape>(
    () => ({ loading, settings, pageContent, stories, galleryImages, customPages, refetch: load }),
    [loading, settings, pageContent, stories, galleryImages, customPages]
  )

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider')
  return ctx
}

/** Get a built-in page's content, merged over its defaults so missing fields never break the UI. */
export function usePageContent<T>(page: keyof typeof PAGE_DEFAULTS): T {
  const { pageContent } = useSiteData()
  return getPage<T>(pageContent, page as string, PAGE_DEFAULTS[page as string] as T)
}

export { PAGE_DEFAULTS }
