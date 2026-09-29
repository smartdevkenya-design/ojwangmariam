/**
 * Image preloading: every photo on the site is requested as early as possible
 * so it is already in the browser cache by the time a page renders.
 */

const STORAGE_KEY = 'sd_img_urls'
const IMAGE_RE = /\.(png|jpe?g|webp|gif|avif|svg|ico)(\?.*)?$/i
const held = new Set<HTMLImageElement>() // keep references so in-flight loads aren't cancelled

/** Recursively find every image URL inside any JSON-like value. */
export function collectImageUrls(value: unknown, out: Set<string> = new Set()): Set<string> {
  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value) && (IMAGE_RE.test(value) || value.includes('/storage/v1/object/public/'))) {
      out.add(value)
    }
  } else if (Array.isArray(value)) {
    for (const v of value) collectImageUrls(v, out)
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectImageUrls(v, out)
  }
  return out
}

/** Start loading (and decoding) the given images. Resolves when all have finished or failed. */
export function preloadImages(urls: Iterable<string>): Promise<void> {
  const jobs: Promise<void>[] = []
  for (const url of urls) {
    jobs.push(
      new Promise<void>((resolve) => {
        const img = new Image()
        held.add(img)
        img.decoding = 'async'
        img.onload = img.onerror = () => resolve()
        img.src = url
        if (img.decode) img.decode().then(resolve, resolve)
      }),
    )
  }
  return Promise.all(jobs).then(() => undefined)
}

/** Resolve after `ms` even if `p` is still pending, so slow images never block the site. */
export function withTimeout(p: Promise<unknown>, ms: number): Promise<void> {
  return Promise.race([p, new Promise((r) => setTimeout(r, ms))]).then(() => undefined)
}

export function saveImageList(urls: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls))
  } catch {
    /* storage unavailable: ignore */
  }
}

/** On repeat visits, begin fetching last-known images before the database has even answered. */
export function preloadRememberedImages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) void preloadImages(JSON.parse(raw) as string[])
  } catch {
    /* ignore */
  }
}

/** Open the connection to Supabase early so the first request/image doesn't pay the handshake. */
export function preconnect(origin: string | undefined) {
  if (!origin) return
  try {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = new URL(origin).origin
    link.crossOrigin = ''
    document.head.appendChild(link)
  } catch {
    /* ignore */
  }
}
