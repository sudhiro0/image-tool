import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import './Home.css'

export default function Home() {
  const seoData = {
    title: 'Free Online Image Processing Tools',
    description:
      'Professional image editing, conversion, and PDF creation tools. Resize, convert formats, and create PDFs from images. Fast, easy, and secure.',
    keywords: [
      'image tools',
      'image resizer',
      'image converter',
      'image to PDF',
      'online image editor',
      'free tools'
    ],
    canonical: 'https://yourdomain.com/'
  }

  return (
    <>
      <SEO {...seoData} />
      <main className="home-container">
        <div className="hero">
          <h1>Image Processing Tools - Free Online Suite</h1>
          <p>
            Professional image editing, conversion, and PDF creation tools. Fast,
            easy, and secure.
          </p>
        </div>

        <div className="tools-grid">
          <Link to="/resize" className="tool-card">
            <div className="tool-icon">🖼️</div>
            <h2>Image Resizer & Cropper</h2>
            <p>
              Resize, crop, rotate, and compress images with precision. Adjust
              dimensions, apply filters, and optimize file size instantly.
            </p>
          </Link>

          <Link to="/format-converter" className="tool-card">
            <div className="tool-icon">🔄</div>
            <h2>Image Format Converter</h2>
            <p>
              Convert images between PNG, JPEG, WebP, BMP, and more. Adjust
              quality and compress files for better performance.
            </p>
          </Link>

          <Link to="/to-pdfConverter" className="tool-card">
            <div className="tool-icon">📄</div>
            <h2>Image to PDF Converter</h2>
            <p>
              Transform images into professional PDF documents. Choose page
              sizes (A4, Letter, A3) and customize scaling easily.
            </p>
          </Link>

          <Link to="/merge-images" className="tool-card">
            <div className="tool-icon">🔀</div>
            <h2>2 in One Image</h2>
            <p>
              Merge two images vertically or horizontally to create a new
              combined image. Perfect for collages, comparisons, and creative
              compositions.
            </p>
          </Link>
        </div>
      </main>
    </>
  )
}
