import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import { supabase, supabaseConfigured } from '../lib/supabase'

const cards = [
  { to: '/admin/settings', title: 'Site Settings & Logo', body: 'Logo, nav menu, contact details, footer, M-Pesa info.' },
  { to: '/admin/theme', title: 'Colors & Theme', body: 'Change the site-wide brand colors.' },
  { to: '/admin/pages/home', title: 'Home Page', body: 'Hero, ribbon, highlights, issues panel.' },
  { to: '/admin/stories', title: 'Stories / News', body: 'Add, edit, or remove campaign highlight stories.' },
  { to: '/admin/gallery-images', title: 'Gallery Photos', body: 'Manage the photo gallery.' },
  { to: '/admin/custom-pages', title: 'Extra / Custom Pages', body: 'Create brand-new pages beyond the defaults.' },
  { to: '/admin/messages', title: 'Messages & Signups', body: 'Everyone who joined or sent a message from the site.' },
]

function Overview() {
  const { stories, galleryImages, customPages } = useSiteData()
  const [messageCount, setMessageCount] = useState<number | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setMessageCount(count ?? 0))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Everything on the site — text, images, logo, colors, and pages — is editable from here.</p>

      {!supabaseConfigured && (
        <p className="mt-4 rounded border border-crimson/30 bg-crimson/5 p-3 text-sm text-crimson">
          Supabase isn't configured. See ADMIN_SETUP.md for how to connect a database so edits can be saved.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
        <div className="rounded border border-hairline bg-white p-4">
          <p className="text-2xl font-semibold text-navy">{stories.length}</p>
          <p className="text-xs text-muted">Stories</p>
        </div>
        <div className="rounded border border-hairline bg-white p-4">
          <p className="text-2xl font-semibold text-navy">{galleryImages.length}</p>
          <p className="text-xs text-muted">Gallery photos</p>
        </div>
        <div className="rounded border border-hairline bg-white p-4">
          <p className="text-2xl font-semibold text-navy">{customPages.length}</p>
          <p className="text-xs text-muted">Extra pages</p>
        </div>
        <Link to="/admin/messages" className="rounded border border-hairline bg-white p-4 hover:border-crimson">
          <p className="text-2xl font-semibold text-navy">{messageCount ?? '–'}</p>
          <p className="text-xs text-muted">Messages & signups</p>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="rounded border border-hairline bg-white p-5 hover:border-crimson">
            <h3 className="text-sm font-semibold text-navy">{c.title}</h3>
            <p className="mt-1 text-xs text-muted">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Overview
