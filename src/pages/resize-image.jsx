import './ToolPage.css'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { toolSchema, breadcrumbSchema } from '../utils/schemaHelper'

export default function ImageResizer() {
  const navigate = useNavigate()
  const seoData = {
    title: 'Free Online Image Resizer & Cropper Tool',
    description: 'Resize, crop, rotate, and compress images with professional controls. Adjust dimensions in pixels, apply filters, and optimize file sizes.',
    keywords: ['image resizer', 'crop image', 'rotate image', 'compress image', 'image editor'],
    canonical: 'https://yourdomain.com/resize',
    schema: toolSchema('Image Resizer', 'Professional image resizing and cropping tool', '/resize')
  }
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [fileSizeKB, setFileSizeKB] = useState(0)
  const [outputSizeKB, setOutputSizeKB] = useState(0)
  const [cropMode, setCropMode] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 })
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 })
  const [croppedArea, setCroppedArea] = useState(null)
  const [quality, setQuality] = useState(90)
  const [targetFileSize, setTargetFileSize] = useState(null)
  const canvasRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const imageRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileSizeKB((file.size / 1024).toFixed(2))
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          setWidth(img.width)
          setHeight(img.height)
          setImagePreview(event.target.result)
          setSelectedImage(img)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const drawImage = () => {
    if (!selectedImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    canvas.width = width
    canvas.height = height
    
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(selectedImage, -width / 2, -height / 2, width, height)
    ctx.restore()

    // Draw crop box if in crop mode
    if (cropMode && croppedArea) {
      ctx.strokeStyle = 'rgba(0, 123, 255, 0.8)'
      ctx.lineWidth = 2
      ctx.strokeRect(croppedArea.x, croppedArea.y, croppedArea.width, croppedArea.height)
      ctx.fillStyle = 'rgba(0, 123, 255, 0.1)'
      ctx.fillRect(croppedArea.x, croppedArea.y, croppedArea.width, croppedArea.height)
    }

    // Calculate output size based on quality
    canvas.toBlob((blob) => {
      setOutputSizeKB((blob.size / 1024).toFixed(2))
    }, 'image/jpeg', quality / 100)
  }

  const handleCropStart = (e) => {
    if (!cropMode || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    setCropStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsCropping(true)
  }

  const handleCropMove = (e) => {
    if (!isCropping || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const cropWidth = currentX - cropStart.x
    const cropHeight = currentY - cropStart.y

    setCroppedArea({
      x: cropStart.x,
      y: cropStart.y,
      width: cropWidth,
      height: cropHeight
    })
  }

  const handleCropEnd = () => {
    setIsCropping(false)
  }

  const applyCrop = () => {
    if (!selectedImage || !croppedArea || !canvasRef.current) return

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = Math.abs(croppedArea.width)
    tempCanvas.height = Math.abs(croppedArea.height)
    const tempCtx = tempCanvas.getContext('2d')

    const sourceX = Math.min(croppedArea.x, croppedArea.x + croppedArea.width)
    const sourceY = Math.min(croppedArea.y, croppedArea.y + croppedArea.height)

    tempCtx.drawImage(
      canvasRef.current,
      sourceX,
      sourceY,
      Math.abs(croppedArea.width),
      Math.abs(croppedArea.height),
      0,
      0,
      Math.abs(croppedArea.width),
      Math.abs(croppedArea.height)
    )

    setWidth(Math.abs(croppedArea.width))
    setHeight(Math.abs(croppedArea.height))
    setCropMode(false)
    setCroppedArea(null)
  }

  const compressToTargetSize = (targetKB) => {
    if (!canvasRef.current) return

    let low = 0.1
    let high = 1
    const canvas = canvasRef.current

    const tryQuality = (q) => {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob.size / 1024)
        }, 'image/jpeg', q)
      })
    }

    const findOptimalQuality = async () => {
      for (let i = 0; i < 10; i++) {
        const mid = (low + high) / 2
        const size = await tryQuality(mid)

        if (Math.abs(size - targetKB) < 5) {
          setQuality(Math.round(mid * 100))
          break
        }

        if (size > targetKB) {
          high = mid
        } else {
          low = mid
        }
      }
    }

    findOptimalQuality()
  }

  const downloadImage = () => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/jpeg', quality / 100)
    link.download = 'edited-image.jpg'
    link.click()
  }

  const resetImage = () => {
    if (selectedImage) {
      setWidth(selectedImage.width)
      setHeight(selectedImage.height)
      setRotation(0)
    }
  }

  // Update canvas whenever dimensions or rotation change
  useEffect(() => {
    drawImage()
  }, [width, height, rotation, selectedImage, cropMode, croppedArea, quality])

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
        <h1>🖼️ Image Resizer & Cropper</h1>
        <p>Resize, crop, rotate, and optimize your images with professional controls</p>
      </div>

      <div className="tool-content">
        {!selectedImage ? (
          <section className="tool-section">
            <h2>Upload Image</h2>
            <div className="upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  padding: '20px',
                  border: '2px dashed #007bff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              />
            </div>
          </section>
        ) : (
          <>
            <section className="tool-section">
              <h2>Preview & Settings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleCropStart}
                    onMouseMove={handleCropMove}
                    onMouseUp={handleCropEnd}
                    onMouseLeave={handleCropEnd}
                    style={{
                      border: cropMode ? '2px solid #007bff' : '1px solid #ddd',
                      maxWidth: '100%',
                      borderRadius: '8px',
                      cursor: cropMode ? 'crosshair' : 'default'
                    }}
                  />
                  {cropMode && (
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      Click and drag to select crop area
                    </p>
                  )}
                </div>

                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      <strong>Width (px):</strong>
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value) || 100)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      <strong>Height (px):</strong>
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      <strong>Rotate (degrees):</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <p style={{ margin: '5px 0' }}>{rotation}°</p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      <strong>Quality (Compression):</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <p style={{ margin: '5px 0' }}>{quality}%</p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      <strong>Target File Size (KB):</strong>
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="number"
                        value={targetFileSize || ''}
                        placeholder="Enter KB"
                        onChange={(e) => setTargetFileSize(parseInt(e.target.value) || null)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <button
                        onClick={() => targetFileSize && compressToTargetSize(targetFileSize)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Compress
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Original Size:</strong> {fileSizeKB} KB
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Output Size:</strong> {outputSizeKB} KB
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="tool-section">
              <h2>Actions</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setCropMode(!cropMode)
                    if (cropMode) {
                      setCroppedArea(null)
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: cropMode ? '#ff6b6b' : '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {cropMode ? 'Cancel Crop' : '✂️ Crop'}
                </button>

                {cropMode && croppedArea && (
                  <button
                    onClick={applyCrop}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Apply Crop
                  </button>
                )}

                <button
                  onClick={resetImage}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>

                <button
                  onClick={downloadImage}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ⬇️ Download
                </button>

                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview(null)
                    setRotation(0)
                    setCropMode(false)
                    setCroppedArea(null)
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove Image
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
