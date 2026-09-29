import { useState } from 'react'
import { usePageContent } from '../context/SiteDataContext'
import type { MediaContent } from '../lib/types'
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '../lib/youtube'

function Media() {
  const content = usePageContent<MediaContent>('media')
  const previous = (content.previous_lives ?? []).filter((v) => getYouTubeEmbedUrl(v.youtube_url))

  // null = the current live video; otherwise the index of a previous live being played
  const [selected, setSelected] = useState<number | null>(null)

  const liveEmbed = getYouTubeEmbedUrl(content.live_youtube_url)
  const playing = selected !== null ? previous[selected] : null
  const embedUrl = playing
    ? `${getYouTubeEmbedUrl(playing.youtube_url)}?autoplay=1`
    : liveEmbed
  const playerTitle = playing ? playing.title : content.live_title

  const showVideoSection = Boolean(liveEmbed) || previous.length > 0

  return (
    <section className="bg-offwhite">
      <div className="w-full px-6 py-10 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{content.eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-2xl font-medium text-navy sm:text-[28px] md:text-[32px]">
          {content.heading}
        </h1>

        {showVideoSection && (
          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)]">
            {/* Main player — same size as before */}
            <div>
              {playerTitle && (
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-crimson">
                  {selected === null && (
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-crimson" />
                  )}
                  {playerTitle}
                </h2>
              )}
              {embedUrl && (
                <div className="aspect-video w-full max-w-2xl overflow-hidden rounded border border-hairline bg-black shadow-sm">
                  <iframe
                    key={embedUrl}
                    src={embedUrl}
                    title={playerTitle || 'Live video'}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}
              {selected !== null && liveEmbed && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mt-3 text-sm font-medium text-crimson hover:text-crimson-dark"
                >
                  ← Back to latest live
                </button>
              )}
            </div>

            {/* Previous live videos — fills the empty space on the right */}
            <aside>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy">
                {content.previous_lives_title || 'Previous Live Videos'}
              </h2>
              {previous.length === 0 ? (
                <p className="rounded border border-dashed border-hairline bg-white p-4 text-sm text-muted">
                  Previous live videos will appear here.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {previous.map((v, i) => {
                    const active = selected === i
                    return (
                      <li key={`${v.youtube_url}-${i}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(i)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`group flex w-full gap-3 overflow-hidden rounded border bg-white p-2 text-left shadow-sm transition hover:border-crimson ${
                            active ? 'border-crimson' : 'border-hairline'
                          }`}
                        >
                          <span className="relative block aspect-video w-32 shrink-0 overflow-hidden rounded bg-black sm:w-40">
                            <img
                              src={getYouTubeThumbnail(v.youtube_url) ?? ''}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-crimson text-xs text-white">
                                ▶
                              </span>
                            </span>
                          </span>
                          <span className="min-w-0 py-1">
                            <span className="line-clamp-2 block text-sm font-semibold text-navy">{v.title}</span>
                            {v.date && <span className="mt-1 block text-xs text-muted">{v.date}</span>}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </aside>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:mt-12 lg:grid-cols-3">
          {content.items.map((i) => (
            <div key={i.title} className="overflow-hidden rounded border-t-2 border-navy bg-white shadow-sm">
              <img src={i.image_url} alt="" className="aspect-[16/9] w-full object-cover" />
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-navy sm:text-base">{i.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{i.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Media
