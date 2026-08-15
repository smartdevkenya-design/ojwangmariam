import { useSiteContent } from '../lib/content'

function Media() {
  const { content } = useSiteContent()
  const { eyebrow, heading, items } = content.media

  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          {heading}
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((i, idx) => (
            <div key={idx} className="border-t-2 border-navy bg-white p-5 shadow-sm">
              {i.imageUrl && (
                <img
                  src={i.imageUrl}
                  alt={i.title}
                  className="mb-4 aspect-video w-full rounded object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3 className="text-sm font-semibold text-navy">{i.title}</h3>
              <p className="mt-2 text-sm text-muted">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Media
