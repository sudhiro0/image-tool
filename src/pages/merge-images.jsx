import './ToolPage.css'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { toolSchema } from '../utils/schemaHelper'

export default function MergeImages() {
  const navigate = useNavigate()
  const seoData = {
    title: 'Free Online Image Merger - Combine Photos Side by Side',
    description: 'Merge two images vertically or horizontally to create a new combined image. Perfect for collages, comparisons, and creative compositions.',
    keywords: ['merge images', 'combine images', 'image collage', 'photo merger', 'image combiner'],
    canonical: 'https://yourdomain.com/merge-images',
    schema: toolSchema('Image Merger', 'Combine two images into one', '/merge-images')
  }
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [preview1, setPreview1] = useState(null)
  const [preview2, setPreview2] = useState(null)
  const [mergeMode, setMergeMode] = useState('vertical')
  const [spacing, setSpacing] = useState(0)
  const [bgColor, setBgColor] = useState('#ffffff')
  const canvasRef = useRef(null)

  const handleImageUpload1 = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          setImage1(img)
          setPreview1(event.target.result)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload2 = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          setImage2(img)
          setPreview2(event.target.result)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const mergeImages = () => {
    if (!image1 || !image2 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (mergeMode === 'vertical') {
      canvas.width = Math.max(image1.width, image2.width)
      canvas.height = image1.height + image2.height + spacing

      // Fill background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw images
      const offset1 = (canvas.width - image1.width) / 2
      const offset2 = (canvas.width - image2.width) / 2

      ctx.drawImage(image1, offset1, 0)
      ctx.drawImage(image2, offset2, image1.height + spacing)
    } else {
      canvas.width = image1.width + image2.width + spacing
      canvas.height = Math.max(image1.height, image2.height)

      // Fill background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw images
      const offset1 = (canvas.height - image1.height) / 2
      const offset2 = (canvas.height - image2.height) / 2

      ctx.drawImage(image1, 0, offset1)
      ctx.drawImage(image2, image1.width + spacing, offset2)
    }
  }

  const downloadMerged = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'merged-image.png'
    link.click()
  }

  const resetAll = () => {
    setImage1(null)
    setImage2(null)
    setPreview1(null)
    setPreview2(null)
    setSpacing(0)
    setMergeMode('vertical')
  }

  useEffect(() => {
    if (image1 && image2) {
      mergeImages()
    }
  }, [image1, image2, mergeMode, spacing, bgColor])

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
        <h1>🔀 2 in One Image</h1>
        <p>Merge two images vertically or horizontally to create a new combined image</p>
      </div>

      <div className="tool-content">
        <section className="tool-section">
          <h2>Upload Images</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Image 1
              </label>
              <div
                style={{
                  padding: '20px',
                  border: '2px dashed #007bff',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload1}
                  style={{ display: 'none' }}
                  id="upload1"
                />
                <label htmlFor="upload1" style={{ cursor: 'pointer', display: 'block' }}>
                  {preview1 ? (
                    <img src={preview1} alt="Preview 1" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }} />
                  ) : (
                    <div>
                      <p style={{ margin: '10px 0' }}>📤 Click to upload first image</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>or drag and drop</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Image 2
              </label>
              <div
                style={{
                  padding: '20px',
                  border: '2px dashed #28a745',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload2}
                  style={{ display: 'none' }}
                  id="upload2"
                />
                <label htmlFor="upload2" style={{ cursor: 'pointer', display: 'block' }}>
                  {preview2 ? (
                    <img src={preview2} alt="Preview 2" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }} />
                  ) : (
                    <div>
                      <p style={{ margin: '10px 0' }}>📤 Click to upload second image</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>or drag and drop</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </section>

        {image1 && image2 && (
          <>
            <section className="tool-section">
              <h2>Merge Settings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Merge Mode
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setMergeMode('vertical')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: mergeMode === 'vertical' ? '#007bff' : '#e0e0e0',
                        color: mergeMode === 'vertical' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ⬇️ Vertical
                    </button>
                    <button
                      onClick={() => setMergeMode('horizontal')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: mergeMode === 'horizontal' ? '#007bff' : '#e0e0e0',
                        color: mergeMode === 'horizontal' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ➡️ Horizontal
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Spacing (px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={spacing}
                    onChange={(e) => setSpacing(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Background Color (for spacing)
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{
                    width: '50px',
                    height: '40px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </section>

            <section className="tool-section">
              <h2>Preview</h2>
              <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            </section>

            <section className="tool-section">
              <h2>Actions</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={downloadMerged}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ⬇️ Download Merged Image
                </button>

                <button
                  onClick={resetAll}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
    </>
  )
}
