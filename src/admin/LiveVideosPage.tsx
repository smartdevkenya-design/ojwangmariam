import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PAGE_DEFAULTS, useSiteData } from '../context/SiteDataContext'
import type { MediaContent, PreviousLive } from '../lib/types'
import { getYouTubeEmbedUrl, getYouTubeId, getYouTubeThumbnail } from '../lib/youtube'
import { Field, TextInput } from './fields'

const btn = 'rounded px-3 py-1.5 text-xs font-medium transition disabled:opacity-50'
const btnPrimary = `${btn} bg-crimson text-white hover:bg-crimson-dark`
const btnOutline = `${btn} border border-hairline bg-white text-navy hover:border-crimson hover:text-crimson`
const btnDanger = `${btn} border border-hairline bg-white text-crimson hover:border-crimson`

function today() {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function LiveVideosPage() {
  const { pageContent, refetch, loading } = useSiteData()
  const defaults = PAGE_DEFAULTS.media as unknown as MediaContent

  const [liveTitle, setLiveTitle] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [previous, setPrevious] = useState<PreviousLive[]>([])
  const [sectionTitle, setSectionTitle] = useState('Previous Live Videos')

  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [dirty, setDirty] = useState(false)

  // Load saved values once they arrive from Supabase.
  useEffect(() => {
    if (loading) return
    const saved = { ...defaults, ...((pageContent.media as object) ?? {}) } as MediaContent
    setLiveTitle(saved.live_title ?? '')
    setLiveUrl(saved.live_youtube_url ?? '')
    setPrevious(saved.previous_lives ?? [])
    setSectionTitle(saved.previous_lives_title || 'Previous Live Videos')
    setDirty(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  /** Write everything to Supabase (keeps all other Media page fields untouched). */
  async function persist(next: {
    liveTitle: string
    liveUrl: string
    previous: PreviousLive[]
    sectionTitle: string
  }, okText: string) {
    if (!supabase) {
      setMessage({ type: 'err', text: 'Supabase is not configured.' })
      return false
    }
    setBusy(true)
    setMessage(null)
    const existing = { ...defaults, ...((pageContent.media as object) ?? {}) } as MediaContent
    const data: MediaContent = {
      ...existing,
      live_title: next.liveTitle,
      live_youtube_url: next.liveUrl,
      previous_lives: next.previous,
      previous_lives_title: next.sectionTitle,
    }
    const { error } = await supabase
      .from('page_content')
      .upsert({ page: 'media', data, updated_at: new Date().toISOString() })
    if (error) {
      setBusy(false)
      setMessage({ type: 'err', text: `Save failed: ${error.message}` })
      return false
    }
    setLiveTitle(next.liveTitle)
    setLiveUrl(next.liveUrl)
    setPrevious(next.previous)
    setSectionTitle(next.sectionTitle)
    await refetch()
    setBusy(false)
    setDirty(false)
    setMessage({ type: 'ok', text: okText })
    return true
  }

  const hasLive = Boolean(getYouTubeId(liveUrl))
  const currentAsPrevious = (): PreviousLive => ({
    title: liveTitle.trim() || 'Previous live stream',
    date: today(),
    youtube_url: liveUrl.trim(),
  })
  const withoutDuplicate = (list: PreviousLive[], url: string) =>
    list.filter((v) => getYouTubeId(v.youtube_url) !== getYouTubeId(url))

  // ── Actions ─────────────────────────────────────────────

  async function pushToPrevious() {
    if (!hasLive) return
    if (!confirm('Move the current live video to "Previous Live Videos"? The live section will be empty until you add a new one.')) return
    await persist(
      { liveTitle: '', liveUrl: '', previous: [currentAsPrevious(), ...withoutDuplicate(previous, liveUrl)], sectionTitle },
      'Moved to Previous Live Videos.'
    )
  }

  async function goLiveWithNew() {
    if (!getYouTubeId(newUrl)) {
      setMessage({ type: 'err', text: 'Paste a valid YouTube link (youtube.com or youtu.be) for the new video.' })
      return
    }
    // Any current live video is automatically pushed to previous.
    const nextPrevious = hasLive ? [currentAsPrevious(), ...withoutDuplicate(previous, liveUrl)] : previous
    const ok = await persist(
      { liveTitle: newTitle.trim(), liveUrl: newUrl.trim(), previous: withoutDuplicate(nextPrevious, newUrl), sectionTitle },
      hasLive ? 'New video is live. The old one moved to Previous Live Videos.' : 'New video is live.'
    )
    if (ok) {
      setNewTitle('')
      setNewUrl('')
    }
  }

  async function makeLive(idx: number) {
    const v = previous[idx]
    const rest = previous.filter((_, i) => i !== idx)
    const nextPrevious = hasLive ? [currentAsPrevious(), ...withoutDuplicate(rest, liveUrl)] : rest
    await persist(
      { liveTitle: v.title, liveUrl: v.youtube_url, previous: nextPrevious, sectionTitle },
      'Set as the live video.'
    )
  }

  async function removePrevious(idx: number) {
    if (!confirm('Remove this video from the list?')) return
    await persist(
      { liveTitle, liveUrl, previous: previous.filter((_, i) => i !== idx), sectionTitle },
      'Video removed.'
    )
  }

  async function movePrevious(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= previous.length) return
    const next = previous.slice()
    ;[next[idx], next[target]] = [next[target], next[idx]]
    await persist({ liveTitle, liveUrl, previous: next, sectionTitle }, 'Order updated.')
  }

  async function saveEdits() {
    if (liveUrl.trim() && !getYouTubeId(liveUrl)) {
      setMessage({ type: 'err', text: 'The live YouTube link is not valid.' })
      return
    }
    const bad = previous.findIndex((v) => !getYouTubeId(v.youtube_url))
    if (bad !== -1) {
      setMessage({ type: 'err', text: `Previous video ${bad + 1} has an invalid YouTube link.` })
      return
    }
    await persist({ liveTitle, liveUrl, previous, sectionTitle }, 'Changes saved.')
  }

  function updatePrevious(idx: number, patch: Partial<PreviousLive>) {
    setPrevious((list) => list.map((v, i) => (i === idx ? { ...v, ...patch } : v)))
    setDirty(true)
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-navy">Live Videos</h1>
        <p className="mt-6 text-sm text-muted">Loading your saved content…</p>
      </div>
    )
  }

  const liveEmbed = getYouTubeEmbedUrl(liveUrl)

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold text-navy">Live Videos</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the video shown on the Media page and the list of previous live videos. Actions on buttons save
        immediately.
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

      {/* 1. Current live video */}
      <section className="mt-6 rounded border border-hairline bg-white p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-crimson">
          {hasLive && <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-crimson" />}
          Current live video
        </h2>
        {hasLive ? (
          <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,18rem)_1fr]">
            <div className="aspect-video overflow-hidden rounded border border-hairline bg-black">
              <iframe src={liveEmbed ?? ''} title="Current live video" className="h-full w-full" loading="lazy" allowFullScreen />
            </div>
            <div className="space-y-3">
              <Field label="Title">
                <TextInput
                  value={liveTitle}
                  onChange={(e) => {
                    setLiveTitle(e.target.value)
                    setDirty(true)
                  }}
                />
              </Field>
              <Field label="YouTube link">
                <TextInput
                  value={liveUrl}
                  onChange={(e) => {
                    setLiveUrl(e.target.value)
                    setDirty(true)
                  }}
                />
              </Field>
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={pushToPrevious} disabled={busy} className={btnPrimary}>
                  Push to Previous Videos
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">No live video is set. Add one below, or make one from the list.</p>
        )}
      </section>

      {/* 2. Go live with a new video */}
      <section className="mt-6 rounded border border-hairline bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Go live with a new video</h2>
        <p className="mt-1 text-xs text-muted">
          {hasLive
            ? 'Publishing a new video automatically moves the current one to Previous Live Videos.'
            : 'This video will appear at the top of the Media page.'}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <TextInput value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Sunday Town Hall" />
          </Field>
          <Field label="YouTube link">
            <TextInput value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://youtube.com/live/..." />
          </Field>
        </div>
        <button type="button" onClick={goLiveWithNew} disabled={busy || !newUrl.trim()} className={`${btnPrimary} mt-4`}>
          Publish as Live Video
        </button>
      </section>

      {/* 3. Previous videos */}
      <section className="mt-6 rounded border border-hairline bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Previous live videos ({previous.length})</h2>
        <div className="mt-3 max-w-sm">
          <Field label="Section title on the site">
            <TextInput
              value={sectionTitle}
              onChange={(e) => {
                setSectionTitle(e.target.value)
                setDirty(true)
              }}
            />
          </Field>
        </div>

        {previous.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nothing here yet. Use “Push to Previous Videos” on the current video.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {previous.map((v, idx) => (
              <li key={`${v.youtube_url}-${idx}`} className="rounded border border-hairline bg-offwhite p-3">
                <div className="grid gap-3 md:grid-cols-[10rem_1fr]">
                  <div className="aspect-video overflow-hidden rounded bg-black">
                    {getYouTubeThumbnail(v.youtube_url) && (
                      <img src={getYouTubeThumbnail(v.youtube_url) ?? ''} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-[1fr_9rem]">
                      <TextInput value={v.title} onChange={(e) => updatePrevious(idx, { title: e.target.value })} placeholder="Title" />
                      <TextInput value={v.date} onChange={(e) => updatePrevious(idx, { date: e.target.value })} placeholder="Date" />
                    </div>
                    <TextInput value={v.youtube_url} onChange={(e) => updatePrevious(idx, { youtube_url: e.target.value })} placeholder="YouTube link" />
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => makeLive(idx)} disabled={busy} className={btnOutline}>
                        Make live
                      </button>
                      <button type="button" onClick={() => movePrevious(idx, -1)} disabled={busy || idx === 0} className={btnOutline}>
                        ↑
                      </button>
                      <button type="button" onClick={() => movePrevious(idx, 1)} disabled={busy || idx === previous.length - 1} className={btnOutline}>
                        ↓
                      </button>
                      <button type="button" onClick={() => removePrevious(idx)} disabled={busy} className={btnDanger}>
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

      {/* Save bar for text edits */}
      <div className="sticky bottom-0 mt-6 flex items-center gap-3 border-t border-hairline bg-offwhite py-4">
        <button type="button" onClick={saveEdits} disabled={busy || !dirty} className={btnPrimary}>
          {busy ? 'Saving…' : 'Save edits'}
        </button>
        {dirty && <span className="text-xs text-muted">You have unsaved text edits.</span>}
      </div>
    </div>
  )
}

export default LiveVideosPage
