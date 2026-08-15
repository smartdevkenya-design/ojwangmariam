import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSiteContent, useStories } from '../lib/content'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/book', label: 'The Book' },
  { to: '/manifesto', label: 'Manifesto' },
  { to: '/media', label: 'Media & News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/contact', label: 'Contact' },
]

function TopBar() {
  const { content } = useSiteContent()
  const { pressText, phone, email } = content.topBar
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`
  return (
    <div className="hidden bg-navy-deep text-white/70 md:block">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-2 text-xs">
        <p className="truncate">
          <span className="font-semibold uppercase tracking-wide text-crimson">Press:</span>{' '}
          {pressText}
        </p>
        <div className="flex shrink-0 items-center gap-5">
          <a href={phoneHref} className="flex items-center gap-1.5 hover:text-white">
            <span aria-hidden>📞</span> {phone}
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white">
            <span aria-hidden>✉️</span> {email}
          </a>
        </div>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 flex-col items-start leading-none">
      <span className="border-2 border-crimson px-2.5 py-1 text-sm font-bold tracking-wide text-white sm:text-base">
        OJWANG MARIAM
      </span>
      <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-crimson">
        ★ ★ ★ &nbsp;TUKO KADI
      </span>
    </Link>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
      isActive ? 'bg-crimson text-white' : 'text-white/85 hover:bg-navy-light hover:text-white'
    }`

  return (
    <>
      <TopBar />
      <nav className="sticky top-0 z-50 bg-navy border-b border-navy-light">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
          <Logo />
          <div className="hidden gap-2 md:flex">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/contact"
            className="hidden rounded-full bg-crimson px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark md:inline-block"
          >
            Contribute
          </Link>
          <button
            className="shrink-0 text-white md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
        {open && (
          <div className="flex flex-col gap-2 border-t border-navy-light px-6 py-4 md:hidden">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white/85 hover:bg-navy-light hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-crimson px-5 py-2.5 text-center text-sm font-medium uppercase tracking-wide text-white"
            >
              Contribute
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}

function Footer() {
  const { stories } = useStories()
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/book', label: 'The Book' },
    { to: '/manifesto', label: 'Manifesto' },
    { to: '/media', label: 'Media & News' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/contact', label: 'Contact' },
  ]
  const tags = [
    'PWD Rights',
    'Youth Empowerment',
    'Kahawa West',
    'Governance',
    'Education',
    'Media',
    'Community',
    'DCP',
  ]
  return (
    <footer className="bg-navy-deep border-t border-navy-light">
      <div className="mx-auto max-w-[1200px] px-6 py-10 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">About</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Ojwang Mariam — award-winning multimedia journalist, founder
              and CEO of Wueeh TV Kenya, and 2027 MCA candidate for Kahawa
              West Ward. Siasa Safi, Maisha Bora.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-white/60">
              <li>Kahawa West, Nairobi</li>
              <li>
                <a href="tel:+254722731328" className="hover:text-crimson">
                  +254 722 731 328
                </a>
              </li>
              <li>
                <a href="mailto:ojwangmariam@gmail.com" className="hover:text-crimson">
                  ojwangmariam@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/60 hover:text-crimson">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Latest Highlights
            </h3>
            <ul className="mt-3 space-y-3">
              {stories.slice(0, 3).map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/stories/${s.id}`}
                    className="text-left text-sm text-white/80 hover:text-crimson"
                  >
                    {s.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-white/40">{s.date}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-navy-light px-3 py-1 text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-light">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-2 px-6 py-4 text-xs text-white/50 sm:gap-4 sm:py-6 md:flex-row md:items-center">
          <span>© 2026 Ojwang Mariam. Kahawa West 2027.</span>
          <span>Siasa Safi, Maisha Bora.</span>
        </div>
      </div>
    </footer>
  )
}

function FloatingActions() {
  return (
    <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col lg:flex">
      <Link
        to="/book"
        className="flex h-14 w-14 items-center justify-center bg-crimson text-xl text-white shadow-lg hover:bg-crimson-dark"
        aria-label="Order the book"
      >
        📖
      </Link>
      
        href="tel:+254722731328"
        className="flex h-14 w-14 items-center justify-center bg-navy text-xl text-white shadow-lg hover:bg-navy-light"
        aria-label="Call the campaign"
      >
        📞
      </a>
    </div>
  )
}

function Layout() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Nav />
      <Outlet />
      <Footer />
      <FloatingActions />
    </div>
  )
}

export default Layout
