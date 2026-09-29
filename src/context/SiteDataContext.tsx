import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { collectImageUrls, preloadImages, saveImageList, withTimeout } from '../lib/preload'
import type { CustomPage, GalleryImage, SiteSettings, Story } from '../lib/types'
import {
  defaultAboutContent,
  defaultBookContent,
  defaultContactContent,
  defaultGalleryContent,
  defaultHomeContent,
  defaultManifestoContent,
  defaultMediaContent,
  defaultPartnersContent,
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
  partners: defaultPartnersContent,
}

interface SiteDataShape {
  loading: boolean
  error: string | null
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
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings) // placeholder only; never rendered until Supabase loads
  const [pageContent, setPageContent] = useState<Record<string, unknown>>({})
  const [stories, setStories] = useState<Story[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [customPages, setCustomPages] = useState<CustomPage[]>([])

  async function load() {
    if (!supabaseConfigured || !supabase) {
      setError('Site is not connected to Supabase (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY at build time).')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [settingsRes, pageRes, storiesRes, galleryRes, customRes] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('page_content').select('page,data'),
        supabase.from('stories').select('*').order('sort_order', { ascending: true }),
        supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }),
        supabase.from('custom_pages').select('*').order('sort_order', { ascending: true }),
      ])

      const failed = [
        ['site_settings', settingsRes],
        ['page_content', pageRes],
        ['stories', storiesRes],
        ['gallery_images', galleryRes],
        ['custom_pages', customRes],
      ].filter(([, r]) => (r as { error: unknown }).error) as [string, { error: { message: string } }][]

      for (const [label, r] of failed) console.error(`[SiteDataContext] "${label}":`, r.error.message)
      if (failed.length) throw new Error(failed.map(([l, r]) => `${l}: ${r.error.message}`).join(' | '))
      if (!settingsRes.data) throw new Error('site_settings row (id=1) not found in Supabase')

      setSettings(settingsRes.data as SiteSettings)
      const merged: Record<string, unknown> = {}
      for (const row of (pageRes.data ?? []) as { page: string; data: unknown }[]) merged[row.page] = row.data
      setPageContent(merged)
      setStories((storiesRes.data ?? []) as Story[])
      setGalleryImages((galleryRes.data ?? []) as GalleryImage[])
      setCustomPages((customRes.data ?? []) as CustomPage[])

      // Photos: request everything now. The must-have ones (logo, home page, partners)
      // are awaited (max 4s) so the site opens with them already loaded; the rest
      // keep loading in the background so every other page is instant too.
      const critical = collectImageUrls([settingsRes.data, merged.home, merged.partners])
      const everything = collectImageUrls([settingsRes.data, merged, storiesRes.data, galleryRes.data, customRes.data])
      saveImageList([...critical, ...everything])
      const criticalDone = preloadImages(critical)
      void preloadImages([...everything].filter((u) => !critical.has(u)))
      await withTimeout(criticalDone, 4000)
    } catch (e) {
      console.error('[SiteDataContext] load failed', e)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  // Refetch when the tab regains focus or the page is restored from bfcache,
  // so the site never sits on stale data.
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && load()
    const onShow = (e: PageTransitionEvent) => e.persisted && load()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('pageshow', onShow)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pageshow', onShow)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    () => ({ loading, error, settings, pageContent, stories, galleryImages, customPages, refetch: load }),
    [loading, error, settings, pageContent, stories, galleryImages, customPages]
  )

  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!loading && !error) setReady(true)
  }, [loading, error])

  // Nothing from defaults.ts is ever painted: hold the UI until Supabase answers.
  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif', padding: 24, textAlign: 'center' }}>
        {error ? (
          <div style={{ maxWidth: 420 }}>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Couldn’t load the site.</p>
            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16, wordBreak: 'break-word' }}>{error}</p>
            <button onClick={() => load()} style={{ padding: '10px 20px', borderRadius: 999, border: 0, background: '#c8102e', color: '#fff', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        ) : (
          <div aria-label="Loading" style={{ width: 32, height: 32, border: '3px solid #ddd', borderTopColor: '#c8102e', borderRadius: '50%', animation: 'sd-spin 0.8s linear infinite' }}>
            <style>{'@keyframes sd-spin{to{transform:rotate(360deg)}}'}</style>
          </div>
        )}
      </div>
    )
  }

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
