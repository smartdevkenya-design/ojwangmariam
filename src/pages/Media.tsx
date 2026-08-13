function Media() {
  const items = [
    {
      title: 'Wueeh TV Kenya CBO',
      body: 'As Founder and CEO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.',
    },
    {
      title: 'SHOFCO Youth Leadership',
      body: 'Serving as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.',
    },
    {
      title: 'Community Building',
      body: 'Executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace.',
    },
  ]
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Media & Impact
        </p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          Impact Beyond Politics
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((i, idx) => (
            <div key={i.title} className="overflow-hidden border-t-2 border-navy bg-white shadow-sm">
              <img
                src={`https://picsum.photos/seed/media-${idx}/500/300`}
                alt=""
                className="h-32 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-sm font-semibold text-navy">{i.title}</h3>
                <p className="mt-2 text-sm text-muted">{i.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Media
