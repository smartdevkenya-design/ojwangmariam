import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  defaultContent,
  type SiteContent,
  type Story,
  type StoryInput,
  fetchAllStories,
  createStory,
  updateStory,
  deleteStory,
} from '../lib/content'
import { useAuth } from '../lib/auth'
import ImageUploader from '../components/ImageUploader'

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

// Sidebar sections mirror the live site's pages one-to-one, so "select a
// page, edit what's on it" maps directly onto the public nav.
type Section =
  | 'home'
  | 'about'
  | 'book'
  | 'manifesto'
  | 'media'
  | 'gallery'
  | 'stories'
  | 'signups'
  | 'messages'

const PAGE_SECTIONS: { id: Section; label: string; hint: string }[] = [
  { id: 'home', label: 'Home', hint: 'Hero banner' },
  { id: 'about', label: 'About', hint: 'Bio & cards' },
  { id: 'book', label: 'The Book', hint: 'Believe Become' },
  { id: 'manifesto', label: 'Manifesto', hint: 'Slogan & pillars' },
  { id: 'media', label: 'Media & News', hint: 'Impact items' },
  { id: 'gallery', label: 'Gallery', hint: 'Photos' },
  { id: 'stories', label: 'Stories', hint: 'Highlights & detail pages' },
]

const INBOX_SECTIONS: { id: Section; label: string }[] = [
  { id: 'signups', label: 'Signups' },
  { id: 'messages', label: 'Messages' },
]

