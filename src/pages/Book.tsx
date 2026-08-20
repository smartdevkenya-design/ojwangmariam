import { Link } from 'react-router-dom'
import { usePageContent } from '../context/SiteDataContext'
import type { BookContent } from '../lib/types'

function Book() {
  const content = usePageContent<BookContent>('book')
  return (
    <section className="bg-offwhite">
      <div className="w-full px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <img
            src={content.cover_url}
            alt="Believe Become book cover (mock)"
            className="aspect-[3/4] w-full max-w-sm rounded border border-hairline object-cover"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{content.eyebrow}</p>
            <h1 className="mt-2 text-[28px] font-medium text-navy md:text-[32px]">{content.title}</h1>
            <p className="mt-1 text-lg text-muted">{content.subtitle}</p>
            <p className="mt-6 text-muted">{content.description}</p>
            <p className="mt-4 text-sm text-muted">{content.launch_note}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">{content.price_standard_label}</p>
                <p className="mt-1 text-lg font-semibold text-crimson">{content.price_standard}</p>
              </div>
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">{content.price_sponsor_label}</p>
                <p className="mt-1 text-lg font-semibold text-crimson">{content.price_sponsor}</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
            >
              {content.cta_label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Book
