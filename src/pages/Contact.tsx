import { useSiteData, usePageContent } from '../context/SiteDataContext'
import type { ContactContent } from '../lib/types'

function Contact() {
  const content = usePageContent<ContactContent>('contact')
  const { settings } = useSiteData()
  return (
    <section className="bg-navy-deep">
      <div className="w-full px-6 py-10 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">{content.eyebrow}</p>
        <h1 className="mt-2 max-w-xl text-[28px] font-medium text-white md:text-[32px]">{content.heading}</h1>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">Contact</h3>
            <p className="mt-3 text-white">
              <a href={`mailto:${settings.email}`} className="hover:text-crimson">
                {settings.email}
              </a>
            </p>
            <p className="mt-1 text-white">
              <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-crimson">
                {settings.phone}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Campaign & Book Financials
            </h3>
            <div className="mt-3 rounded border border-navy-light bg-navy p-4">
              <p className="text-sm text-white/70">
                M-Pesa Paybill: <span className="text-white">{settings.mpesa_paybill}</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Number: <span className="text-white">{settings.mpesa_account}</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Name: <span className="text-white">{settings.mpesa_account_name}</span>
              </p>
            </div>
          </div>
        </div>
        <a
          href={`mailto:${settings.email}`}
          className="mt-10 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
        >
          {content.cta_label}
        </a>
      </div>
    </section>
  )
}

export default Contact
