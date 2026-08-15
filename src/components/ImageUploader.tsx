import { useRef, useState } from 'react'
import { uploadImage } from '../lib/storage'

function ImageUploader({
  label,
  value,
  onChange,
  folder,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  folder: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded border border-hairline bg-offwhite">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
              No image
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            disabled={uploading}
            className="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-medium file:uppercase file:tracking-wide file:text-white hover:file:bg-navy-light disabled:opacity-60"
          />
          {uploading && <p className="text-xs text-muted">Uploading…</p>}
          {error && <p className="text-xs text-crimson">{error}</p>}
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs font-medium uppercase tracking-wide text-crimson hover:underline"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploader
