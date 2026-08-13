import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">404</p>
        <h1 className="mt-2 text-[28px] font-medium text-navy">Page not found</h1>
        <p className="mt-4 text-muted">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default NotFound
