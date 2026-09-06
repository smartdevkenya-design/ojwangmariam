import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData, usePageContent } from '../context/SiteDataContext'
import type { HomeContent } from '../lib/types'
import { supabase } from '../lib/supabase'

function FloatingJoinBar() {
  const { settings } = useSiteData()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || submitting) return
    if (!supabase) {
      setError('Signups aren\u2019t connected yet.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error: insertError } = await supabase.from('contact_messages').insert({
      source: 'join_bar',
      name,
      email,
      message: 'Wants to join the campaign effort (Home page Join Now bar).',
    })
    setSubmitting(false)
    if (insertError) {
      setError('Something went wrong — please try again.')
      return
    }
    setSubmitted(true)
    setName('')
    setEmail('')
  }

  if (dismissed) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/97 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <p className="hidden shrink-0 text-sm font-semibold text-navy sm:block">
          {submitted ? "Thanks for signing up! We'll be in touch." : 'Join the campaign effort'}
        </p>
        {!submitted && (
          <form
            className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-hairline px-3 py-2 text-sm text-ink outline-none focus:border-crimson sm:w-40"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-hairline px-3 py-2 text-sm text-ink outline-none focus:border-crimson sm:w-52"
            />
            <button
              type="submit"
              disabled={submitting}
              className="shrink-0 rounded bg-crimson px-5 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Join Now'}
            </button>
            {error && <span className="text-xs text-crimson sm:ml-2">{error}</span>}
          </form>
        )}
        {submitted && (
          <p className="flex-1 text-xs text-muted sm:text-sm">
            Want to support financially too? M-Pesa Paybill{' '}
            <span className="font-semibold text-navy">{settings.mpesa_paybill}</span>, Account{' '}
            <span className="font-semibold text-navy">{settings.mpesa_account}</span> — or{' '}
            <Link to="/contact#donate" className="font-semibold text-crimson hover:underline">
              see full details
            </Link>
            .
          </p>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="absolute right-2 top-1 text-lg leading-none text-muted hover:text-navy sm:static sm:ml-2"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function Hero({ content }: { content: HomeContent }) {
  return (
    <section className="relative flex min-h-[80dvh] items-center overflow-hidden bg-navy-deep sm:min-h-[100dvh] [@media(max-height:500px)]:min-h-0">
      <img
        src={content.hero_image_url}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,21,41,0.75)_0%,rgba(6,21,41,0.85)_60%,rgba(6,21,41,0.97)_100%)]" />
      <div className="relative w-full px-6 py-16 sm:py-24 md:py-32 [@media(max-height:500px)]:py-16">
        <div className="max-w-4xl text-center md:mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
            {content.hero_eyebrow}
          </p>
          <h1 className="mt-4 text-[56px] font-bold leading-[1.05] text-white sm:text-[76px] md:text-[104px]">
            {content.hero_heading}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/75 sm:text-xl">{content.hero_body}</p>
        </div>
      </div>
    </section>
  )
}

function CtaRibbon({ content }: { content: HomeContent }) {
  return (
    <section className="bg-crimson">
      <div className="grid w-full grid-cols-1 divide-y divide-white/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {content.ribbon_items.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="flex items-center gap-4 px-6 py-5 text-white hover:bg-crimson-dark transition-colors"
          >
            <span className="h-9 w-9 shrink-0 rounded-full border border-white/60" />
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide">
                {item.title}
              </span>
              <span className="block text-xs text-white/80">{item.body}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Highlights({ content }: { content: HomeContent }) {
  const { stories } = useSiteData()
  return (
    <section className="bg-offwhite">
      <div className="w-full px-6 py-10 sm:py-16">
        <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          {content.highlights_eyebrow}
        </p>
        <h2 className="mt-2 text-center text-[28px] font-medium text-navy md:text-[32px]">
          {content.highlights_heading}
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-10 bg-crimson" />

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((item) => (
            <Link
              key={item.id}
              to={`/stories/${item.id}`}
              className="group flex flex-col overflow-hidden rounded border border-hairline bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-navy p-4">
                <img
                  src={item.image_url || `https://picsum.photos/seed/story-${item.id}/600/400`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <span className="absolute left-4 top-4 rounded-sm bg-crimson px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {item.tag}
                </span>
                <span className="relative text-sm text-white/90">{item.date}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold text-navy group-hover:text-crimson transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted">{item.summary}</p>
                <span className="mt-4 text-sm font-medium uppercase tracking-wide text-crimson">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function IssuesPanel({ content }: { content: HomeContent }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <Link
        to="/manifesto"
        className="group relative flex min-h-[320px] items-center justify-center overflow-hidden bg-navy-deep px-6 py-16"
      >
        <img
          src={content.issues_panel_image_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-50"
        />
        <div className="absolute inset-0 bg-navy-deep/50" />
        <span className="relative text-center text-2xl font-medium uppercase tracking-[0.2em] text-white/90">
          The Manifesto
        </span>
      </Link>
      <div className="bg-navy">
        <ul className="divide-y divide-navy-light">
          {content.issues.map((issue) => (
            <li key={issue.title}>
              <Link
                to={issue.to}
                className="flex items-center gap-4 px-8 py-5 transition-colors hover:bg-navy-light"
              >
                <span className="h-9 w-9 shrink-0 rounded-full border border-white/40" />
                <span>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-white">
                    {issue.title}
                  </span>
                  <span className="block text-xs text-white/60">{issue.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Home() {
  const content = usePageContent<HomeContent>('home')
  return (
    <>
      <Hero content={content} />
      <CtaRibbon content={content} />
      <Highlights content={content} />
      <IssuesPanel content={content} />
      <div className="h-20 sm:h-16" aria-hidden="true" />
      <FloatingJoinBar />
    </>
  )
}

export default Home
