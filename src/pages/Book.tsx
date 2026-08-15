import { Link } from 'react-router-dom'
import { useSiteContent } from '../lib/content'

function Book() {
  const { content } = useSiteContent()
  const { title, subtitle, description, launchDetails, priceStandard, priceSponsor } =
    content.book

  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="aspect-[3/4] w-full max-w-sm rounded border border-hairline bg-navy/5" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
              Featured Masterpiece
            </p>
            <h1 className="mt-2 text-[28px] font-medium text-navy md:text-[32px]">{title}</h1>
            <p className="mt-1 text-lg text-muted">{subtitle}</p>
            <p className="mt-6 text-muted">{description}</p>
            <p className="mt-4 text-sm text-muted">{launchDetails}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">Standard Copy</p>
                <p className="mt-1 text-lg font-semibold text-crimson">{priceStandard}</p>
              </div>
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">
                  Sponsor a Slum/Rescue Centre Student
                </p>
                <p className="mt-1 text-lg font-semibold text-crimson">{priceSponsor}</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
            >
              Order Online / Sponsor a Reader
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Book