function Admin() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('home')

  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [contentLoading, setContentLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const [signups, setSignups] = useState<Signup[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    supabase
      .from('site_content')
      .select('hero, bio, book, manifesto, media, gallery')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setContent({ ...defaultContent, ...(data as Partial<SiteContent>) })
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
        hero: content.hero,
        bio: content.bio,
        book: content.book,
        manifesto: content.manifesto,
        media: content.media,
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

  const isContentSection =
    section === 'home' ||
    section === 'about' ||
    section === 'book' ||
    section === 'manifesto' ||
    section === 'media' ||
    section === 'gallery'

  return (
    <section className="bg-offwhite min-h-[80vh]">
      <div className="mx-auto max-w-[1300px] px-6 py-10">
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

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sidebar nav — one entry per live page */}
          <nav className="space-y-6">
            <div>
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Site Pages
              </p>
              <ul className="mt-2 space-y-1">
                {PAGE_SECTIONS.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setSection(s.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        section === s.id
                          ? 'bg-navy text-white'
                          : 'bg-white text-navy border border-hairline hover:border-navy'
                      }`}
                    >
                      <span className="block font-medium">{s.label}</span>
                      <span
                        className={`block text-[11px] ${
                          section === s.id ? 'text-white/60' : 'text-muted'
                        }`}
                      >
                        {s.hint}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Inbox
              </p>
              <ul className="mt-2 space-y-1">
                {INBOX_SECTIONS.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setSection(s.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        section === s.id
                          ? 'bg-navy text-white'
                          : 'bg-white text-navy border border-hairline hover:border-navy'
                      }`}
                    >
                      {s.label}
                      {s.id === 'signups' && ` (${signups.length})`}
                      {s.id === 'messages' && ` (${messages.length})`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Editor panel */}
          <div>
            {contentLoading && isContentSection ? (
              <p className="text-muted">Loading…</p>
            ) : (
              <>
                {section === 'home' && <HomeEditor content={content} setContent={setContent} />}
                {section === 'about' && <AboutEditor content={content} setContent={setContent} />}
                {section === 'book' && <BookEditor content={content} setContent={setContent} />}
                {section === 'manifesto' && (
                  <ManifestoEditor content={content} setContent={setContent} />
                )}
                {section === 'media' && <MediaEditor content={content} setContent={setContent} />}
                {section === 'gallery' && (
                  <GalleryEditor content={content} setContent={setContent} />
                )}

                {isContentSection && (
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

                {section === 'stories' && <StoriesEditor />}
                {section === 'signups' && <SignupsTable rows={signups} />}
                {section === 'messages' && <MessagesTable rows={messages} />}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Shared field primitives ─────────────────────────────────────────

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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-hairline bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}

function RemoveButton({ onClick, label = 'Remove' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-crimson px-4 py-2 text-xs font-medium uppercase tracking-wide text-crimson hover:bg-crimson hover:text-white"
    >
      {label}
    </button>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 rounded-full border border-navy px-4 py-2 text-xs font-medium uppercase tracking-wide text-navy hover:bg-navy hover:text-white"
    >
      {label}
    </button>
  )
}

type ContentEditorProps = {
  content: SiteContent
  setContent: (c: SiteContent) => void
}

// ── Home ──────────────────────────────────────────────────────────────

function HomeEditor({ content, setContent }: ContentEditorProps) {
  const { hero } = content
  return (
    <Card title="Home — Hero Banner">
      <Field
        label="Eyebrow"
        value={hero.eyebrow}
        onChange={(v) => setContent({ ...content, hero: { ...hero, eyebrow: v } })}
      />
      <Field
        label="Headline"
        textarea
        value={hero.headline}
        onChange={(v) => setContent({ ...content, hero: { ...hero, headline: v } })}
      />
      <Field
        label="Subhead"
        textarea
        value={hero.subhead}
        onChange={(v) => setContent({ ...content, hero: { ...hero, subhead: v } })}
      />
      <ImageUploader
        label="Hero background image"
        value={hero.imageUrl}
        folder="hero"
        onChange={(v) => setContent({ ...content, hero: { ...hero, imageUrl: v } })}
      />
      <p className="text-xs text-muted">
        Campaign highlights shown below the hero are managed from the "Stories" tab.
      </p>
    </Card>
  )
}

// ── About ─────────────────────────────────────────────────────────────

function AboutEditor({ content, setContent }: ContentEditorProps) {
  const { bio } = content

  function updateCard(i: number, field: 'title' | 'body', value: string) {
    const cards = [...bio.cards]
    cards[i] = { ...cards[i], [field]: value }
    setContent({ ...content, bio: { ...bio, cards } })
  }
  function removeCard(i: number) {
    setContent({ ...content, bio: { ...bio, cards: bio.cards.filter((_, idx) => idx !== i) } })
  }
  function addCard() {
    setContent({ ...content, bio: { ...bio, cards: [...bio.cards, { title: '', body: '' }] } })
  }

  return (
    <Card title="About — Biography">
      <Field
        label="Eyebrow"
        value={bio.eyebrow}
        onChange={(v) => setContent({ ...content, bio: { ...bio, eyebrow: v } })}
      />
      <Field
        label="Heading"
        value={bio.heading}
        onChange={(v) => setContent({ ...content, bio: { ...bio, heading: v } })}
      />
      <Field
        label="Intro paragraph"
        textarea
        value={bio.intro}
        onChange={(v) => setContent({ ...content, bio: { ...bio, intro: v } })}
      />
      <ImageUploader
        label="About page image"
        value={bio.imageUrl}
        folder="bio"
        onChange={(v) => setContent({ ...content, bio: { ...bio, imageUrl: v } })}
      />

      <div className="space-y-4">
        {bio.cards.map((card, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border-t border-hairline pt-4 sm:grid-cols-2">
            <Field
              label={`Card ${i + 1} title`}
              value={card.title}
              onChange={(v) => updateCard(i, 'title', v)}
            />
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Field
                  label={`Card ${i + 1} body`}
                  textarea
                  value={card.body}
                  onChange={(v) => updateCard(i, 'body', v)}
                />
              </div>
              <RemoveButton onClick={() => removeCard(i)} />
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={addCard} label="+ Add Card" />
    </Card>
  )
}

// ── Book ──────────────────────────────────────────────────────────────

function BookEditor({ content, setContent }: ContentEditorProps) {
  const { book } = content
  return (
    <Card title="The Book — Believe Become">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Title"
          value={book.title}
          onChange={(v) => setContent({ ...content, book: { ...book, title: v } })}
        />
        <Field
          label="Subtitle"
          value={book.subtitle}
          onChange={(v) => setContent({ ...content, book: { ...book, subtitle: v } })}
        />
        <Field
          label="Standard price"
          value={book.priceStandard}
          onChange={(v) => setContent({ ...content, book: { ...book, priceStandard: v } })}
        />
        <Field
          label="Sponsor price"
          value={book.priceSponsor}
          onChange={(v) => setContent({ ...content, book: { ...book, priceSponsor: v } })}
        />
      </div>
      <Field
        label="Description"
        textarea
        value={book.description}
        onChange={(v) => setContent({ ...content, book: { ...book, description: v } })}
      />
      <Field
        label="Launch details"
        textarea
        value={book.launchDetails}
        onChange={(v) => setContent({ ...content, book: { ...book, launchDetails: v } })}
      />
      <ImageUploader
        label="Cover image"
        value={book.coverImageUrl}
        folder="book"
        onChange={(v) => setContent({ ...content, book: { ...book, coverImageUrl: v } })}
      />
    </Card>
  )
}

// ── Manifesto ─────────────────────────────────────────────────────────

function ManifestoEditor({ content, setContent }: ContentEditorProps) {
  const { manifesto } = content

  function updatePillar(i: number, field: 'title' | 'body', value: string) {
    const pillars = [...manifesto.pillars]
    pillars[i] = { ...pillars[i], [field]: value }
    setContent({ ...content, manifesto: { ...manifesto, pillars } })
  }
  function removePillar(i: number) {
    setContent({
      ...content,
      manifesto: { ...manifesto, pillars: manifesto.pillars.filter((_, idx) => idx !== i) },
    })
  }
  function addPillar() {
    setContent({
      ...content,
      manifesto: { ...manifesto, pillars: [...manifesto.pillars, { title: '', body: '' }] },
    })
  }

  return (
    <Card title="Manifesto">
      <Field
        label="Eyebrow"
        value={manifesto.eyebrow}
        onChange={(v) => setContent({ ...content, manifesto: { ...manifesto, eyebrow: v } })}
      />
      <Field
        label="Heading"
        value={manifesto.heading}
        onChange={(v) => setContent({ ...content, manifesto: { ...manifesto, heading: v } })}
      />
      <Field
        label="Subheading"
        textarea
        value={manifesto.subheading}
        onChange={(v) => setContent({ ...content, manifesto: { ...manifesto, subheading: v } })}
      />
      <Field
        label="Slogan"
        value={manifesto.slogan}
        onChange={(v) => setContent({ ...content, manifesto: { ...manifesto, slogan: v } })}
      />
      <Field
        label="Slogan note"
        textarea
        value={manifesto.sloganNote}
        onChange={(v) => setContent({ ...content, manifesto: { ...manifesto, sloganNote: v } })}
      />

      <div className="space-y-4">
        {manifesto.pillars.map((pillar, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border-t border-hairline pt-4 sm:grid-cols-2">
            <Field
              label={`Pillar ${i + 1} title`}
              value={pillar.title}
              onChange={(v) => updatePillar(i, 'title', v)}
            />
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Field
                  label={`Pillar ${i + 1} body`}
                  textarea
                  value={pillar.body}
                  onChange={(v) => updatePillar(i, 'body', v)}
                />
              </div>
              <RemoveButton onClick={() => removePillar(i)} />
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={addPillar} label="+ Add Pillar" />
    </Card>
  )
}

// ── Media ─────────────────────────────────────────────────────────────

function MediaEditor({ content, setContent }: ContentEditorProps) {
  const { media } = content

  function updateItem(i: number, field: 'title' | 'body' | 'imageUrl', value: string) {
    const items = [...media.items]
    items[i] = { ...items[i], [field]: value }
    setContent({ ...content, media: { ...media, items } })
  }
  function removeItem(i: number) {
    setContent({ ...content, media: { ...media, items: media.items.filter((_, idx) => idx !== i) } })
  }
  function addItem() {
    setContent({
      ...content,
      media: { ...media, items: [...media.items, { title: '', body: '', imageUrl: '' }] },
    })
  }

  return (
    <Card title="Media & News">
      <Field
        label="Eyebrow"
        value={media.eyebrow}
        onChange={(v) => setContent({ ...content, media: { ...media, eyebrow: v } })}
      />
      <Field
        label="Heading"
        value={media.heading}
        onChange={(v) => setContent({ ...content, media: { ...media, heading: v } })}
      />

      <div className="space-y-6">
        {media.items.map((item, i) => (
          <div key={i} className="space-y-3 border-t border-hairline pt-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label={`Item ${i + 1} title`}
                value={item.title}
                onChange={(v) => updateItem(i, 'title', v)}
              />
              <Field
                label={`Item ${i + 1} body`}
                textarea
                value={item.body}
                onChange={(v) => updateItem(i, 'body', v)}
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <ImageUploader
                  label="Image"
                  value={item.imageUrl}
                  folder="media"
                  onChange={(v) => updateItem(i, 'imageUrl', v)}
                />
              </div>
              <RemoveButton onClick={() => removeItem(i)} />
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={addItem} label="+ Add Item" />
    </Card>
  )
}

// ── Gallery ───────────────────────────────────────────────────────────

function GalleryEditor({ content, setContent }: ContentEditorProps) {
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
    <Card title="Gallery Photos">
      <p className="text-xs text-muted">Upload an image for each slot, or paste a URL directly.</p>
      <div className="space-y-4">
        {content.gallery.items.map((item, i) => (
          <div key={i} className="space-y-3 border-t border-hairline pt-4">
            <Field label="Caption" value={item.caption} onChange={(v) => updateItem(i, 'caption', v)} />
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <ImageUploader
                  label="Photo"
                  value={item.url}
                  folder="gallery"
                  onChange={(v) => updateItem(i, 'url', v)}
                />
              </div>
              <RemoveButton onClick={() => removeItem(i)} />
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={addItem} label="+ Add Photo" />
    </Card>
  )
}

// ── Stories (separate table — own load/save/delete lifecycle) ──────────

const BLANK_STORY: StoryInput = {
  slug: '',
  tag: '',
  title: '',
  date: '',
  summary: '',
  paragraphs: [''],
  ctaLabel: 'Get in Touch',
  ctaHref: '/contact',
  imageUrl: '',
  sortOrder: 0,
}

function StoriesEditor() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, StoryInput>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [statusById, setStatusById] = useState<Record<string, string>>({})
  const [newStoryDraft, setNewStoryDraft] = useState<StoryInput | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const rows = await fetchAllStories()
      setStories(rows)
      const nextDrafts: Record<string, StoryInput> = {}
      for (const s of rows) {
        const { id, ...rest } = s
        nextDrafts[id] = rest
      }
      setDrafts(nextDrafts)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function updateDraft(id: string, patch: Partial<StoryInput>) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }))
  }

  async function handleSave(id: string) {
    setSavingId(id)
    setStatusById((s) => ({ ...s, [id]: '' }))
    try {
      await updateStory(id, drafts[id])
      setStatusById((s) => ({ ...s, [id]: 'Saved.' }))
      const rows = await fetchAllStories()
      setStories(rows)
    } catch (e) {
      setStatusById((s) => ({
        ...s,
        [id]: e instanceof Error ? `Error: ${e.message}` : 'Save failed',
      }))
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title || 'this story'}"? This can't be undone.`)) return
    setSavingId(id)
    try {
      await deleteStory(id)
      await load()
    } catch (e) {
      setStatusById((s) => ({
        ...s,
        [id]: e instanceof Error ? `Error: ${e.message}` : 'Delete failed',
      }))
    } finally {
      setSavingId(null)
    }
  }

  async function handleCreate() {
    if (!newStoryDraft) return
    setSavingId('new')
    try {
      await createStory({ ...newStoryDraft, sortOrder: stories.length + 1 })
      setNewStoryDraft(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create story')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>

  return (
    <div className="space-y-6">
      <div className="rounded border border-hairline bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">
          Stories
        </h2>
        <p className="mt-1 text-xs text-muted">
          These power the "Latest Campaign Highlights" on Home and each story's own detail page.
          Each saves independently.
        </p>
        {error && <p className="mt-3 text-sm text-crimson">{error}</p>}
      </div>

      {stories.map((s) => {
        const draft = drafts[s.id] ?? BLANK_STORY
        return (
          <div key={s.id} className="rounded border border-hairline bg-white p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Title" value={draft.title} onChange={(v) => updateDraft(s.id, { title: v })} />
              <Field
                label="Slug (used in the URL)"
                value={draft.slug}
                onChange={(v) => updateDraft(s.id, { slug: v })}
              />
              <Field label="Tag" value={draft.tag} onChange={(v) => updateDraft(s.id, { tag: v })} />
              <Field label="Date label" value={draft.date} onChange={(v) => updateDraft(s.id, { date: v })} />
            </div>
            <div className="mt-3">
              <Field
                label="Summary"
                textarea
                value={draft.summary}
                onChange={(v) => updateDraft(s.id, { summary: v })}
              />
            </div>
            <div className="mt-3">
              <Field
                label="Paragraphs (one per line)"
                textarea
                value={draft.paragraphs.join('\n')}
                onChange={(v) => updateDraft(s.id, { paragraphs: v.split('\n') })}
              />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="CTA label"
                value={draft.ctaLabel}
                onChange={(v) => updateDraft(s.id, { ctaLabel: v })}
              />
              <Field
                label="CTA link"
                value={draft.ctaHref}
                onChange={(v) => updateDraft(s.id, { ctaHref: v })}
              />
            </div>
            <div className="mt-3">
              <ImageUploader
                label="Image"
                value={draft.imageUrl}
                folder="stories"
                onChange={(v) => updateDraft(s.id, { imageUrl: v })}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleSave(s.id)}
                disabled={savingId === s.id}
                className="rounded-full bg-crimson px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
              >
                {savingId === s.id ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => handleDelete(s.id, draft.title)}
                disabled={savingId === s.id}
                className="rounded-full border border-crimson px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-crimson hover:bg-crimson hover:text-white disabled:opacity-60"
              >
                Delete
              </button>
              {statusById[s.id] && <p className="text-sm text-navy">{statusById[s.id]}</p>}
            </div>
          </div>
        )
      })}

      {newStoryDraft ? (
        <div className="rounded border border-dashed border-navy bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-navy">New Story</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Title"
              value={newStoryDraft.title}
              onChange={(v) => setNewStoryDraft({ ...newStoryDraft, title: v })}
            />
            <Field
              label="Slug (used in the URL)"
              value={newStoryDraft.slug}
              onChange={(v) => setNewStoryDraft({ ...newStoryDraft, slug: v })}
            />
            <Field
              label="Tag"
              value={newStoryDraft.tag}
              onChange={(v) => setNewStoryDraft({ ...newStoryDraft, tag: v })}
            />
            <Field
              label="Date label"
              value={newStoryDraft.date}
              onChange={(v) => setNewStoryDraft({ ...newStoryDraft, date: v })}
            />
          </div>
          <div className="mt-3">
            <Field
              label="Summary"
              textarea
              value={newStoryDraft.summary}
              onChange={(v) => setNewStoryDraft({ ...newStoryDraft, summary: v })}
            />
          </div>
          <div className="mt-3">
            <Field
              label="Paragraphs (one per line)"
              textarea
              value={newStoryDraft.paragraphs.join('\n')}
              onChange={(v) => setNewStoryDraft({ ...newStoryDraft, paragraphs: v.split('\n') })}
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleCreate}
              disabled={savingId === 'new'}
              className="rounded-full bg-crimson px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
            >
              {savingId === 'new' ? 'Creating…' : 'Create Story'}
            </button>
            <button
              onClick={() => setNewStoryDraft(null)}
              className="text-sm font-medium uppercase tracking-wide text-muted hover:text-navy"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <AddButton onClick={() => setNewStoryDraft(BLANK_STORY)} label="+ Add Story" />
      )}
    </div>
  )
}

// ── Inbox tables ─────────────────────────────────────────────────────

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
