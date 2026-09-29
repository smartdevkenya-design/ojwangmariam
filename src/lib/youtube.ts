/**
 * Accepts any common YouTube URL shape (watch, youtu.be, /live/, /embed/,
 * /shorts/) and returns an embeddable https://www.youtube.com/embed/<id>
 * URL, or null if the input isn't a recognizable YouTube link.
 */
export function getYouTubeId(input: string | undefined | null): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  let id = ''
  const host = url.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    id = url.pathname.slice(1)
  } else if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v') ?? ''
    } else if (url.pathname.startsWith('/embed/')) {
      id = url.pathname.slice('/embed/'.length)
    } else if (url.pathname.startsWith('/live/')) {
      id = url.pathname.slice('/live/'.length)
    } else if (url.pathname.startsWith('/shorts/')) {
      id = url.pathname.slice('/shorts/'.length)
    }
  }

  // Strip any trailing path segments/query the id might have picked up.
  id = id.split('/')[0].split('?')[0]

  return id || null
}

export function getYouTubeEmbedUrl(input: string | undefined | null): string | null {
  const id = getYouTubeId(input)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function getYouTubeThumbnail(input: string | undefined | null): string | null {
  const id = getYouTubeId(input)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}
