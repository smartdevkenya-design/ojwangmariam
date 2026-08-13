import { Link } from 'react-router-dom'

function Volunteer() {
  const items = [
    {
      title: 'Volunteer',
      body: 'Join campaign teams on the ground — canvassing, event support, and youth mobilization across Kahawa West.',
      cta: 'Get Involved',
      to: '/contact',
    },
    {
      title: 'Donate Now',
      body: 'Support the campaign directly via M-Pesa Paybill 247247, Account 731328 (Ojwang Mariam Solutions).',
      cta: 'Donation Details',
      to: '/contact',
    },
    {
      title: 'Order the Book',
      body: 'Get your copy of Believe Become, or sponsor a copy for a slum/rescue centre student.',
      cta: 'Order the Book',
      to: '/book',
    },
  ]

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep">
        <img
          src="https://picsum.photos/seed/volunteer-banner/1600/700"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-navy-deep/60" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
            Get Involved
          </p>
          <h1 className="mt-4 max-w-xl text-[30px] font-bold leading-[1.15] text-white sm:text-[38px] md:text-[48px]">
            Stand With the Campaign
          </h1>
          <p className="mt-4 max-w-xl text-white/75">
            Whether it's your time, your voice, or your support — every
            contribution moves Kahawa West closer to inclusive, accountable
            leadership.
          </p>
        </div>
      </section>

      <section className="bg-offwhite">
        <div className="mx-auto max-w-[1200px] px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded border border-hairline bg-white p-6 shadow-sm"
              >
                <span className="h-10 w-10 shrink-0 rounded-full border-2 border-crimson" />
                <h3 className="mt-5 text-lg font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.body}</p>
                <Link
                  to={item.to}
                  className="mt-6 inline-block rounded-full bg-crimson px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark"
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Volunteer
