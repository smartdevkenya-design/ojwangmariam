import { useSiteData, usePageContent } from '../context/SiteDataContext'
import type { GalleryContent } from '../lib/types'

function Gallery() {
  const content = usePageContent<GalleryContent>('gallery')
  const { galleryImages } = useSiteData()
  return (
    <section className="bg-white">
      <div className="w-full px-6 py-10 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{content.eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">{content.heading}</h1>
        <p className="mt-4 max-w-2xl text-muted">{content.intro}</p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {galleryImages.map((img) => (
            <figure key={img.id} className="overflow-hidden rounded border border-hairline">
              <img src={img.url} alt={img.caption} className="aspect-square w-full object-cover" />
              <figcaption className="bg-offwhite px-3 py-2 text-xs text-muted">{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
