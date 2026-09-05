import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSiteData } from '../context/SiteDataContext'
import { ImageField, TextInput } from './fields'

function GalleryImagesPage() {
  const { galleryImages, refetch } = useSiteData()
  const [newUrl, setNewUrl] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [busy, setBusy] = useState(false)

  async function addImage() {
    if (!supabase || !newUrl.trim()) return
    setBusy(true)
    const { error } = await supabase.from('gallery_images').insert({
      url: newUrl,
      caption: newCaption,
      sort_order: galleryImages.length,
    })
    setBusy(false)
    if (error) {
      alert(`Add failed: ${error.message}`)
      return
    }
    setNewUrl('')
    setNewCaption('')
    await refetch()
  }

  async function updateCaption(id: string, caption: string) {
    if (!supabase) return
    const { error } = await supabase.from('gallery_images').update({ caption }).eq('id', id)
    if (error) alert(`Update failed: ${error.message}`)
  }

  async function removeImage(id: string) {
    if (!supabase) return
    if (!confirm('Remove this photo?')) return
    const { error } = await supabase.from('gallery_images').delete().eq('id', id)
    if (error) {
      alert(`Remove failed: ${error.message}`)
      return
    }
    await refetch()
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">Gallery Photos</h1>
      <p className="mt-1 text-sm text-muted">Add, caption, or remove photos shown on the Gallery page.</p>

      <div className="mt-6 rounded border border-hairline bg-offwhite p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy">Add a photo</p>
        <ImageField value={newUrl} onChange={setNewUrl} folder="gallery" />
        <div className="mt-3 flex gap-2">
          <TextInput
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Caption"
          />
          <button
            type="button"
            onClick={addImage}
            disabled={busy || !newUrl.trim()}
            className="shrink-0 rounded-full bg-crimson px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {galleryImages.map((img) => (
          <div key={img.id} className="overflow-hidden rounded border border-hairline bg-white">
            <img src={img.url} alt={img.caption} className="aspect-square w-full object-cover" />
            <div className="p-2">
              <input
                defaultValue={img.caption}
                onBlur={(e) => updateCaption(img.id, e.target.value)}
                className="w-full border-b border-transparent bg-transparent text-xs outline-none focus:border-crimson"
              />
              <button type="button" onClick={() => removeImage(img.id)} className="mt-1 text-xs text-crimson">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GalleryImagesPage
