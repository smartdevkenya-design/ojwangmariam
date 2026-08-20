import { useParams } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import NotFound from './NotFound'

function DynamicPage() {
  const { slug } = useParams<{ slug: string }>()
  const { customPages, loading } = useSiteData()
  const page = customPages.find((p) => p.slug === slug)

  if (!page) {
    if (loading) return null
    return <NotFound />
  }

  return (
    <section className="bg-white">
      <div className="w-full px-6 py-10 sm:py-16">
        <h1 className="text-[28px] font-medium text-navy md:text-[32px]">{page.title}</h1>
        <div className="mt-8 space-y-8">
          {page.sections.map((block, i) => {
            if (block.type === 'heading') {
              return (
                <h2 key={i} className="text-xl font-semibold text-navy">
                  {block.text}
                </h2>
              )
            }
            if (block.type === 'text') {
              return (
                <p key={i} className="max-w-2xl text-base leading-relaxed text-muted">
                  {block.text}
                </p>
              )
            }
            if (block.type === 'image') {
              return (
                <img
                  key={i}
                  src={block.url}
                  alt={block.alt || ''}
                  className="aspect-[12/5] w-full rounded border border-hairline object-cover"
                />
              )
            }
            if (block.type === 'cta') {
              return (
                <a
                  key={i}
                  href={block.href}
                  className="inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
                >
                  {block.label}
                </a>
              )
            }
            return null
          })}
        </div>
      </div>
    </section>
  )
}

export default DynamicPage
