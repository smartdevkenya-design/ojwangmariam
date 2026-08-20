import { usePageContent } from '../context/SiteDataContext'
import type { AboutContent } from '../lib/types'

function About() {
  const content = usePageContent<AboutContent>('about')
  return (
    <section className="bg-white">
      <div className="w-full px-6 py-10 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{content.eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">{content.heading}</h1>
        <p className="mt-4 max-w-2xl text-muted">{content.intro}</p>
        <img
          src={content.portrait_url}
          alt="Ojwang Mariam (mock portrait)"
          className="mt-8 aspect-[12/5] w-full rounded border border-hairline object-cover"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.cards.map((c) => (
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
