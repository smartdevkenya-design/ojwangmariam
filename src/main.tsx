import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { SiteDataProvider } from './context/SiteDataContext'
import { ErrorBoundary } from './ErrorBoundary'
import './index.css'
import { preconnect, preloadRememberedImages } from './lib/preload'

preconnect(import.meta.env.VITE_SUPABASE_URL as string | undefined)
preloadRememberedImages()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/">
        <SiteDataProvider>
          <App />
        </SiteDataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
