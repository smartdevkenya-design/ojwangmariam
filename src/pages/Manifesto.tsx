import { usePageContent } from '../context/SiteDataContext'
import type { ManifestoContent } from '../lib/types'

function Manifesto() {
  const content = usePageContent<ManifestoContent>('manifesto')
  return (
    <section className="bg-white">
      <div className="w-full px-6 py-10 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{content.eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">{content.heading}</h1>
        <p className="mt-4 max-w-2xl text-muted">{content.intro}</p>
        <p className="mt-4 max-w-2xl border-l-4 border-crimson pl-4 text-base italic text-navy">
          "{content.quote}"
        </p>
        <p className="mt-1 max-w-2xl text-sm text-muted">{content.quote_note}</p>
        <img
          src={content.banner_url}
          alt="Campaign banner (mock)"
          className="mt-8 aspect-[12/5] w-full rounded border border-hairline object-cover"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.pillars.map((p) => (
            <div key={p.title} className="overflow-hidden rounded border border-hairline bg-navy">
              <img src={p.image_url} alt="" className="aspect-[16/9] w-full object-cover opacity-80" />
              <div className="p-5 sm:p-6">
                <div className="mb-4 h-10 w-10 rounded-full bg-crimson" />
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Manifesto
