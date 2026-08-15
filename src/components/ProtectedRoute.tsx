import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Loading…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
