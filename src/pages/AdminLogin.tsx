import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isSupabaseConfigured) {
      setError(
        'Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      )
      return
    }

    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/admin')
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-offwhite">
      <div className="w-full max-w-sm rounded border border-hairline bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Admin
        </p>
        <h1 className="mt-2 text-xl font-medium text-navy">Sign In</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-hairline px-3 py-2.5 text-sm text-ink outline-none focus:border-crimson"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-hairline px-3 py-2.5 text-sm text-ink outline-none focus:border-crimson"
            />
          </div>

          {error && <p className="text-sm text-crimson">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-crimson px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AdminLogin
