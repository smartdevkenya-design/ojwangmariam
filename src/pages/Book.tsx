import { Link } from 'react-router-dom'

function Book() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1200px] px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <img
            src="https://picsum.photos/seed/believe-become-cover/600/800"
            alt="Believe Become book cover (mock)"
            className="aspect-[3/4] w-full max-w-sm rounded border border-hairline object-cover"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
              Featured Masterpiece
            </p>
            <h1 className="mt-2 text-[28px] font-medium text-navy md:text-[32px]">
              Believe Become
            </h1>
            <p className="mt-1 text-lg text-muted">
              Vision Beyond Sight: From the Slums to a World-Class University
            </p>
            <p className="mt-6 text-muted">
              A powerful memoir and motivational blueprint written to inspire
              global social impact. It delves deep into Mariam's structural
              survival, mental resilience, and the strategies used to
              traverse intense physical and economic challenges — a roadmap
              for any youth looking to find their voice and change their
              community.
            </p>
            <p className="mt-4 text-sm text-muted">
              Officially unveiled at a grand launch on{' '}
              <span className="text-ink">
                Friday, 7th August 2026 at the Kenya National Theatre, Nairobi
              </span>
              , alongside its accompanying podcast network.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">Standard Copy</p>
                <p className="mt-1 text-lg font-semibold text-crimson">KSH 1,500</p>
              </div>
              <div className="rounded border border-hairline bg-white p-4">
                <p className="text-sm font-medium text-navy">
                  Sponsor a Slum/Rescue Centre Student
                </p>
                <p className="mt-1 text-lg font-semibold text-crimson">KSH 1,500</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
            >
              Order Online / Sponsor a Reader
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Book
