import { Link, useLocation } from 'react-router-dom'
import './Breadcrumb.css'

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const breadcrumbPaths = {
    resize: 'Image Resizer',
    'format-converter': 'Format Converter',
    'to-pdfConverter': 'PDF Converter',
    'merge-images': 'Merge Images'
  }

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((path, index) => {
          const routePath = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          const label = breadcrumbPaths[path] || path

          return (
            <li key={routePath}>
              {isLast ? (
                <span>{label}</span>
              ) : (
                <>
                  <Link to={routePath}>{label}</Link>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
