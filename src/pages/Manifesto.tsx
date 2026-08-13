function Manifesto() {
  const pillars = [
    {
      title: 'Inclusive Leadership',
      body: 'Equal county resource allocation for youth, women, and Persons with Disabilities (PWDs).',
    },
    {
      title: 'Accountable Governance',
      body: 'Full transparency in ward bursary distributions and public development funds.',
    },
    {
      title: 'Sustainable Empowerment',
      body: 'Upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.',
    },
  ]
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Kahawa West 2027
        </p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-medium text-navy md:text-[32px]">
          Siasa Safi, Maisha Bora
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Vying for Member of County Assembly (MCA) for Kahawa West Ward
          under the Democracy for Citizens Party (DCP) banner.
        </p>
        <p className="mt-4 max-w-2xl border-l-4 border-crimson pl-4 text-base italic text-navy">
          "Kuwakumbusha tu Connection ni God na Jamii"
        </p>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          A bold reminder that our only alignment is with God and the
          grassroots community, not political cartels.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded border border-hairline bg-navy p-6">
              <div className="mb-4 h-10 w-10 rounded-full bg-crimson" />
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-white/70">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Manifesto
