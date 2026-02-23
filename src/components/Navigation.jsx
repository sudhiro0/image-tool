import { Link } from 'react-router-dom'
import './Navigation.css'

export default function Navigation() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="Image Tools - Home">
          🛠️ Image Tools
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/resize" className="nav-link">Resizer</Link>
          </li>
          <li className="nav-item">
            <Link to="/format-converter" className="nav-link">Format</Link>
          </li>
          <li className="nav-item">
            <Link to="/to-pdfConverter" className="nav-link">PDF</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
