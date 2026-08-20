import { useRef, useState } from 'react'
import { MEDIA_BUCKET, supabase } from '../lib/supabase'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

const inputClass =
  'w-full rounded border border-hairline px-3 py-2 text-sm outline-none focus:border-crimson bg-white'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={inputClass} />
}

export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 shrink-0 cursor-pointer rounded border border-hairline"
      />
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
  )
}

export function ImageField({
  value,
  onChange,
  folder = 'uploads',
}: {
  value: string
  onChange: (url: string) => void
  folder?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }
    setUploading(true)
    setError(null)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="" className="h-16 w-16 shrink-0 rounded border border-hairline object-cover" />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className={inputClass}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded border border-hairline px-3 py-1.5 text-xs font-medium text-navy hover:border-crimson hover:text-crimson disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
            {error && <span className="text-xs text-crimson">{error}</span>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function SaveBar({
  onSave,
  saving,
  saved,
}: {
  onSave: () => void
  saving: boolean
  saved: boolean
}) {
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-end gap-3 border-t border-hairline bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-full bg-crimson px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}
