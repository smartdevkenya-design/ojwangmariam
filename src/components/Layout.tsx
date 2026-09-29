import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { usePageContent, useSiteData } from '../context/SiteDataContext'
import type { PartnersContent } from '../lib/types'

function TopBar() {
  const { settings } = useSiteData()
  return (
    <div className="hidden bg-navy-deep text-white/70 md:block">
      <div className="flex w-full items-center justify-between gap-4 px-6 py-2 text-xs">
        <p className="truncate">
          <span className="font-semibold uppercase tracking-wide text-crimson">Press:</span>{' '}
          {settings.press_banner_text}
        </p>
        <div className="flex shrink-0 items-center gap-5">
          <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-white">
            <span aria-hidden>📞</span> {settings.phone}
          </a>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-white">
            <span aria-hidden>✉️</span> {settings.email}
          </a>
        </div>
      </div>
    </div>
  )
}

function Logo() {
  const { settings } = useSiteData()
  if (settings.logo_image_url) {
    return (
      <Link to="/" className="flex shrink-0 items-center">
        <img src={settings.logo_image_url} alt={settings.logo_line1} fetchPriority="high" className="h-10 w-auto object-contain sm:h-12" />
      </Link>
    )
  }
  return (
    <Link to="/" className="flex shrink-0 flex-col items-start leading-none">
      <span className="border-2 border-crimson px-2.5 py-1 text-sm font-bold tracking-wide text-white sm:text-base">
        {settings.logo_line1}
      </span>
      <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-crimson">{settings.logo_line2}</span>
    </Link>
  )
}

function useNavLinks() {
  const { settings, customPages } = useSiteData()
  const extra = customPages
    .filter((p) => p.show_in_nav)
    .map((p) => ({ label: p.nav_label || p.title, to: `/${p.slug}` }))
  return [...settings.nav_links, ...extra]
}

function Nav() {
  const [open, setOpen] = useState(false)
  const navLinks = useNavLinks()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
      isActive ? 'bg-crimson text-white' : 'text-white/85 hover:bg-navy-light hover:text-white'
    }`

  return (
    <>
      <TopBar />
      <nav className="sticky top-0 z-50 bg-navy border-b border-navy-light">
        <div className="flex w-full items-center justify-between px-6 py-3">
          <Logo />
          <div className="hidden gap-2 md:flex">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/contact#donate"
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
              to="/contact#donate"
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

function PartnersStrip() {
  const content = usePageContent<PartnersContent>('partners')
  const partners = (content.partners ?? []).filter((p) => p.logo_url)
  if (partners.length === 0) return null

  return (
    <section className="border-t border-hairline bg-white">
      <div className="w-full px-6 py-12 sm:py-16">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-muted sm:text-base">
          {content.heading || 'Our Partners & Supporters'}
        </h2>
        <ul className="mt-10 flex flex-wrap items-start justify-center gap-x-12 gap-y-10 sm:gap-x-16">
          {partners.map((p, i) => {
            const card = (
              <div className="flex w-44 flex-col items-center text-center sm:w-56 lg:w-64">
                <img
                  src={p.logo_url}
                  alt={p.name}
                  title={p.name}
                  loading="eager"
                  decoding="async"
                  className="h-28 w-full object-contain sm:h-36 lg:h-44"
                />
                {p.name && (
                  <span className="mt-4 text-sm font-semibold uppercase tracking-wide text-navy sm:text-base">
                    {p.name}
                  </span>
                )}
              </div>
            )
            return (
              <li key={`${p.name}-${i}`} className="flex items-center">
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                    {card}
                  </a>
                ) : (
                  card
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Footer() {
  const { settings, stories } = useSiteData()
  const navLinks = useNavLinks()
  const latest = stories.slice(0, 4)

  return (
    <footer className="bg-navy-deep border-t border-navy-light">
      <div className="w-full px-6 py-10 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">About</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{settings.footer_about}</p>
            <ul className="mt-3 space-y-1 text-sm text-white/60">
              <li>{settings.address}</li>
              <li>
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-crimson">
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-crimson">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/60 hover:text-crimson">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Latest Highlights</h3>
            <ul className="mt-3 space-y-3">
              {latest.map((s) => (
                <li key={s.id}>
                  <Link to={`/stories/${s.id}`} className="text-left text-sm text-white/80 hover:text-crimson">
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
              {settings.footer_tags.map((tag) => (
                <span key={tag} className="rounded-full border border-navy-light px-3 py-1 text-xs text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-light">
        <div className="flex w-full flex-col items-start justify-between gap-2 px-6 py-4 text-xs text-white/50 sm:gap-4 sm:py-6 md:flex-row md:items-center">
          <span>{settings.footer_copyright}</span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span>{settings.footer_tagline}</span>
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
      <PartnersStrip />
      <Footer />
    </div>
  )
}

export default Layout
