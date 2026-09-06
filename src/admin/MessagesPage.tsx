import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface ContactMessage {
  id: string
  source: 'join_bar' | 'contact'
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  created_at: string
}

const SOURCE_LABEL: Record<string, string> = {
  join_bar: 'Join Now (Home)',
  contact: 'Contact Page',
}

function MessagesPage() {
  const [rows, setRows] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'join_bar' | 'contact'>('all')

  async function load() {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      alert(`Failed to load messages: ${error.message}`)
    } else {
      setRows((data as ContactMessage[]) || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function markRead(id: string, read: boolean) {
    if (!supabase) return
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, read } : r)))
    const { error } = await supabase.from('contact_messages').update({ read }).eq('id', id)
    if (error) alert(`Update failed: ${error.message}`)
  }

  async function remove(id: string) {
    if (!supabase) return
    if (!confirm('Delete this message?')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) {
      alert(`Delete failed: ${error.message}`)
      return
    }
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const visible = rows.filter((r) => filter === 'all' || r.source === filter)
  const unreadCount = rows.filter((r) => !r.read).length

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">Messages & Signups</h1>
      <p className="mt-1 text-sm text-muted">
        Everyone who submitted the "Join Now" bar on the Home page or the Contact page form.
        {unreadCount > 0 && <span className="ml-2 font-semibold text-crimson">{unreadCount} unread</span>}
      </p>

      <div className="mt-4 flex gap-2">
        {(['all', 'join_bar', 'contact'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              filter === f ? 'bg-crimson text-white' : 'border border-hairline text-navy hover:border-crimson'
            }`}
          >
            {f === 'all' ? 'All' : SOURCE_LABEL[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {visible.map((r) => (
            <div
              key={r.id}
              className={`rounded border p-4 ${
                r.read ? 'border-hairline bg-white' : 'border-crimson/40 bg-crimson/5'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-navy">{r.name || '(no name)'}</p>
                  <p className="text-xs text-muted">
                    {SOURCE_LABEL[r.source] || r.source} · {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => markRead(r.id, !r.read)}
                    className="text-navy hover:text-crimson"
                  >
                    {r.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button type="button" onClick={() => remove(r.id)} className="text-crimson">
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-0.5 text-sm text-ink">
                {r.email && (
                  <p>
                    <a href={`mailto:${r.email}`} className="text-navy hover:text-crimson">
                      {r.email}
                    </a>
                  </p>
                )}
                {r.phone && (
                  <p>
                    <a href={`tel:${r.phone}`} className="text-navy hover:text-crimson">
                      {r.phone}
                    </a>
                  </p>
                )}
              </div>
              {r.message && <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{r.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessagesPage
