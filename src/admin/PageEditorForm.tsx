import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PAGE_DEFAULTS, useSiteData } from '../context/SiteDataContext'
import { PAGE_SCHEMAS, PAGE_TITLES, type ArrayField, type FieldSchema, type SimpleField } from './schema'
import { Field, ImageField, SaveBar, TextArea, TextInput } from './fields'

function SimpleFieldInput({
  field,
  value,
  onChange,
}: {
  field: SimpleField
  value: string
  onChange: (v: string) => void
}) {
  if (field.kind === 'textarea') return <TextArea value={value} onChange={(e) => onChange(e.target.value)} />
  if (field.kind === 'image') return <ImageField value={value} onChange={onChange} folder="pages" />
  return <TextInput value={value} onChange={(e) => onChange(e.target.value)} />
}

function ArrayFieldEditor({
  field,
  items,
  onChange,
}: {
  field: ArrayField
  items: Record<string, string>[]
  onChange: (items: Record<string, string>[]) => void
}) {
  function updateItem(idx: number, key: string, value: string) {
    const next = items.slice()
    next[idx] = { ...next[idx], [key]: value }
    onChange(next)
  }
  function addItem() {
    const blank: Record<string, string> = {}
    field.itemFields.forEach((f) => (blank[f.key] = ''))
    onChange([...items, blank])
  }
  function removeItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx))
  }
  function moveItem(idx: number, dir: -1 | 1) {
    const next = items.slice()
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
  }

  return (
    <div>
      <span className="block text-xs font-medium uppercase tracking-wide text-muted">{field.label}</span>
      <div className="mt-2 space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded border border-hairline bg-offwhite p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-navy">
                {field.itemName} {idx + 1}
              </span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(idx, -1)} className="px-2 text-xs text-muted hover:text-navy">
                  ↑
                </button>
                <button type="button" onClick={() => moveItem(idx, 1)} className="px-2 text-xs text-muted hover:text-navy">
                  ↓
                </button>
                <button type="button" onClick={() => removeItem(idx)} className="px-2 text-xs text-crimson">
                  Remove
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {field.itemFields.map((f) => (
                <Field key={f.key} label={f.label}>
                  <SimpleFieldInput field={f} value={item[f.key] ?? ''} onChange={(v) => updateItem(idx, f.key, v)} />
                </Field>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 rounded border border-dashed border-hairline px-4 py-2 text-xs font-medium text-navy hover:border-crimson hover:text-crimson"
      >
        + Add {field.itemName}
      </button>
    </div>
  )
}

function PageEditorForm({ page }: { page: string }) {
  const schema = PAGE_SCHEMAS[page]
  const defaults = PAGE_DEFAULTS[page] as Record<string, unknown>
  const { pageContent, refetch, loading } = useSiteData()
  const [data, setData] = useState<Record<string, unknown>>({ ...defaults, ...(pageContent[page] as object) })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // On mount / refresh, the real content hasn't arrived from Supabase yet,
  // so this initializes with defaults only. Re-sync once `loading` flips to
  // false so the form shows your actual saved content instead of getting
  // stuck on the mock/default text.
  useEffect(() => {
    if (loading) return
    setData({ ...defaults, ...(pageContent[page] as object) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading])

  function set(key: string, value: unknown) {
    setData((d) => ({ ...d, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    if (!supabase) return
    setSaving(true)
    const { error } = await supabase
      .from('page_content')
      .upsert({ page, data, updated_at: new Date().toISOString() })
    if (error) {
      setSaving(false)
      alert(`Save failed: ${error.message}`)
      return
    }
    await refetch()
    setSaving(false)
    setSaved(true)
  }

  // Don't render the form (with its defaults-only initial state) until the
  // real content has actually loaded from Supabase — otherwise there's a
  // moment where the mock/default text is visible and editable, which looks
  // like your saved edits reverted.
  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-navy">{PAGE_TITLES[page]}</h1>
        <p className="mt-6 text-sm text-muted">Loading your saved content…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">{PAGE_TITLES[page]}</h1>
      <p className="mt-1 text-sm text-muted">Edit the text and images shown on this page. Changes go live once saved.</p>

      <div className="mt-6 space-y-6">
        {schema.map((field: FieldSchema) =>
          field.kind === 'array' ? (
            <ArrayFieldEditor
              key={field.key}
              field={field}
              items={(data[field.key] as Record<string, string>[]) || []}
              onChange={(items) => set(field.key, items)}
            />
          ) : (
            <Field key={field.key} label={field.label}>
              <SimpleFieldInput
                field={field}
                value={(data[field.key] as string) || ''}
                onChange={(v) => set(field.key, v)}
              />
            </Field>
          )
        )}
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

export function PageEditorRoute() {
  const { page } = useParams<{ page: string }>()
  if (!page || !PAGE_SCHEMAS[page]) return <p className="text-sm text-crimson">Unknown page.</p>
  return <PageEditorForm page={page} />
}
