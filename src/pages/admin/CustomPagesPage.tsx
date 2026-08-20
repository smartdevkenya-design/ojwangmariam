import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSiteData } from '../context/SiteDataContext'
import type { CustomPage, SectionBlock } from '../lib/types'
import { Field, ImageField, TextArea, TextInput } from './fields'

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function blankBlock(type: SectionBlock['type']): SectionBlock {
  if (type === 'heading') return { type: 'heading', text: '' }
  if (type === 'text') return { type: 'text', text: '' }
  if (type === 'image') return { type: 'image', url: '', alt: '' }
  return { type: 'cta', label: '', href: '' }
}

function BlockEditor({
  block,
  onChange,
  onRemove,
}: {
  block: SectionBlock
  onChange: (b: SectionBlock) => void
  onRemove: () => void
}) {
  return (
    <div className="rounded border border-hairline bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{block.type}</span>
        <button type="button" onClick={onRemove} className="text-xs text-crimson">
          Remove
        </button>
      </div>
      {block.type === 'heading' && (
        <TextInput
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Heading text"
        />
      )}
      {block.type === 'text' && (
        <TextArea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Paragraph text"
        />
      )}
      {block.type === 'image' && (
        <ImageField value={block.url} onChange={(url) => onChange({ ...block, url })} folder="custom-pages" />
      )}
      {block.type === 'cta' && (
        <div className="flex gap-2">
          <TextInput
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Button label"
          />
          <TextInput
            value={block.href}
            onChange={(e) => onChange({ ...block, href: e.target.value })}
            placeholder="Link (https:// or /path)"
          />
        </div>
      )}
    </div>
  )
}

function CustomPageForm({ page, onDone }: { page: CustomPage; onDone: () => void }) {
  const { refetch } = useSiteData()
  const [data, setData] = useState<CustomPage>(page)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof CustomPage>(key: K, value: CustomPage[K]) {
    setData((d) => ({ ...d, [key]: value }))
    setSaved(false)
  }

  function updateBlock(idx: number, block: SectionBlock) {
    const next = data.sections.slice()
    next[idx] = block
    set('sections', next)
  }
  function addBlock(type: SectionBlock['type']) {
    set('sections', [...data.sections, blankBlock(type)])
  }
  function removeBlock(idx: number) {
    set('sections', data.sections.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    if (!supabase || !data.slug.trim() || !data.title.trim()) return
    setSaving(true)
    await supabase.from('custom_pages').upsert({ ...data, updated_at: new Date().toISOString() })
    await refetch()
    setSaving(false)
    setSaved(true)
  }

  async function handleDelete() {
    if (!supabase) return
    if (!confirm(`Delete page "${data.title}"?`)) return
    await supabase.from('custom_pages').delete().eq('id', data.id)
    await refetch()
    onDone()
  }

  return (
    <div className="rounded border border-hairline bg-white p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Page title">
          <TextInput
            value={data.title}
            onChange={(e) => {
              const title = e.target.value
              set('title', title)
              if (!page.title) set('slug', slugify(title))
            }}
          />
        </Field>
        <Field label="URL slug (e.g. events)">
          <TextInput value={data.slug} onChange={(e) => set('slug', slugify(e.target.value))} />
        </Field>
        <Field label="Nav label (leave blank to use title)">
          <TextInput value={data.nav_label} onChange={(e) => set('nav_label', e.target.value)} />
        </Field>
        <Field label="Show in main navigation?">
          <select
            value={data.show_in_nav ? 'yes' : 'no'}
            onChange={(e) => set('show_in_nav', e.target.value === 'yes')}
            className="w-full rounded border border-hairline px-3 py-2 text-sm outline-none focus:border-crimson bg-white"
          >
            <option value="yes">Yes</option>
            <option value="no">No — link elsewhere only</option>
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted">Page content</span>
        <div className="mt-2 space-y-2">
          {data.sections.map((block, idx) => (
            <BlockEditor
              key={idx}
              block={block}
              onChange={(b) => updateBlock(idx, b)}
              onRemove={() => removeBlock(idx)}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => addBlock('heading')} className="rounded border border-dashed border-hairline px-3 py-1.5 text-xs text-navy hover:border-crimson hover:text-crimson">
            + Heading
          </button>
          <button type="button" onClick={() => addBlock('text')} className="rounded border border-dashed border-hairline px-3 py-1.5 text-xs text-navy hover:border-crimson hover:text-crimson">
            + Text
          </button>
          <button type="button" onClick={() => addBlock('image')} className="rounded border border-dashed border-hairline px-3 py-1.5 text-xs text-navy hover:border-crimson hover:text-crimson">
            + Image
          </button>
          <button type="button" onClick={() => addBlock('cta')} className="rounded border border-dashed border-hairline px-3 py-1.5 text-xs text-navy hover:border-crimson hover:text-crimson">
            + Button
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
        <button type="button" onClick={handleDelete} className="text-xs text-crimson hover:underline">
          Delete page
        </button>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !data.title.trim() || !data.slug.trim()}
            className="rounded-full bg-crimson px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save page'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CustomPagesPage() {
  const { customPages } = useSiteData()
  const [openId, setOpenId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const blank: CustomPage = {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    nav_label: '',
    show_in_nav: true,
    sort_order: customPages.length,
    sections: [{ type: 'text', text: '' }],
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy">Extra / Custom Pages</h1>
          <p className="mt-1 text-sm text-muted">
            Add brand-new pages beyond the built-in ones — they'll be live at yoursite.com/your-slug.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="shrink-0 rounded-full bg-crimson px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark"
        >
          + New page
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {creating && <CustomPageForm page={blank} onDone={() => setCreating(false)} />}
        {customPages.map((p) =>
          openId === p.id ? (
            <CustomPageForm key={p.id} page={p} onDone={() => setOpenId(null)} />
          ) : (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpenId(p.id)}
              className="flex w-full items-center justify-between rounded border border-hairline bg-white p-4 text-left hover:border-crimson"
            >
              <div>
                <p className="text-sm font-semibold text-navy">{p.title}</p>
                <p className="text-xs text-muted">/{p.slug}</p>
              </div>
              <span className="text-xs text-crimson">Edit →</span>
            </button>
          )
        )}
        {customPages.length === 0 && !creating && (
          <p className="text-sm text-muted">No extra pages yet. Click "New page" to add one.</p>
        )}
      </div>
    </div>
  )
}

export default CustomPagesPage
