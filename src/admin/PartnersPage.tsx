import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PAGE_DEFAULTS, useSiteData } from '../context/SiteDataContext'
import type { Partner, PartnersContent } from '../lib/types'
import { Field, ImageField, TextInput } from './fields'

const btn = 'rounded px-3 py-1.5 text-xs font-medium transition disabled:opacity-50'
const btnPrimary = `${btn} bg-crimson text-white hover:bg-crimson-dark`
const btnOutline = `${btn} border border-hairline bg-white text-navy hover:border-crimson hover:text-crimson`
const btnDanger = `${btn} border border-hairline bg-white text-crimson hover:border-crimson`

function PartnersPage() {
  const { pageContent, refetch, loading } = useSiteData()
  const defaults = PAGE_DEFAULTS.partners as unknown as PartnersContent

  const [heading, setHeading] = useState('Our Partners & Supporters')
  const [partners, setPartners] = useState<Partner[]>([])
  const [newPartner, setNewPartner] = useState<Partner>({ name: '', logo_url: '', link: '' })
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    if (loading) return
    const saved = { ...defaults, ...((pageContent.partners as object) ?? {}) } as PartnersContent
    setHeading(saved.heading || 'Our Partners & Supporters')
    setPartners(saved.partners ?? [])
    setDirty(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  async function persist(nextHeading: string, nextPartners: Partner[], okText: string) {
    if (!supabase) {
      setMessage({ type: 'err', text: 'Supabase is not configured.' })
      return
    }
    setBusy(true)
    setMessage(null)
    const { error } = await supabase
      .from('page_content')
      .upsert({ page: 'partners', data: { heading: nextHeading, partners: nextPartners }, updated_at: new Date().toISOString() })
    if (error) {
      setBusy(false)
      setMessage({ type: 'err', text: `Save failed: ${error.message}` })
      return
    }
    setHeading(nextHeading)
    setPartners(nextPartners)
    await refetch()
    setBusy(false)
    setDirty(false)
    setMessage({ type: 'ok', text: okText })
  }

  async function addPartner() {
    if (!newPartner.logo_url.trim()) {
      setMessage({ type: 'err', text: 'Upload a logo (or paste a logo image URL) first.' })
      return
    }
    const link = newPartner.link.trim()
    const partner: Partner = {
      name: newPartner.name.trim() || 'Partner',
      logo_url: newPartner.logo_url.trim(),
      link: link && !/^https?:\/\//i.test(link) ? `https://${link}` : link,
    }
    await persist(heading, [...partners, partner], 'Partner added. It now shows at the bottom of every page.')
    setNewPartner({ name: '', logo_url: '', link: '' })
  }

  function update(idx: number, patch: Partial<Partner>) {
    setPartners((list) => list.map((p, i) => (i === idx ? { ...p, ...patch } : p)))
    setDirty(true)
  }

  async function move(idx: number, dir: -1 | 1) {
    const t = idx + dir
    if (t < 0 || t >= partners.length) return
    const next = partners.slice()
    ;[next[idx], next[t]] = [next[t], next[idx]]
    await persist(heading, next, 'Order updated.')
  }

  async function remove(idx: number) {
    if (!confirm('Remove this partner logo?')) return
    await persist(heading, partners.filter((_, i) => i !== idx), 'Partner removed.')
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-navy">Partners & Logos</h1>
        <p className="mt-6 text-sm text-muted">Loading your saved content…</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold text-navy">Partners & Logos</h1>
      <p className="mt-1 text-sm text-muted">
        Logos added here appear in a strip at the bottom of every page, just above the footer. The strip is hidden
        while the list is empty.
      </p>

      {message && (
        <div
          className={`mt-4 rounded border px-4 py-3 text-sm ${
            message.type === 'ok' ? 'border-green-300 bg-green-50 text-green-800' : 'border-crimson bg-red-50 text-crimson'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add */}
      <section className="mt-6 rounded border border-hairline bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Add a partner</h2>
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Partner name">
              <TextInput value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} placeholder="e.g. KUTV Kenya" />
            </Field>
            <Field label="Website link (optional)">
              <TextInput value={newPartner.link} onChange={(e) => setNewPartner({ ...newPartner, link: e.target.value })} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Logo">
            <ImageField value={newPartner.logo_url} onChange={(url) => setNewPartner({ ...newPartner, logo_url: url })} folder="partners" maxDim={600} />
          </Field>
          <button type="button" onClick={addPartner} disabled={busy} className={btnPrimary}>
            Add partner
          </button>
        </div>
      </section>

      {/* List */}
      <section className="mt-6 rounded border border-hairline bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Current partners ({partners.length})</h2>
        <div className="mt-3 max-w-sm">
          <Field label="Section heading on the site">
            <TextInput
              value={heading}
              onChange={(e) => {
                setHeading(e.target.value)
                setDirty(true)
              }}
            />
          </Field>
        </div>

        {partners.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No partners yet. Add your first one above.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {partners.map((p, idx) => (
              <li key={`${p.logo_url}-${idx}`} className="rounded border border-hairline bg-offwhite p-3">
                <div className="grid gap-3 md:grid-cols-[9rem_1fr]">
                  <div className="flex h-20 items-center justify-center rounded border border-hairline bg-white p-2">
                    <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <TextInput value={p.name} onChange={(e) => update(idx, { name: e.target.value })} placeholder="Name" />
                      <TextInput value={p.link} onChange={(e) => update(idx, { link: e.target.value })} placeholder="Website link (optional)" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => move(idx, -1)} disabled={busy || idx === 0} className={btnOutline}>
                        ← Earlier
                      </button>
                      <button type="button" onClick={() => move(idx, 1)} disabled={busy || idx === partners.length - 1} className={btnOutline}>
                        Later →
                      </button>
                      <button type="button" onClick={() => remove(idx)} disabled={busy} className={btnDanger}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="sticky bottom-0 mt-6 flex items-center gap-3 border-t border-hairline bg-offwhite py-4">
        <button type="button" onClick={() => persist(heading, partners, 'Changes saved.')} disabled={busy || !dirty} className={btnPrimary}>
          {busy ? 'Saving…' : 'Save edits'}
        </button>
        {dirty && <span className="text-xs text-muted">You have unsaved edits.</span>}
      </div>
    </div>
  )
}

export default PartnersPage
