import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Book from './pages/Book'
import Manifesto from './pages/Manifesto'
import Media from './pages/Media'
import Gallery from './pages/Gallery'
import Volunteer from './pages/Volunteer'
import Contact from './pages/Contact'
import Story from './pages/Story'
import DynamicPage from './pages/DynamicPage'
import NotFound from './pages/NotFound'

import { AuthProvider } from './admin/AuthContext'
import RequireAuth from './admin/RequireAuth'
import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import Overview from './admin/Overview'
import SiteSettingsPage from './admin/SiteSettingsPage'
import ThemePage from './admin/ThemePage'
import { PageEditorRoute } from './admin/PageEditorForm'
import StoriesPage from './admin/StoriesPage'
import GalleryImagesPage from './admin/GalleryImagesPage'
import CustomPagesPage from './admin/CustomPagesPage'
import MessagesPage from './admin/MessagesPage'

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="book" element={<Book />} />
          <Route path="manifesto" element={<Manifesto />} />
          <Route path="media" element={<Media />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="stories/:id" element={<Story />} />
        </Route>

        <Route path="admin/login" element={<Login />} />
        <Route
          path="admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Overview />} />
          <Route path="settings" element={<SiteSettingsPage />} />
          <Route path="theme" element={<ThemePage />} />
          <Route path="pages/:page" element={<PageEditorRoute />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="gallery-images" element={<GalleryImagesPage />} />
          <Route path="custom-pages" element={<CustomPagesPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        {/* Admin-created extra pages live at the site root, e.g. /events */}
        <Route element={<Layout />}>
          <Route path=":slug" element={<DynamicPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
