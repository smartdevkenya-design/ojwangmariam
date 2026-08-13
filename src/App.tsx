import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Book from './pages/Book'
import Manifesto from './pages/Manifesto'
import Media from './pages/Media'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Story from './pages/Story'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="book" element={<Book />} />
        <Route path="manifesto" element={<Manifesto />} />
        <Route path="media" element={<Media />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="stories/:id" element={<Story />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
