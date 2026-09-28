import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

// Always hit the network: never let the browser HTTP cache serve stale
// Supabase responses on refresh or first open.
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' })

export const supabase = supabaseConfigured
  ? createClient(url as string, anonKey as string, { global: { fetch: noStoreFetch } })
  : (null as unknown as ReturnType<typeof createClient>)

export const MEDIA_BUCKET = 'media'

export function publicMediaUrl(path: string) {
  if (!supabase) return path
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}
