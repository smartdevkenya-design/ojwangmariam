import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { stories } from '../data/stories'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/book', label: 'The Book' },
  { to: '/manifesto', label: 'Manifesto' },
  { to: '/media', label: 'Media & News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

function Nav() {
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
      isActive ? 'bg-crimson text-white' : 'text-white/85 hover:bg-navy-light hover:text-white'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-navy-light">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Link to="/" className="text-white font-medium tracking-tight">
          OJWANG MARIAM <span className="text-white/60 font-normal">| Tuko Kadi</span>
        </Link>
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
  )
}

function Footer() {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/book', label: 'The Book' },
    { to: '/manifesto', label: 'Manifesto' },
    { to: '/media', label: 'Media & News' },
    { to: '/gallery', label: 'Gallery' },
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
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">About</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Ojwang Mariam — award-winning multimedia journalist, founder
              and CEO of Wueeh TV Kenya, and 2027 MCA candidate for Kahawa
              West Ward. Siasa Safi, Maisha Bora.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-white/60">
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
            <ul className="mt-4 space-y-2 text-sm">
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
            <ul className="mt-4 space-y-4">
              {stories.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/stories/${s.id}`}
                    className="text-left text-sm text-white/80 hover:text-crimson"
                  >
                    {s.title}
                  </Link>
                  <p className="mt-1 text-xs text-white/40">{s.date}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Tags</h3>
            <div className="mt-4 flex flex-wrap gap-2">
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
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 py-6 text-xs text-white/50 md:flex-row md:items-center">
          <span>© 2026 Ojwang Mariam. Kahawa West 2027.</span>
          <span className="flex items-center gap-4">
            <span>Siasa Safi, Maisha Bora.</span>
            <Link to="/admin/login" className="hover:text-white/80">
              Admin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

function Layout() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
