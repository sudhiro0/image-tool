import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ToolPage.css'
import SEO from '../components/SEO'
import { toolSchema } from '../utils/schemaHelper'

export default function FormatConverter() {
  const navigate = useNavigate()
  const seoData = {
    title: 'Free Online Image Format Converter - PNG, JPEG, WebP',
    description: 'Convert images between PNG, JPEG, JPG, WebP, BMP, and more formats. Adjust quality settings and optimize file sizes.',
    keywords: ['png converter', 'jpeg converter', 'webp converter', 'image format converter', 'image conversion'],
    canonical: 'https://yourdomain.com/format-converter',
    schema: toolSchema('Image Format Converter', 'Convert between multiple image formats', '/format-converter')
  }
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState('png')
  const [quality, setQuality] = useState(0.9)
  const [converting, setConverting] = useState(false)
  const fileInputRef = useRef(null)

  const formats = [
    { value: 'png', label: 'PNG', type: 'image/png' },
    { value: 'jpeg', label: 'JPEG', type: 'image/jpeg' },
    { value: 'jpg', label: 'JPG', type: 'image/jpeg' },
    { value: 'webp', label: 'WebP', type: 'image/webp' },
    { value: 'bmp', label: 'BMP', type: 'image/bmp' },
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

  const convertImage = async () => {
    if (!preview) {
      alert('Please upload an image first')
      return
    }

    setConverting(true)
    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        const format = formats.find(f => f.value === selectedFormat)
        const mimeType = format.type

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              const timestamp = new Date().getTime()
              link.href = url
              link.download = `converted-${timestamp}.${selectedFormat}`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }
          },
          mimeType,
          selectedFormat === 'png' ? undefined : quality
        )
      }
      img.src = preview
    } catch (error) {
      alert('Error converting image: ' + error.message)
    } finally {
      setConverting(false)
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
        <h1>🔄 Image Format Converter</h1>
        <p>Convert images to PNG, JPEG, WebP, BMP and more formats with custom quality</p>
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
            <h2>Convert Settings</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Select Format:
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                }}
              >
                {formats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedFormat !== 'png' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <button
              onClick={convertImage}
              disabled={converting}
              className="demo-button"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                backgroundColor: converting ? '#ccc' : '#007bff',
                cursor: converting ? 'not-allowed' : 'pointer',
              }}
            >
              {converting ? 'Converting...' : '⬇️ Convert & Download'}
            </button>
          </section>
        )}

        {!preview && (
          <section className="tool-section">
            <h2>How to Use</h2>
            <ul>
              <li>Upload an image by dragging and dropping or clicking the upload area</li>
              <li>Select your desired output format (PNG, JPEG, WebP, etc.)</li>
              <li>Adjust quality settings for lossy formats</li>
              <li>Click "Convert & Download" to save your converted image</li>
            </ul>
          </section>
        )}
      </div>
    </main>
    </>
  )
}
