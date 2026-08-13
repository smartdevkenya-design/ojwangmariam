import { useState } from 'react'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#book', label: 'The Book' },
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#media', label: 'Media & News' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-navy-light">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <a href="#top" className="text-white font-medium tracking-tight">
          OJWANG MARIAM <span className="text-white/60 font-normal">| Tuko Kadi</span>
        </a>
        <div className="hidden gap-2 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/85 transition-colors hover:bg-navy-light hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="hidden rounded-full bg-crimson px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark md:inline-block"
        >
          Contribute
        </a>
        <button
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 border-t border-navy-light px-6 py-4 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white/85 hover:bg-navy-light hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-crimson px-5 py-2.5 text-center text-sm font-medium uppercase tracking-wide text-white"
          >
            Contribute
          </a>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-deep">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,30,63,0.97)_35%,rgba(10,30,63,0.55)_75%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 border-l border-navy-light bg-navy-light/40 md:block" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
            Join the campaign effort
          </p>
          <h1 className="mt-4 text-[38px] font-medium leading-[1.15] text-white md:text-[52px]">
            Vision Beyond Sight: Transforming Kahawa West
          </h1>
          <p className="mt-4 text-white/70">
            From the slums to a world-class university, breaking barriers as
            a media pioneer, community leader, and your incoming 2027 MCA
            for Kahawa West Ward.
          </p>

          <form
            className="mt-8 flex flex-col gap-3 rounded bg-white p-4 shadow-lg sm:flex-row sm:items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-full border border-hairline px-4 py-2.5 text-sm text-ink outline-none focus:border-crimson sm:w-1/3"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-full border border-hairline px-4 py-2.5 text-sm text-ink outline-none focus:border-crimson sm:w-1/3"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-crimson px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark sm:w-auto"
            >
              Join Now
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function CtaRibbon() {
  const items = [
    { title: 'Volunteer', body: 'Get involved with the campaign' },
    { title: 'Donate Now', body: 'Support via M-Pesa Paybill 247247' },
    { title: 'Order the Book', body: 'Get your copy of Believe Become' },
  ]
  return (
    <section className="bg-crimson">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 divide-y divide-white/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.title === 'Order the Book' ? '#book' : '#contact'}
            className="flex items-center gap-4 px-6 py-5 text-white hover:bg-crimson-dark transition-colors"
          >
            <span className="h-9 w-9 shrink-0 rounded-full border border-white/60" />
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide">
                {item.title}
              </span>
              <span className="block text-xs text-white/80">{item.body}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

const stories = [
  {
    id: 'book-launch',
    tag: 'Book Launch',
    title: 'Believe Become — the memoir',
    date: 'Aug 7, 2026',
    summary:
      'Officially unveiled at the Kenya National Theatre, Nairobi — a memoir and motivational blueprint on resilience, low vision, and rising from a Children Rescue Centre to Kenyatta University.',
    paragraphs: [
      'Believe Become — subtitled "Vision Beyond Sight: From the Slums to a World-Class University" — is a powerful memoir and motivational blueprint written to inspire global social impact.',
      "It delves deep into Mariam's structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.",
      'This era-defining literary piece, alongside its accompanying podcast network, was officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre in Nairobi.',
      'The book is available as a Standard Copy for KSH 1,200, or you can Sponsor a Slum/Rescue Centre Student Copy, also priced at KSH 1,200, to put a copy directly into the hands of a young person coming up through the same rescue-centre system Mariam once relied on.',
    ],
    ctaLabel: 'Order Online / Sponsor a Reader',
    ctaHref: '#contact',
  },
  {
    id: 'manifesto',
    tag: 'Manifesto',
    title: 'Siasa Safi, Maisha Bora',
    date: 'Kahawa West 2027',
    summary:
      'Three pillars for Kahawa West Ward: inclusive leadership, accountable governance, and sustainable empowerment — running under the Democracy for Citizens Party.',
    paragraphs: [
      'Mariam is vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner, with the campaign slogan "Kuwakumbusha tu Connection ni God na Jamii" — a bold reminder that the only alignment that matters is with God and the grassroots community, not political cartels.',
      'The manifesto rests on three core pillars. Inclusive Leadership calls for equal county resource allocation for youth, women, and Persons with Disabilities (PWDs). Accountable Governance commits to full transparency in ward bursary distributions and public development funds. Sustainable Empowerment focuses on upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.',
    ],
    ctaLabel: 'Join the Movement',
    ctaHref: '#contact',
  },
  {
    id: 'media-impact',
    tag: 'Community',
    title: 'Wueeh TV Kenya & Grassroots Impact',
    date: 'Ongoing',
    summary:
      'As Founder and CEO, Mariam built a community digital media network spotlighting grassroots talent and structural injustice across Nairobi.',
    paragraphs: [
      'As Founder and CEO of Wueeh TV Kenya CBO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.',
      'Mariam also serves as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.',
      'Beyond media and SHOFCO, Mariam is an executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace in the community.',
    ],
    ctaLabel: 'Get in Touch',
    ctaHref: '#contact',
  },
]

function Highlights() {
  const [openStory, setOpenStory] = useState<string | null>(null)
  const active = stories.find((s) => s.id === openStory) ?? null

  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        {!active ? (
          <>
            <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-crimson">
              Welcome to the Campaign
            </p>
            <h2 className="mt-2 text-center text-[28px] font-medium text-navy md:text-[32px]">
              Latest Campaign Highlights
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-10 bg-crimson" />

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {stories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setOpenStory(item.id)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="group flex flex-col overflow-hidden rounded border border-hairline bg-white text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative flex h-40 items-end bg-navy p-4">
                    <span className="absolute left-4 top-4 rounded-sm bg-crimson px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      {item.tag}
                    </span>
                    <span className="text-sm text-white/60">{item.date}</span>
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
                </button>
              ))}
            </div>
          </>
        ) : (
          <article className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => setOpenStory(null)}
              className="text-sm font-medium uppercase tracking-wide text-crimson hover:text-crimson-dark"
            >
              ← Back to Campaign Highlights
            </button>

            <span className="mt-6 inline-block rounded-sm bg-crimson px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {active.tag}
            </span>
            <h2 className="mt-3 text-[28px] font-medium text-navy md:text-[32px]">
              {active.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{active.date}</p>

            <div className="mt-6 space-y-4">
              {active.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-ink">
                  {p}
                </p>
              ))}
            </div>

            <a
              href={active.ctaHref}
              onClick={() => setOpenStory(null)}
              className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
            >
              {active.ctaLabel}
            </a>
          </article>
        )}
      </div>
    </section>
  )
}

