// Runs before every build. Regenerates public/sitemap.xml with the fixed pages
// PLUS every story and admin-created page currently in Supabase.
// If Supabase can't be reached, the existing sitemap.xml is left untouched.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SITE = 'https://ojwangmariam.co.ke'
const STATIC = ['', 'about', 'book', 'manifesto', 'media', 'gallery', 'volunteer', 'contact', 'privacy']

function env(name) {
  if (process.env[name]) return process.env[name]
  if (existsSync('.env')) {
    const m = readFileSync('.env', 'utf8').match(new RegExp(`^${name}=(.*)$`, 'm'))
    if (m) return m[1].trim()
  }
  return ''
}

const url = env('VITE_SUPABASE_URL').replace(/\/$/, '')
const key = env('VITE_SUPABASE_ANON_KEY')
if (!url || !key) {
  console.warn('[sitemap] Supabase env missing — keeping existing sitemap.xml')
  process.exit(0)
}

async function rows(table, select) {
  const res = await fetch(`${url}/rest/v1/${table}?select=${select}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`)
  return res.json()
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10))

try {
  const [stories, pages] = await Promise.all([rows('stories', 'id,created_at'), rows('custom_pages', 'slug,created_at')])
  const today = day()
  const entries = [
    ...STATIC.map((p) => ({ loc: `${SITE}/${p}`, lastmod: today, priority: p === '' ? '1.0' : p === 'privacy' ? '0.3' : '0.8' })),
    ...pages.filter((p) => p.slug).map((p) => ({ loc: `${SITE}/${p.slug}`, lastmod: day(p.created_at), priority: '0.7' })),
    ...stories.map((s) => ({ loc: `${SITE}/stories/${s.id}`, lastmod: day(s.created_at), priority: '0.6' })),
  ]
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map((e) => `  <url><loc>${esc(e.loc)}</loc><lastmod>${e.lastmod}</lastmod><priority>${e.priority}</priority></url>`)
      .join('\n') +
    '\n</urlset>\n'
  writeFileSync('public/sitemap.xml', xml)
  console.log(`[sitemap] wrote ${entries.length} URLs (${stories.length} stories, ${pages.length} custom pages)`)
} catch (e) {
  console.warn('[sitemap] could not read Supabase — keeping existing sitemap.xml:', e.message)
}
