import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { defaultContent, type SiteContent } from '../lib/content'
import { useAuth } from '../lib/auth'

interface Signup {
  id: string
  name: string | null
  email: string
  created_at: string
}

interface Message {
  id: string
  name: string | null
  email: string | null
  message: string
  created_at: string
}

type Tab = 'content' | 'gallery' | 'signups' | 'messages'

function Admin() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('content')

  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [contentLoading, setContentLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const [signups, setSignups] = useState<Signup[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    supabase
      .from('site_content')
      .select('bio, book, manifesto, gallery')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setContent(data as SiteContent)
        setContentLoading(false)
      })

    supabase
      .from('signups')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setSignups(data as Signup[]))

    supabase
      .from('messages')
      .select('id, name, email, message, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setMessages(data as Message[]))
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaveMessage(null)
    const { error } = await supabase
      .from('site_content')
      .update({
        bio: content.bio,
        book: content.book,
        manifesto: content.manifesto,
        gallery: content.gallery,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
    setSaving(false)
    setSaveMessage(error ? `Error: ${error.message}` : 'Saved — live site updated.')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'content', label: 'Site Content' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'signups', label: `Signups (${signups.length})` },
    { id: 'messages', label: `Messages (${messages.length})` },
  ]

  return (
    <section className="bg-offwhite min-h-[80vh]">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">Admin</p>
            <h1 className="mt-1 text-2xl font-medium text-navy">Campaign Dashboard</h1>
            <p className="mt-1 text-sm text-muted">Signed in as {session?.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-navy px-4 py-2 text-sm font-medium text-navy hover:bg-navy hover:text-white"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-hairline pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                tab === t.id ? 'bg-navy text-white' : 'bg-white text-navy border border-hairline'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {contentLoading && tab !== 'signups' && tab !== 'messages' ? (
            <p className="text-muted">Loading…</p>
          ) : null}

          {tab === 'content' && !contentLoading && (
            <ContentEditor content={content} setContent={setContent} />
          )}

          {tab === 'gallery' && !contentLoading && (
            <GalleryEditor content={content} setContent={setContent} />
          )}

          {(tab === 'content' || tab === 'gallery') && (
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {saveMessage && <p className="text-sm text-navy">{saveMessage}</p>}
            </div>
          )}

          {tab === 'signups' && <SignupsTable rows={signups} />}
          {tab === 'messages' && <MessagesTable rows={messages} />}
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  const cls =
    'mt-1 w-full rounded border border-hairline px-3 py-2 text-sm text-ink outline-none focus:border-crimson'
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  )
}

