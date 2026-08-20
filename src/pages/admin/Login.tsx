import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { supabaseConfigured } from '../lib/supabase'

function Login() {
  const { session, signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const err = await signIn(email, password)
    setSubmitting(false)
    if (err) setError(err)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-deep px-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <h1 className="text-xl font-semibold text-navy">Admin Sign In</h1>
        <p className="mt-1 text-sm text-muted">Ojwang Mariam campaign site</p>

        {!supabaseConfigured && (
          <p className="mt-4 rounded border border-crimson/30 bg-crimson/5 p-3 text-xs text-crimson">
            Supabase isn't configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment,
            then create an admin user in the Supabase dashboard.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-hairline px-3 py-2 text-sm outline-none focus:border-crimson"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-hairline px-3 py-2 text-sm outline-none focus:border-crimson"
            />
          </div>
          {error && <p className="text-sm text-crimson">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
