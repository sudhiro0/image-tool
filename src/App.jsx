import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Breadcrumb from './components/Breadcrumb'
import Home from './pages/Home'
import ImageResizer from './pages/resize-image'
import FormatConverter from './pages/format-converter'
import PDFConverter from './pages/image-to-pdf'
import MergeImages from './pages/merge-images'
import './App.css'

function App() {
  return (
    <Router>
      <Navigation />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resize" element={<ImageResizer />} />
        <Route path="/format-converter" element={<FormatConverter />} />
        <Route path="/to-pdfConverter" element={<PDFConverter />} />
        <Route path="/merge-images" element={<MergeImages />} />
        {/* Backwards compatibility routes */}
        <Route path="/tool1" element={<ImageResizer />} />
        <Route path="/tool2" element={<FormatConverter />} />
        <Route path="/tool3" element={<PDFConverter />} />
        <Route path="/tool4" element={<MergeImages />} />
      </Routes>
    </Router>
  )
}

export default App
