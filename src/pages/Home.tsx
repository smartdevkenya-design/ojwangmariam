import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent, useStories } from '../lib/content'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

function Hero() {
  const { content } = useSiteContent()
  const { eyebrow, headline, subhead, imageUrl } = content.hero
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      setStatus('error')
      return
    }
    setStatus('saving')
    const { error } = await supabase.from('signups').insert({ name, email })
    if (error) {
      setStatus('error')
      return
    }
    setStatus('done')
    setName('')
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden bg-navy-deep">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,30,63,0.97)_35%,rgba(10,30,63,0.55)_75%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 border-l border-navy-light bg-navy-light/40 md:block" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[38px] font-medium leading-[1.15] text-white md:text-[52px]">
            {headline}
          </h1>
          <p className="mt-4 text-white/70">{subhead}</p>

          {status === 'done' ? (
            <p className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-navy shadow-lg">
              Thanks for joining the movement — we'll be in touch.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 rounded-full bg-white p-2 pl-4 shadow-lg sm:flex-row sm:items-center"
            >
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border-0 bg-transparent px-2 py-2.5 text-sm text-ink outline-none sm:w-1/3"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border-0 bg-transparent px-2 py-2.5 text-sm text-ink outline-none sm:w-1/3 sm:border-l sm:border-hairline"
              />
              <button
                type="submit"
                disabled={status === 'saving'}
                className="w-full rounded-full bg-crimson px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60 sm:w-auto"
              >
                {status === 'saving' ? 'Joining…' : 'Join Now'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-3 text-sm text-crimson">
              Something went wrong — please try again.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function CtaRibbon() {
  const items = [
    { title: 'Volunteer', body: 'Get involved with the campaign', to: '/contact' },
    { title: 'Donate Now', body: 'Support via M-Pesa Paybill 247247', to: '/contact' },
    { title: 'Order the Book', body: 'Get your copy of Believe Become', to: '/book' },
  ]
  return (
    <section className="bg-crimson">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 divide-y divide-white/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
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

function Highlights() {
  const { stories } = useStories()
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Welcome to the Campaign
        </p>
        <h2 className="mt-2 text-center text-[28px] font-medium text-navy md:text-[32px]">
          Latest Campaign Highlights
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-10 bg-crimson" />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stories.map((item) => (
            <Link
              key={item.id}
              to={`/stories/${item.id}`}
              className="group flex flex-col overflow-hidden rounded border border-hairline bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative flex h-40 items-end overflow-hidden bg-navy p-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
                <span className="absolute left-4 top-4 z-10 rounded-sm bg-crimson px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {item.tag}
                </span>
                <span className="relative z-10 text-sm text-white/80">{item.date}</span>
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

function IssuesPanel() {
  const issues = [
    { title: 'Inclusive Leadership', body: 'Equal resources for youth, women & PWDs', to: '/manifesto' },
    { title: 'Accountable Governance', body: 'Transparent bursaries & development funds', to: '/manifesto' },
    { title: 'Sustainable Empowerment', body: 'Markets, sanitation & youth tech hubs', to: '/manifesto' },
    { title: 'About Mariam', body: 'The journey from Kahawa West to Kenyatta University', to: '/about' },
    { title: 'The Book', body: 'Believe Become — order your copy', to: '/book' },
  ]
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex min-h-[320px] items-center justify-center bg-navy-deep px-6 py-16">
        <span className="text-center text-2xl font-medium uppercase tracking-[0.2em] text-white/90">
          The Manifesto
        </span>
      </div>
      <div className="bg-navy">
        <ul className="divide-y divide-navy-light">
          {issues.map((issue) => (
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
  return (
    <>
      <Hero />
      <CtaRibbon />
      <Highlights />
      <IssuesPanel />
    </>
  )
}

export default Home
