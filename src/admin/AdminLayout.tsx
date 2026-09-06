import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/settings', label: 'Site Settings & Logo' },
  { to: '/admin/theme', label: 'Colors & Theme' },
  { to: '/admin/pages/home', label: 'Home Page' },
  { to: '/admin/pages/about', label: 'About Page' },
  { to: '/admin/pages/book', label: 'Book Page' },
  { to: '/admin/pages/manifesto', label: 'Manifesto Page' },
  { to: '/admin/pages/media', label: 'Media Page' },
  { to: '/admin/pages/gallery', label: 'Gallery Page (text)' },
  { to: '/admin/pages/volunteer', label: 'Volunteer Page' },
  { to: '/admin/pages/contact', label: 'Contact Page' },
  { to: '/admin/stories', label: 'Stories / News' },
  { to: '/admin/gallery-images', label: 'Gallery Photos' },
  { to: '/admin/custom-pages', label: 'Extra / Custom Pages' },
  { to: '/admin/messages', label: 'Messages & Signups' },
]

function AdminLayout() {
  const { signOut } = useAuth()
  return (
    <div className="flex min-h-screen bg-offwhite text-ink">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-deep text-white md:flex">
        <div className="border-b border-navy-light px-5 py-5">
          <p className="text-sm font-semibold uppercase tracking-wide">Admin</p>
          <p className="mt-0.5 text-xs text-white/50">Ojwang Mariam site</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${
                  isActive ? 'bg-crimson text-white' : 'text-white/75 hover:bg-navy-light hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-navy-light p-3">
          <NavLink to="/" className="block rounded px-3 py-2 text-xs text-white/60 hover:text-white">
            ← View live site
          </NavLink>
          <button
            onClick={() => signOut()}
            className="mt-1 w-full rounded px-3 py-2 text-left text-xs text-white/60 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-hairline bg-white px-5 py-3 md:hidden">
          <span className="text-sm font-semibold text-navy">Admin</span>
          <button onClick={() => signOut()} className="text-xs text-crimson">
            Sign out
          </button>
        </div>
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
