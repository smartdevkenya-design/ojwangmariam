import { useState } from 'react'
import { Link } from 'react-router-dom'
import { stories } from '../data/stories'

function Hero() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    const subject = encodeURIComponent('I want to join the campaign')
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nI'd like to join the Ojwang Mariam campaign effort.`
    )
    window.location.href = `mailto:ojwangmariam@gmail.com?subject=${subject}&body=${body}`

    setSubmitted(true)
    setName('')
    setEmail('')
  }

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-navy-deep">
      <img
        src="https://picsum.photos/seed/mariam-hero-city/1600/900"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,21,41,0.75)_0%,rgba(6,21,41,0.85)_60%,rgba(6,21,41,0.97)_100%)]" />
      <div className="relative mx-auto w-full max-w-[1200px] px-6 py-16 sm:py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
            Join the Campaign Effort
          </p>
          <h1 className="mt-4 text-[34px] font-bold leading-[1.1] text-white sm:text-[46px] md:text-[64px]">
            We Can Transform Kahawa West Together!
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/75 sm:text-lg">
            From the slums to a world-class university, breaking barriers as
            a media pioneer, community leader, and your incoming 2027 MCA
            for Kahawa West Ward.
          </p>

          <form
            className="mt-10 flex max-w-xl flex-col gap-0 overflow-hidden rounded-lg bg-white shadow-xl sm:flex-row"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-hairline bg-transparent px-5 py-4 text-sm text-ink outline-none sm:w-1/3 sm:border-b-0"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-hairline bg-transparent px-5 py-4 text-sm text-ink outline-none sm:w-1/3 sm:border-b-0 sm:border-l"
            />
            <button
              type="submit"
              className="w-full shrink-0 bg-crimson px-6 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-crimson-dark sm:w-auto"
            >
              Join Now
            </button>
          </form>
          {submitted && (
            <p className="mt-3 text-sm text-white/80">
              Thanks! Your email client should be opening now — send the
              message to complete signing up.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-10 sm:py-16">
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
              <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-navy p-4">
                <img
                  src={`https://picsum.photos/seed/story-${item.id}/600/400`}
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
      <Link
        to="/manifesto"
        className="group relative flex min-h-[320px] items-center justify-center overflow-hidden bg-navy-deep px-6 py-16"
      >
        <img
          src="https://picsum.photos/seed/manifesto-panel/900/700"
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
      <Highlights />
      <IssuesPanel />
    </>
  )
}

export default Home