function IssuesPanel() {
  const issues = [
    { title: 'Inclusive Leadership', body: 'Equal resources for youth, women & PWDs', href: '#manifesto' },
    { title: 'Accountable Governance', body: 'Transparent bursaries & development funds', href: '#manifesto' },
    { title: 'Sustainable Empowerment', body: 'Markets, sanitation & youth tech hubs', href: '#manifesto' },
    { title: 'About Mariam', body: 'The journey from Kahawa West to Kenyatta University', href: '#about' },
    { title: 'The Book', body: 'Believe Become — order your copy', href: '#book' },
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
              <a
                href={issue.href}
                className="flex items-center gap-4 px-8 py-5 transition-colors hover:bg-navy-light"
              >
                <span className="h-9 w-9 shrink-0 rounded-full border border-white/40" />
                <span>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-white">
                    {issue.title}
                  </span>
                  <span className="block text-xs text-white/60">{issue.body}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function About() {
  const cards = [
    {
      title: 'Overcoming the Odds',
      body: 'Growing up in the unforgiving urban slums of Nairobi, Mariam faced severe economic hardships, eventually experiencing teenage homelessness — until shelter arrived through a local Children Rescue Centre.',
    },
    {
      title: 'Defying Limitations',
      body: 'Navigating the world as an individual with PWD Low Vision, Mariam actively dismantled structural barriers, proving at every stage that Disability is not Inability.',
    },
    {
      title: 'Academic Excellence',
      body: 'Driven by an unyielding belief in education, Mariam transitioned from the rescue centers straight to Kenyatta University, graduating with a Bachelor of Education degree.',
    },
    {
      title: 'The Vision',
      body: 'Today, Mariam stands as an award-winning multimedia journalist, former KU Radio/KUTV news anchor, CEO of Wueeh TV Kenya, and a relentless voice for the marginalized.',
    },
  ]
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">About</p>
        <h2 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          The Journey of Resilience: Meet Ojwang Mariam
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Born Vincent Maina Nyakinyua and widely celebrated across Kenya as
          Ojwang Mariam (Mtoto Wa Mariam), this is a story of turning
          profound adversity into a lifelong mission for social justice.
        </p>
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

function Book() {
  return (
    <section id="book" className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="aspect-[3/4] w-full max-w-sm rounded border border-hairline bg-navy/5" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
              Featured Masterpiece
            </p>
            <h2 className="mt-2 text-[28px] font-medium text-navy md:text-[32px]">
              Believe Become
            </h2>
            <p className="mt-1 text-lg text-muted">
              Vision Beyond Sight: From the Slums to a World-Class University
            </p>
            <p className="mt-6 text-muted">
              A powerful memoir and motivational blueprint written to inspire
              global social impact. It delves deep into Mariam's structural
              survival, mental resilience, and the strategies used to
              traverse intense physical and economic challenges — a roadmap
              for any youth looking to find their voice and change their
              community.
            </p>
            <p className="mt-4 text-sm text-muted">
              Officially unveiled at a grand launch on{' '}
              <span className="text-ink">
                Friday, 7th August 2026 at the Kenya National Theatre, Nairobi
              </span>
              , alongside its accompanying podcast network.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">Standard Copy</p>
                <p className="mt-1 text-lg font-semibold text-crimson">KSH 1,200</p>
              </div>
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">
                  Sponsor a Slum/Rescue Centre Student
                </p>
                <p className="mt-1 text-lg font-semibold text-crimson">KSH 1,200</p>
              </div>
            </div>

            <a
              href="#contact"
              className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
            >
              Order Online / Sponsor a Reader
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Manifesto() {
  const pillars = [
    {
      title: 'Inclusive Leadership',
      body: 'Equal county resource allocation for youth, women, and Persons with Disabilities (PWDs).',
    },
    {
      title: 'Accountable Governance',
      body: 'Full transparency in ward bursary distributions and public development funds.',
    },
    {
      title: 'Sustainable Empowerment',
      body: 'Upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.',
    },
  ]
  return (
    <section id="manifesto" className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Kahawa West 2027
        </p>
        <h2 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          Siasa Safi, Maisha Bora
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Vying for Member of County Assembly (MCA) for Kahawa West Ward
          under the Democracy for Citizens Party (DCP) banner.
        </p>
        <p className="mt-4 max-w-2xl border-l-4 border-crimson pl-4 text-base italic text-navy">
          "Kuwakumbusha tu Connection ni God na Jamii"
        </p>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          A bold reminder that our only alignment is with God and the
          grassroots community, not political cartels.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded border border-hairline bg-navy p-6">
              <div className="mb-4 h-10 w-10 rounded-full bg-crimson" />
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-white/70">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Media() {
  const items = [
    {
      title: 'Wueeh TV Kenya CBO',
      body: 'As Founder and CEO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.',
    },
    {
      title: 'SHOFCO Youth Leadership',
      body: 'Serving as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.',
    },
    {
      title: 'Community Building',
      body: 'Executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace.',
    },
  ]
  return (
    <section id="media" className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Media & Impact
        </p>
        <h2 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          Impact Beyond Politics
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="border-t-2 border-navy bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-navy">{i.title}</h3>
              <p className="mt-2 text-sm text-muted">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const captions = [
    'Book launch, Kenya National Theatre',
    'Community outreach, Kahawa West',
    'On set at Wueeh TV Kenya',
    'SHOFCO youth leadership event',
    'Mr & Miss Roysambu',
    'Campaign walkabout',
  ]
  return (
    <section id="gallery" className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">Gallery</p>
        <h2 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          Moments From the Ground
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Photos placeholder — swap these in once real event and campaign
          photography is ready.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {captions.map((caption) => (
            <figure key={caption} className="overflow-hidden rounded border border-hairline">
              <div className="aspect-square bg-navy/5" />
              <figcaption className="bg-offwhite px-3 py-2 text-xs text-muted">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="bg-navy-deep">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Get Involved
        </p>
        <h2 className="mt-2 max-w-xl text-[28px] font-medium text-white md:text-[32px]">
          Stand With Ojwang Mariam
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Contact
            </h3>
            <p className="mt-3 text-white">
              <a href="mailto:ojwangmariam@gmail.com" className="hover:text-crimson">
                ojwangmariam@gmail.com
              </a>
            </p>
            <p className="mt-1 text-white">
              <a href="tel:+254722731328" className="hover:text-crimson">
                +254 722 731 328
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Campaign & Book Financials
            </h3>
            <div className="mt-3 rounded border border-navy-light bg-navy p-4">
              <p className="text-sm text-white/70">
                M-Pesa Paybill: <span className="text-white">247247</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Number: <span className="text-white">731328</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Name:{' '}
                <span className="text-white">Ojwang Mariam Solutions</span>
              </p>
            </div>
          </div>
        </div>
        <a
          href="mailto:ojwangmariam@gmail.com"
          className="mt-10 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
        >
          Join the Movement
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-navy border-t border-navy-light">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-white/50 md:flex-row md:items-center">
        <span>© 2026 Ojwang Mariam. Kahawa West 2027.</span>
        <span>Siasa Safi, Maisha Bora.</span>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Nav />
      <Hero />
      <CtaRibbon />
      <Highlights />
      <IssuesPanel />
      <About />
      <Book />
      <Manifesto />
      <Media />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
