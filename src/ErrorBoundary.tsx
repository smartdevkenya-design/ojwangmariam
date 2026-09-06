import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render errors anywhere below it and shows the actual error
 * message on screen instead of leaving a blank white page — so a crash
 * can be diagnosed by reading the page instead of needing DevTools.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 700, margin: '40px auto' }}>
          <h1 style={{ color: '#c8102e', fontSize: 20, fontWeight: 700 }}>Something went wrong on this page</h1>
          <p style={{ marginTop: 8, color: '#444' }}>
            Please copy the message below and send it back — it tells us exactly what broke.
          </p>
          <pre
            style={{
              marginTop: 16,
              padding: 16,
              background: '#f7f7f5',
              border: '1px solid #e5e2dc',
              borderRadius: 8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: 13,
            }}
          >
            {this.state.error.name}: {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              borderRadius: 999,
              background: '#0a1e3f',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
