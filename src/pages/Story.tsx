import { Link, useParams } from 'react-router-dom'
import { stories } from '../data/stories'

function Story() {
  const { id } = useParams<{ id: string }>()
  const story = stories.find((s) => s.id === id)

  if (!story) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p className="text-navy">Story not found.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium uppercase tracking-wide text-crimson">
            ← Back to Home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          to="/"
          className="text-sm font-medium uppercase tracking-wide text-crimson hover:text-crimson-dark"
        >
          ← Back to Campaign Highlights
        </Link>

        <span className="mt-6 inline-block rounded-sm bg-crimson px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {story.tag}
        </span>
        <h1 className="mt-3 text-[28px] font-medium text-navy md:text-[32px]">{story.title}</h1>
        <p className="mt-1 text-sm text-muted">{story.date}</p>

        <div className="mt-6 space-y-4">
          {story.paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>

        <Link
          to={story.ctaHref}
          className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
        >
          {story.ctaLabel}
        </Link>
      </div>
    </section>
  )
}

export default Story
