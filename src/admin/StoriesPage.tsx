import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSiteData } from '../context/SiteDataContext'
import type { Story } from '../lib/types'
import { Field, ImageField, TextArea, TextInput } from './fields'

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function StoryForm({ story, onDone }: { story: Story; onDone: () => void }) {
  const { refetch } = useSiteData()
  const [data, setData] = useState<Story>(story)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof Story>(key: K, value: Story[K]) {
    setData((d) => ({ ...d, [key]: value }))
    setSaved(false)
  }
  function updateParagraph(idx: number, value: string) {
    const next = data.paragraphs.slice()
    next[idx] = value
    set('paragraphs', next)
  }
  function addParagraph() {
    set('paragraphs', [...data.paragraphs, ''])
  }
  function removeParagraph(idx: number) {
    set('paragraphs', data.paragraphs.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    if (!supabase) return
    setSaving(true)
    const { error } = await supabase.from('stories').upsert(data)
    if (error) {
      setSaving(false)
      alert(`Save failed: ${error.message}`)
      return
    }
    await refetch()
    setSaving(false)
    setSaved(true)
  }

  async function handleDelete() {
    if (!supabase) return
    if (!confirm(`Delete "${data.title}"? This can't be undone.`)) return
    await supabase.from('stories').delete().eq('id', data.id)
    await refetch()
    onDone()
  }

  return (
    <div className="rounded border border-hairline bg-white p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Title">
          <TextInput
            value={data.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </Field>
        <Field label="Tag (e.g. Book Launch)">
          <TextInput value={data.tag} onChange={(e) => set('tag', e.target.value)} />
        </Field>
        <Field label="Date label (e.g. Aug 7, 2026)">
          <TextInput value={data.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Sort order (lower shows first)">
          <TextInput
            type="number"
            value={data.sort_order}
            onChange={(e) => set('sort_order', Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Card image">
          <ImageField value={data.image_url || ''} onChange={(v) => set('image_url', v)} folder="stories" />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Summary (shown on card)">
          <TextArea value={data.summary} onChange={(e) => set('summary', e.target.value)} />
        </Field>
      </div>

      <div className="mt-3">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted">
          Full story paragraphs
        </span>
        <div className="mt-2 space-y-2">
          {data.paragraphs.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <TextArea value={p} onChange={(e) => updateParagraph(idx, e.target.value)} />
              <button type="button" onClick={() => removeParagraph(idx)} className="shrink-0 self-start px-2 text-xs text-crimson">
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addParagraph}
          className="mt-2 rounded border border-dashed border-hairline px-4 py-2 text-xs font-medium text-navy hover:border-crimson hover:text-crimson"
        >
          + Add paragraph
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Button label">
          <TextInput value={data.cta_label} onChange={(e) => set('cta_label', e.target.value)} />
        </Field>
        <Field label="Button link">
          <TextInput value={data.cta_href} onChange={(e) => set('cta_href', e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
        <button type="button" onClick={handleDelete} className="text-xs text-crimson hover:underline">
          Delete story
        </button>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !data.title.trim()}
            className="rounded-full bg-crimson px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save story'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StoriesPage() {
  const { stories } = useSiteData()
  const [openId, setOpenId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const blank: Story = {
    id: '',
    tag: '',
    title: '',
    date: '',
    summary: '',
    paragraphs: [''],
    cta_label: 'Get in Touch',
    cta_href: '/contact',
    image_url: '',
    sort_order: stories.length,
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy">Stories / News</h1>
          <p className="mt-1 text-sm text-muted">These appear on the homepage and footer, and get their own page.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-full bg-crimson px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark"
        >
          + New story
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {creating && <StoryForm story={{ ...blank }} onDone={() => setCreating(false)} />}
        {stories.map((s) =>
          openId === s.id ? (
            <StoryForm key={s.id} story={s} onDone={() => setOpenId(null)} />
          ) : (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenId(s.id)}
              className="flex w-full items-center justify-between rounded border border-hairline bg-white p-4 text-left hover:border-crimson"
            >
              <div>
                <p className="text-sm font-semibold text-navy">{s.title}</p>
                <p className="text-xs text-muted">
                  {s.tag} · {s.date}
                </p>
              </div>
              <span className="text-xs text-crimson">Edit →</span>
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default StoriesPage
