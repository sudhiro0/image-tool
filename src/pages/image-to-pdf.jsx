import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import './ToolPage.css'
import SEO from '../components/SEO'
import { toolSchema } from '../utils/schemaHelper'

export default function PDFConverter() {
  const navigate = useNavigate()
  const seoData = {
    title: 'Free Online Image to PDF Converter - A4, Letter, A3',
    description: 'Convert images to professional PDF documents with customizable page sizes (A4, Letter, A3, A5) and scaling options.',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert image to pdf', 'online pdf converter'],
    canonical: 'https://yourdomain.com/to-pdfConverter',
    schema: toolSchema('Image to PDF Converter', 'Convert images to PDF with custom page sizes', '/to-pdfConverter')
  }
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [pageSize, setPageSize] = useState('a4')
  const [scale, setScale] = useState(100)
  const [orientation, setOrientation] = useState('portrait')
  const [converting, setConverting] = useState(false)
  const fileInputRef = useRef(null)

  const pageSizes = [
    { value: 'a4', label: 'A4 (210x297mm)', width: 210, height: 297 },
    { value: 'letter', label: 'Letter (8.5x11in)', width: 215.9, height: 279.4 },
    { value: 'a5', label: 'A5 (148x210mm)', width: 148, height: 210 },
    { value: 'a3', label: 'A3 (297x420mm)', width: 297, height: 420 },
    { value: 'custom', label: 'Custom', width: null, height: null },
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select a valid image file')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = '#f0f0f0'
  }

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'transparent'
    const files = e.dataTransfer.files
    if (files.length > 0) {
      fileInputRef.current.files = files
      handleImageUpload({ target: { files } })
    }
  }

  const convertToPDF = async () => {
    if (!preview) {
      alert('Please upload an image first')
      return
    }

    setConverting(true)
    try {
      const selectedSize = pageSizes.find(s => s.value === pageSize)
      let pdfWidth = selectedSize.width
      let pdfHeight = selectedSize.height

      // Swap dimensions for landscape
      if (orientation === 'landscape') {
        [pdfWidth, pdfHeight] = [pdfHeight, pdfWidth]
      }

      const pdf = new jsPDF({
        orientation: orientation === 'portrait' ? 'p' : 'l',
        unit: 'mm',
        format: pageSize === 'custom' ? [pdfWidth, pdfHeight] : pageSize === 'letter' ? 'letter' : pageSize,
      })

      const img = new Image()
      img.onload = () => {
        const imgWidth = img.width
        const imgHeight = img.height
        const imgAspectRatio = imgWidth / imgHeight

        // Calculate scaled dimensions
        let scaledWidth = (pdfWidth * scale) / 100
        let scaledHeight = scaledWidth / imgAspectRatio

        // If image is too tall, adjust
        if (scaledHeight > pdfHeight) {
          scaledHeight = (pdfHeight * scale) / 100
          scaledWidth = scaledHeight * imgAspectRatio
        }

        // Center the image
        const marginX = (pdfWidth - scaledWidth) / 2
        const marginY = (pdfHeight - scaledHeight) / 2

        pdf.addImage(preview, 'PNG', marginX, marginY, scaledWidth, scaledHeight)
        
        const timestamp = new Date().getTime()
        pdf.save(`image-to-pdf-${timestamp}.pdf`)
      }
      img.src = preview
    } catch (error) {
      alert('Error converting to PDF: ' + error.message)
    } finally {
      setConverting(false)
    }
  }

  return (
    <>
      <SEO {...seoData} />
      <main className="tool-container">
      <div className="tool-header">
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '8px 16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        >
          ← Back
        </button>
        <h1>📄 Image to PDF Converter</h1>
        <p>Convert images to PDF with customizable page sizes and scaling options</p>
      </div>

      <div className="tool-content">
        <section className="tool-section">
          <h2>Upload Image</h2>
          <div
            className="upload-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>
              {preview ? '✓ Image loaded' : '📁 Drag & drop image here or click to upload'}
            </p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Supported: PNG, JPEG, JPG, WebP, BMP, GIF
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </section>

        {preview && (
          <section className="tool-section">
            <h2>Preview</h2>
            <div
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={preview}
                alt="preview"
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
          </section>
        )}

        {preview && (
          <section className="tool-section">
            <h2>PDF Settings</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Page Size:
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                }}
              >
                {pageSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Orientation:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="orientation"
                    value="portrait"
                    checked={orientation === 'portrait'}
                    onChange={(e) => setOrientation(e.target.value)}
                  />
                  Portrait
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="orientation"
                    value="landscape"
                    checked={orientation === 'landscape'}
                    onChange={(e) => setOrientation(e.target.value)}
                  />
                  Landscape
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Image Scale: {scale}%
              </label>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={scale}
                onChange={(e) => setScale(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Adjust the size of the image within the PDF (10% - 200%)
              </p>
            </div>

            <button
              onClick={convertToPDF}
              disabled={converting}
              className="demo-button"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                backgroundColor: converting ? '#ccc' : '#28a745',
                cursor: converting ? 'not-allowed' : 'pointer',
              }}
            >
              {converting ? 'Converting...' : '⬇️ Convert to PDF'}
            </button>
          </section>
        )}

        {!preview && (
          <section className="tool-section">
            <h2>How to Use</h2>
            <ul>
              <li>Upload an image by dragging and dropping or clicking the upload area</li>
              <li>Select your preferred PDF page size (A4, Letter, A3, A5)</li>
              <li>Choose portrait or landscape orientation</li>
              <li>Adjust the image scale to fit your needs</li>
              <li>Click "Convert to PDF" to generate and download your PDF</li>
            </ul>
          </section>
        )}
      </div>
    </main>
    </>
  )
}
