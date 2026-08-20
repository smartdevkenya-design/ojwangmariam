import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

// If env vars are missing, the site still renders (using default content)
// instead of crashing — this happens during local dev before Supabase is
// wired up, or if a build runs without the secrets configured.
export const supabase = supabaseConfigured
  ? createClient(url as string, anonKey as string)
  : (null as unknown as ReturnType<typeof createClient>)

export const MEDIA_BUCKET = 'media'

export function publicMediaUrl(path: string) {
  if (!supabase) return path
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}
