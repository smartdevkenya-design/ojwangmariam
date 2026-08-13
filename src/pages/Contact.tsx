function Contact() {
  return (
    <section className="bg-navy-deep">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Get Involved
        </p>
        <h1 className="mt-2 max-w-xl text-[28px] font-medium text-white md:text-[32px]">
          Stand With Ojwang Mariam
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Contact
            </h3>
            <p className="mt-3 text-white">
              <a href="mailto:ojwangmariam@gmail.com" className="hover:text-crimson">
                ojwangmariam@gmail.com
              </a>
            </p>
            <p className="mt-1 text-white">
              <a href="tel:+254722731328" className="hover:text-crimson">
                +254 722 731 328
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Campaign & Book Financials
            </h3>
            <div className="mt-3 rounded border border-navy-light bg-navy p-4">
              <p className="text-sm text-white/70">
                M-Pesa Paybill: <span className="text-white">247247</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Number: <span className="text-white">731328</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Name:{' '}
                <span className="text-white">Ojwang Mariam Solutions</span>
              </p>
            </div>
          </div>
        </div>
        <a
          href="mailto:ojwangmariam@gmail.com"
          className="mt-10 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
        >
          Join the Movement
        </a>
      </div>
    </section>
  )
}

export default Contact
