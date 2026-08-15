import { supabase } from './supabase'

const BUCKET = 'site-images'

// Images bigger than this on their longest side get downscaled before
// upload — phone photos are routinely 3000px+ / several MB, which is
// massive overkill for anything on this site and is what was making
// pages feel slow to load.
const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.82

/**
 * Resizes/compresses an image file in the browser using a canvas.
 * Falls back to the original file if anything goes wrong (e.g. the
 * file isn't a decodable image, or the browser lacks canvas support)
 * so uploads never hard-fail because of this step.
 */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))

    // Already small enough — don't bother re-encoding (avoids quality
    // loss on images that are fine as-is).
    if (scale === 1 && file.size < 500 * 1024) {
      bitmap.close()
      return file
    }

    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    )
    if (!blob) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    // Decoding failed (e.g. HEIC on a browser without support) —
    // just upload the original rather than blocking the user.
    return file
  }
}

/**
 * Uploads a file to the public `site-images` bucket and returns its
 * public URL. `folder` groups files in the dashboard (e.g. 'hero',
 * 'gallery', 'stories') — purely organizational.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const optimized = await compressImage(file)

  const ext = optimized.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${safeExt}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, optimized, {
    cacheControl: '31536000',
    upsert: false,
    contentType: optimized.type || 'image/jpeg',
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
