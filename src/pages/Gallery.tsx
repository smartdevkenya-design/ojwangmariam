function Gallery() {
  const captions = [
    'Book launch, Kenya National Theatre',
    'Community outreach, Kahawa West',
    'On set at Wueeh TV Kenya',
    'SHOFCO youth leadership event',
    'Mr & Miss Roysambu',
    'Campaign walkabout',
  ]
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">Gallery</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          Moments From the Ground
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Photos placeholder — swap these in once real event and campaign
          photography is ready.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {captions.map((caption) => (
            <figure key={caption} className="overflow-hidden rounded border border-hairline">
              <div className="aspect-square bg-navy/5" />
              <figcaption className="bg-offwhite px-3 py-2 text-xs text-muted">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
