import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSiteData } from '../context/SiteDataContext'
import { ColorInput, Field, SaveBar } from './fields'

const LABELS: Record<string, string> = {
  navy: 'Navy (primary dark)',
  'navy-deep': 'Navy Deep (darkest)',
  'navy-light': 'Navy Light',
  crimson: 'Crimson (accent / brand)',
  'crimson-dark': 'Crimson Dark (hover)',
  white: 'White',
  offwhite: 'Off-white (section background)',
  ink: 'Ink (body text)',
  muted: 'Muted text',
  hairline: 'Hairline / borders',
}

function ThemePage() {
  const { settings, refetch, loading } = useSiteData()
  const [theme, setTheme] = useState<Record<string, string>>(settings.theme)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => setTheme(settings.theme), [settings])

  async function handleSave() {
    if (!supabase) return
    setSaving(true)
    const { data: rows, error } = await supabase
      .from('site_settings')
      .update({ theme })
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
        <h1 className="text-xl font-semibold text-navy">Colors & Theme</h1>
        <p className="mt-6 text-sm text-muted">Loading your saved colors…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">Colors & Theme</h1>
      <p className="mt-1 text-sm text-muted">
        These colors drive every button, background and accent across the site. Changes apply live once saved.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.keys(theme).map((key) => (
          <Field key={key} label={LABELS[key] || key}>
            <ColorInput value={theme[key]} onChange={(v) => { setTheme((t) => ({ ...t, [key]: v })); setSaved(false) }} />
          </Field>
        ))}
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

export default ThemePage
