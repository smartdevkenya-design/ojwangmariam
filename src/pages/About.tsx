import { useSiteContent } from '../lib/content'

function About() {
  const { content } = useSiteContent()
  const { eyebrow, heading, intro, imageUrl, cards } = content.bio

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px] md:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{eyebrow}</p>
            <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
              {heading}
            </h1>
            <p className="mt-4 max-w-2xl text-muted">{intro}</p>
          </div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={heading}
              className="aspect-[4/5] w-full rounded object-cover md:order-last"
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="border-t-2 border-crimson bg-offwhite p-5">
              <h3 className="text-sm font-semibold text-navy">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
