import { useSiteContent } from '../lib/content'

function Gallery() {
  const { content } = useSiteContent()

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">Gallery</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          Moments From the Ground
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Photos from the campaign, book launch, and community work.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {content.gallery.items.map((item, i) => (
            <figure key={i} className="overflow-hidden rounded border border-hairline">
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.caption}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="aspect-square bg-navy/5" />
              )}
              <figcaption className="bg-offwhite px-3 py-2 text-xs text-muted">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
