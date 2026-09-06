import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSiteData } from '../context/SiteDataContext'
import type { SiteSettings } from '../lib/types'
import { Field, ImageField, SaveBar, TextArea, TextInput } from './fields'

function SiteSettingsPage() {
  const { settings, refetch, loading } = useSiteData()
  const [data, setData] = useState<SiteSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => setData(settings), [settings])

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setData((d) => ({ ...d, [key]: value }))
    setSaved(false)
  }

  function updateNavLink(idx: number, key: 'label' | 'to', value: string) {
    const next = data.nav_links.slice()
    next[idx] = { ...next[idx], [key]: value }
    set('nav_links', next)
  }
  function addNavLink() {
    set('nav_links', [...data.nav_links, { label: 'New Link', to: '/' }])
  }
  function removeNavLink(idx: number) {
    set('nav_links', data.nav_links.filter((_, i) => i !== idx))
  }

  function updateTag(idx: number, value: string) {
    const next = data.footer_tags.slice()
    next[idx] = value
    set('footer_tags', next)
  }
  function addTag() {
    set('footer_tags', [...data.footer_tags, 'New Tag'])
  }
  function removeTag(idx: number) {
    set('footer_tags', data.footer_tags.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    if (!supabase) return
    setSaving(true)
    const { data: rows, error } = await supabase
      .from('site_settings')
      .update(data)
      .eq('id', 1)
      .select()
    setSaving(false)
    if (error) {
      alert(`Save failed: ${error.message}`)
      return
    }
    if (!rows || rows.length === 0) {
      alert(
        'Save didn\'t stick: the database rejected the update silently (0 rows changed). ' +
          'This usually means your admin login session isn\'t active, or the site_settings row ' +
          'is missing — try signing out and back in, or re-check supabase/schema.sql was run.'
      )
      return
    }
    await refetch()
    setSaved(true)
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-navy">Site Settings & Logo</h1>
        <p className="mt-6 text-sm text-muted">Loading your saved settings…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">Site Settings & Logo</h1>
      <p className="mt-1 text-sm text-muted">Logo, navigation, contact details, footer, and payment info.</p>

      <div className="mt-6 space-y-6">
        <Field label="Site title (browser tab)">
          <TextInput value={data.site_title} onChange={(e) => set('site_title', e.target.value)} />
        </Field>

        <div className="rounded border border-hairline bg-offwhite p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy">Logo</p>
          <Field label="Logo image (leave blank to use text logo below)">
            <ImageField value={data.logo_image_url || ''} onChange={(v) => set('logo_image_url', v)} folder="logo" />
          </Field>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Text logo — line 1">
              <TextInput value={data.logo_line1} onChange={(e) => set('logo_line1', e.target.value)} />
            </Field>
            <Field label="Text logo — line 2">
              <TextInput value={data.logo_line2} onChange={(e) => set('logo_line2', e.target.value)} />
            </Field>
          </div>
        </div>

        <Field label="Top press banner text">
          <TextInput value={data.press_banner_text} onChange={(e) => set('press_banner_text', e.target.value)} />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Phone">
            <TextInput value={data.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput value={data.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <TextInput value={data.address} onChange={(e) => set('address', e.target.value)} />
        </Field>

        <div className="rounded border border-hairline bg-offwhite p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy">Navigation Menu</p>
          <div className="space-y-2">
            {data.nav_links.map((l, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <TextInput value={l.label} onChange={(e) => updateNavLink(idx, 'label', e.target.value)} placeholder="Label" />
                <TextInput value={l.to} onChange={(e) => updateNavLink(idx, 'to', e.target.value)} placeholder="/path" />
                <button type="button" onClick={() => removeNavLink(idx)} className="shrink-0 px-2 text-xs text-crimson">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addNavLink}
            className="mt-3 rounded border border-dashed border-hairline px-4 py-2 text-xs font-medium text-navy hover:border-crimson hover:text-crimson"
          >
            + Add nav link
          </button>
        </div>

        <Field label="Footer about text">
          <TextArea value={data.footer_about} onChange={(e) => set('footer_about', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Footer copyright line">
            <TextInput value={data.footer_copyright} onChange={(e) => set('footer_copyright', e.target.value)} />
          </Field>
          <Field label="Footer tagline">
            <TextInput value={data.footer_tagline} onChange={(e) => set('footer_tagline', e.target.value)} />
          </Field>
        </div>

        <div className="rounded border border-hairline bg-offwhite p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy">Footer Tags</p>
          <div className="flex flex-wrap gap-2">
            {data.footer_tags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-1 rounded-full border border-hairline bg-white px-2 py-1">
                <input
                  value={tag}
                  onChange={(e) => updateTag(idx, e.target.value)}
                  className="w-24 bg-transparent text-xs outline-none"
                />
                <button type="button" onClick={() => removeTag(idx)} className="text-xs text-crimson">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTag}
            className="mt-3 rounded border border-dashed border-hairline px-4 py-2 text-xs font-medium text-navy hover:border-crimson hover:text-crimson"
          >
            + Add tag
          </button>
        </div>

        <div className="rounded border border-hairline bg-offwhite p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy">M-Pesa / Payment Details</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Paybill">
              <TextInput value={data.mpesa_paybill} onChange={(e) => set('mpesa_paybill', e.target.value)} />
            </Field>
            <Field label="Account number">
              <TextInput value={data.mpesa_account} onChange={(e) => set('mpesa_account', e.target.value)} />
            </Field>
            <Field label="Account name">
              <TextInput value={data.mpesa_account_name} onChange={(e) => set('mpesa_account_name', e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

export default SiteSettingsPage
