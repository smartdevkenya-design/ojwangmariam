import { useState } from 'react'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#book', label: 'The Book' },
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#media', label: 'Media & News' },
  { href: '#contact', label: 'Contact' },
]

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-50 bg-espresso/95 backdrop-blur border-b border-walnut">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <a href="#top" className="text-warm-cream font-medium tracking-tight">
          OJWANG MARIAM <span className="text-driftwood font-normal">| Tuko Kadi</span>
        </a>
        <div className="hidden gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-warm-cream/90 hover:text-amber-forge transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="hidden rounded-full bg-amber-forge px-4 py-2.5 text-sm font-medium text-espresso md:inline-block"
        >
          Support Campaign
        </a>
        <button
          className="text-warm-cream md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-walnut px-6 py-4 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-warm-cream/90"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-amber-forge px-4 py-2.5 text-center text-sm font-medium text-espresso"
          >
            Support Campaign
          </a>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1200px] px-6 py-[72px] md:py-[152px]">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <span className="mb-6 inline-block rounded-full border border-warm-cream px-3 py-1 text-xs font-medium tracking-wide text-warm-cream">
            2027 MCA Candidate — Kahawa West Ward
          </span>
          <h1 className="text-[43px] leading-[1.1] tracking-[-0.3px] text-warm-cream md:text-[73px] md:leading-[1] md:tracking-[-0.8px]">
            Vision Beyond Sight: Transforming Kahawa West
          </h1>
          <p className="mt-6 max-w-[440px] text-base text-driftwood">
            From the slums to a world-class university, breaking barriers as a
            media pioneer, community leader, and your incoming 2027 MCA for
            Kahawa West Ward.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-amber-forge px-[15px] py-3 text-sm font-medium text-espresso"
            >
              Join the Movement
            </a>
            <a
              href="#book"
              className="rounded-full border border-warm-cream px-[15px] py-2.5 text-sm font-medium text-warm-cream"
            >
              Order "Believe Become"
            </a>
          </div>
        </div>
        <div className="aspect-[4/5] w-full rounded-md border border-walnut bg-burnt-edge/60" />
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
    <section id="about" className="border-t border-walnut">
      <div className="mx-auto max-w-[1200px] px-6 py-[52px]">
        <h2 className="max-w-2xl text-[35px] leading-[1.1] tracking-[-0.21px] text-warm-cream">
          The Journey of Resilience: Meet Ojwang Mariam
        </h2>
        <p className="mt-4 max-w-2xl text-base text-driftwood">
          Born Vincent Maina Nyakinyua and widely celebrated across Kenya as
          Ojwang Mariam (Mtoto Wa Mariam), this is a story of turning
          profound adversity into a lifelong mission for social justice.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="border-b border-walnut p-3">
              <div className="mb-3 h-10 w-10 rounded-full border border-walnut" />
              <h3 className="text-sm font-medium text-warm-cream">{c.title}</h3>
              <p className="mt-1 text-sm text-driftwood">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Book() {
  return (
    <section id="book" className="border-t border-walnut bg-midnight-cocoa">
      <div className="mx-auto max-w-[1200px] px-6 py-[52px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="aspect-[3/4] w-full max-w-sm rounded-md border border-walnut bg-burnt-edge/60" />
          <div>
            <span className="text-xs font-medium tracking-wide text-amber-forge">
              Featured Masterpiece
            </span>
            <h2 className="mt-2 text-[35px] leading-[1.1] tracking-[-0.21px] text-warm-cream">
              Believe Become
            </h2>
            <p className="mt-1 text-subheading text-driftwood">
              Vision Beyond Sight: From the Slums to a World-Class University
            </p>
            <p className="mt-6 text-base text-driftwood">
              A powerful memoir and motivational blueprint written to inspire
              global social impact. It delves deep into Mariam's structural
              survival, mental resilience, and the strategies used to
              traverse intense physical and economic challenges — a roadmap
              for any youth looking to find their voice and change their
              community.
            </p>
            <p className="mt-4 text-sm text-driftwood">
              Officially unveiled at a grand launch on{' '}
              <span className="text-warm-cream">
                Friday, 7th August 2026 at the Kenya National Theatre, Nairobi
              </span>
              , alongside its accompanying podcast network.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-walnut p-4">
                <p className="text-sm font-medium text-warm-cream">Standard Copy</p>
                <p className="mt-1 text-lg text-amber-forge">KSH 1,200</p>
              </div>
              <div className="rounded-md border border-walnut p-4">
                <p className="text-sm font-medium text-warm-cream">
                  Sponsor a Slum/Rescue Centre Student
                </p>
                <p className="mt-1 text-lg text-amber-forge">KSH 1,200</p>
              </div>
            </div>

            <a
              href="#contact"
              className="mt-8 inline-block rounded-full bg-amber-forge px-[15px] py-3 text-sm font-medium text-espresso"
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
    <section id="manifesto" className="border-t border-walnut">
      <div className="mx-auto max-w-[1200px] px-6 py-[52px]">
        <span className="text-xs font-medium tracking-wide text-amber-forge">
          Kahawa West 2027
        </span>
        <h2 className="mt-2 max-w-2xl text-[35px] leading-[1.1] tracking-[-0.21px] text-warm-cream">
          Siasa Safi, Maisha Bora
        </h2>
        <p className="mt-4 max-w-2xl text-base text-driftwood">
          Vying for Member of County Assembly (MCA) for Kahawa West Ward
          under the Democracy for Citizens Party (DCP) banner.
        </p>
        <p className="mt-2 max-w-2xl text-base italic text-warm-cream">
          "Kuwakumbusha tu Connection ni God na Jamii"
        </p>
        <p className="mt-1 max-w-2xl text-sm text-driftwood">
          A bold reminder that our only alignment is with God and the
          grassroots community, not political cartels.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-md border border-walnut p-6">
              <div className="mb-4 h-10 w-10 rounded-full bg-amber-forge" />
              <h3 className="text-base font-medium text-warm-cream">{p.title}</h3>
              <p className="mt-2 text-sm text-driftwood">{p.body}</p>
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
    <section id="media" className="border-t border-walnut bg-midnight-cocoa">
      <div className="mx-auto max-w-[1200px] px-6 py-[52px]">
        <h2 className="max-w-2xl text-[35px] leading-[1.1] tracking-[-0.21px] text-warm-cream">
          Impact Beyond Politics
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="border-b border-walnut p-3">
              <h3 className="text-sm font-medium text-warm-cream">{i.title}</h3>
              <p className="mt-1 text-sm text-driftwood">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="border-t border-walnut">
      <div className="mx-auto max-w-[1200px] px-6 py-[52px]">
        <h2 className="max-w-xl text-[35px] leading-[1.1] tracking-[-0.21px] text-warm-cream">
          Stand With Ojwang Mariam
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium tracking-wide text-driftwood">
              CONTACT
            </h3>
            <p className="mt-3 text-warm-cream">
              <a href="mailto:ojwangmariam@gmail.com" className="hover:text-amber-forge">
                ojwangmariam@gmail.com
              </a>
            </p>
            <p className="mt-1 text-warm-cream">
              <a href="tel:+254722731328" className="hover:text-amber-forge">
                +254 722 731 328
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-wide text-driftwood">
              CAMPAIGN & BOOK FINANCIALS
            </h3>
            <div className="mt-3 rounded-md border border-walnut p-4">
              <p className="text-sm text-driftwood">
                M-Pesa Paybill: <span className="text-warm-cream">247247</span>
              </p>
              <p className="mt-1 text-sm text-driftwood">
                Account Number: <span className="text-warm-cream">731328</span>
              </p>
              <p className="mt-1 text-sm text-driftwood">
                Account Name:{' '}
                <span className="text-warm-cream">Ojwang Mariam Solutions</span>
              </p>
            </div>
          </div>
        </div>
        <a
          href="mailto:ojwangmariam@gmail.com"
          className="mt-10 inline-block rounded-full bg-amber-forge px-[15px] py-3 text-sm font-medium text-espresso"
        >
          Join the Movement
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-walnut bg-midnight-cocoa">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 py-10 text-caption text-driftwood md:flex-row md:items-center">
        <span>© 2026 Ojwang Mariam. Kahawa West 2027.</span>
        <span>Siasa Safi, Maisha Bora.</span>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-espresso text-warm-cream">
      <Nav />
      <Hero />
      <About />
      <Book />
      <Manifesto />
      <Media />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
