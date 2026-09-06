import { useState } from 'react'
import { useSiteData, usePageContent } from '../context/SiteDataContext'
import type { ContactContent } from '../lib/types'
import { supabase } from '../lib/supabase'

function ContactForm({
  ctaLabel,
  mpesa,
}: {
  ctaLabel: string
  mpesa: { paybill: string; account: string; accountName: string }
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim() || submitting) return
    if (!supabase) {
      setError('Messaging isn\u2019t connected yet — please use the email or phone above instead.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error: insertError } = await supabase.from('contact_messages').insert({
      source: 'contact',
      name,
      email,
      phone: phone || null,
      message,
    })
    setSubmitting(false)
    if (insertError) {
      setError('Something went wrong — please try again, or use the email/phone above.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mt-10 max-w-xl rounded border border-white/20 bg-navy p-6">
        <p className="text-white">Thanks — your message has been received. We'll be in touch soon.</p>
        <div className="mt-4 rounded border border-crimson/40 bg-navy-deep p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Want to support the campaign directly?
          </p>
          <p className="mt-2 text-sm text-white/70">
            M-Pesa Paybill: <span className="text-white">{mpesa.paybill}</span>
          </p>
          <p className="mt-1 text-sm text-white/70">
            Account Number: <span className="text-white">{mpesa.account}</span>
          </p>
          <p className="mt-1 text-sm text-white/70">
            Account Name: <span className="text-white">{mpesa.accountName}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-xl space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-white/20 bg-navy px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-crimson"
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-white/20 bg-navy px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-crimson"
        />
      </div>
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded border border-white/20 bg-navy px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-crimson"
      />
      <textarea
        placeholder="Your message"
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded border border-white/20 bg-navy px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-crimson"
      />
      {error && <p className="text-sm text-crimson">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
      >
        {submitting ? 'Sending…' : ctaLabel}
      </button>
    </form>
  )
}

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
          <div id="donate" className="scroll-mt-24">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Campaign & Book Financials
            </h3>
            <div className="mt-3 rounded border-2 border-crimson/50 bg-navy p-4">
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
        <ContactForm
          ctaLabel={content.cta_label}
          mpesa={{
            paybill: settings.mpesa_paybill,
            account: settings.mpesa_account,
            accountName: settings.mpesa_account_name,
          }}
        />
      </div>
    </section>
  )
}

export default Contact
