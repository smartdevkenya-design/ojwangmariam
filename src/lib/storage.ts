import { supabase } from './supabase'

const BUCKET = 'site-images'

/**
 * Uploads a file to the public `site-images` bucket and returns its
 * public URL. `folder` groups files in the dashboard (e.g. 'hero',
 * 'gallery', 'stories') — purely organizational.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${safeExt}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