function ContentEditor({
  content,
  setContent,
}: {
  content: SiteContent
  setContent: (c: SiteContent) => void
}) {
  return (
    <div className="space-y-10">
      <div className="rounded border border-hairline bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">
          Biography
        </h2>
        <div className="mt-4 space-y-4">
          <Field
            label="Intro paragraph"
            textarea
            value={content.bio.intro}
            onChange={(v) => setContent({ ...content, bio: { ...content.bio, intro: v } })}
          />
          {content.bio.cards.map((card, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 border-t border-hairline pt-4 sm:grid-cols-2">
              <Field
                label={`Card ${i + 1} title`}
                value={card.title}
                onChange={(v) => {
                  const cards = [...content.bio.cards]
                  cards[i] = { ...cards[i], title: v }
                  setContent({ ...content, bio: { ...content.bio, cards } })
                }}
              />
              <Field
                label={`Card ${i + 1} body`}
                textarea
                value={card.body}
                onChange={(v) => {
                  const cards = [...content.bio.cards]
                  cards[i] = { ...cards[i], body: v }
                  setContent({ ...content, bio: { ...content.bio, cards } })
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border border-hairline bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">The Book</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Title"
            value={content.book.title}
            onChange={(v) => setContent({ ...content, book: { ...content.book, title: v } })}
          />
          <Field
            label="Subtitle"
            value={content.book.subtitle}
            onChange={(v) => setContent({ ...content, book: { ...content.book, subtitle: v } })}
          />
          <Field
            label="Standard price"
            value={content.book.priceStandard}
            onChange={(v) =>
              setContent({ ...content, book: { ...content.book, priceStandard: v } })
            }
          />
          <Field
            label="Sponsor price"
            value={content.book.priceSponsor}
            onChange={(v) =>
              setContent({ ...content, book: { ...content.book, priceSponsor: v } })
            }
          />
        </div>
        <div className="mt-4 space-y-4">
          <Field
            label="Description"
            textarea
            value={content.book.description}
            onChange={(v) => setContent({ ...content, book: { ...content.book, description: v } })}
          />
          <Field
            label="Launch details"
            textarea
            value={content.book.launchDetails}
            onChange={(v) =>
              setContent({ ...content, book: { ...content.book, launchDetails: v } })
            }
          />
        </div>
      </div>

      <div className="rounded border border-hairline bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Manifesto</h2>
        <div className="mt-4 space-y-4">
          <Field
            label="Slogan"
            value={content.manifesto.slogan}
            onChange={(v) =>
              setContent({ ...content, manifesto: { ...content.manifesto, slogan: v } })
            }
          />
          <Field
            label="Slogan note"
            textarea
            value={content.manifesto.sloganNote}
            onChange={(v) =>
              setContent({ ...content, manifesto: { ...content.manifesto, sloganNote: v } })
            }
          />
          {content.manifesto.pillars.map((pillar, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 border-t border-hairline pt-4 sm:grid-cols-2">
              <Field
                label={`Pillar ${i + 1} title`}
                value={pillar.title}
                onChange={(v) => {
                  const pillars = [...content.manifesto.pillars]
                  pillars[i] = { ...pillars[i], title: v }
                  setContent({ ...content, manifesto: { ...content.manifesto, pillars } })
                }}
              />
              <Field
                label={`Pillar ${i + 1} body`}
                textarea
                value={pillar.body}
                onChange={(v) => {
                  const pillars = [...content.manifesto.pillars]
                  pillars[i] = { ...pillars[i], body: v }
                  setContent({ ...content, manifesto: { ...content.manifesto, pillars } })
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GalleryEditor({
  content,
  setContent,
}: {
  content: SiteContent
  setContent: (c: SiteContent) => void
}) {
  function updateItem(i: number, field: 'caption' | 'url', value: string) {
    const items = [...content.gallery.items]
    items[i] = { ...items[i], [field]: value }
    setContent({ ...content, gallery: { items } })
  }
  function removeItem(i: number) {
    const items = content.gallery.items.filter((_, idx) => idx !== i)
    setContent({ ...content, gallery: { items } })
  }
  function addItem() {
    setContent({
      ...content,
      gallery: { items: [...content.gallery.items, { caption: '', url: '' }] },
    })
  }

  return (
    <div className="rounded border border-hairline bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">
        Gallery Photos
      </h2>
      <p className="mt-1 text-xs text-muted">
        Paste an image URL for each slot. Leave blank to keep the placeholder box.
      </p>
      <div className="mt-4 space-y-4">
        {content.gallery.items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-3 border-t border-hairline pt-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end"
          >
            <Field label="Caption" value={item.caption} onChange={(v) => updateItem(i, 'caption', v)} />
            <Field label="Image URL" value={item.url} onChange={(v) => updateItem(i, 'url', v)} />
            <button
              onClick={() => removeItem(i)}
              className="rounded-full border border-crimson px-4 py-2 text-xs font-medium uppercase tracking-wide text-crimson hover:bg-crimson hover:text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-6 rounded-full border border-navy px-4 py-2 text-xs font-medium uppercase tracking-wide text-navy hover:bg-navy hover:text-white"
      >
        + Add Photo
      </button>
    </div>
  )
}

function SignupsTable({ rows }: { rows: Signup[] }) {
  if (rows.length === 0) {
    return <p className="text-muted">No signups yet.</p>
  }
  return (
    <div className="overflow-x-auto rounded border border-hairline bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-offwhite text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3">{r.name || '—'}</td>
              <td className="px-4 py-3">{r.email}</td>
              <td className="px-4 py-3 text-muted">
                {new Date(r.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MessagesTable({ rows }: { rows: Message[] }) {
  if (rows.length === 0) {
    return <p className="text-muted">No messages yet.</p>
  }
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.id} className="rounded border border-hairline bg-white p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              {r.name || 'Anonymous'} {r.email ? `· ${r.email}` : ''}
            </span>
            <span>{new Date(r.created_at).toLocaleString()}</span>
          </div>
          <p className="mt-2 text-sm text-ink">{r.message}</p>
        </div>
      ))}
    </div>
  )
}

export default Admin
