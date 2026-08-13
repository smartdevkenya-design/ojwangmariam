function About() {
  const cards = [
    {
      title: 'Overcoming the Odds',
      body: 'Growing up in the unforgiving urban slums of Nairobi, Mariam faced severe economic hardships, eventually experiencing teenage homelessness — until shelter arrived through a local Children Rescue Centre.',
    },
    {
      title: 'Defying Limitations',
      body: 'Navigating the world as an individual with PWD Low Vision, Mariam actively dismantled structural barriers, proving at every stage that Disability is not Inability.',
    },
    {
      title: 'Academic Excellence',
      body: 'Driven by an unyielding belief in education, Mariam transitioned from the rescue centers straight to Kenyatta University, graduating with a Bachelor of Education degree.',
    },
    {
      title: 'The Vision',
      body: 'Today, Mariam stands as an award-winning multimedia journalist, former KU Radio/KUTV news anchor, CEO of Wueeh TV Kenya, and a relentless voice for the marginalized.',
    },
  ]
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">About</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          The Journey of Resilience: Meet Ojwang Mariam
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Born Vincent Maina Nyakinyua and widely celebrated across Kenya as
          Ojwang Mariam (Mtoto Wa Mariam), this is a story of turning
          profound adversity into a lifelong mission for social justice.
        </p>
        <img
          src="https://picsum.photos/seed/mariam-portrait/1200/500"
          alt="Ojwang Mariam (mock portrait)"
          className="mt-8 aspect-[12/5] w-full rounded border border-hairline object-cover"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="border-t-2 border-crimson bg-offwhite p-5">
              <h3 className="text-sm font-semibold text-navy">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
