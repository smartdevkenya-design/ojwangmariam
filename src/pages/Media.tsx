import { usePageContent } from '../context/SiteDataContext'
import type { MediaContent } from '../lib/types'
import { getYouTubeEmbedUrl } from '../lib/youtube'

function Media() {
  const content = usePageContent<MediaContent>('media')
  const embedUrl = getYouTubeEmbedUrl(content.live_youtube_url)

  return (
    <section className="bg-offwhite">
      <div className="w-full px-6 py-10 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{content.eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-2xl font-medium text-navy sm:text-[28px] md:text-[32px]">
          {content.heading}
        </h1>

        {embedUrl && (
          <div className="mt-8 md:mt-10">
            {content.live_title && (
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-crimson">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-crimson" />
                {content.live_title}
              </h2>
            )}
            <div className="aspect-video w-full max-w-3xl overflow-hidden rounded border border-hairline bg-black shadow-sm">
              <iframe
                src={embedUrl}
                title={content.live_title || 'Live video'}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
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
