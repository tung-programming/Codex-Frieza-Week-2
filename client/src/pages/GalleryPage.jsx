import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './GalleryPage.css'

function GalleryPage() {
  const [user, setUser] = useState({ name: 'User' })
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate checking authentication
    // In a real app, you would check if the user is authenticated
  }, [])

  const handleLogout = () => {
    // Handle logout logic
    navigate('/')
  }

  return (
    <div className="gallery-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-overlay"></div>
        <div className="floating-particles"></div>
      </div>

      {/* Header */}
      <header className="gallery-header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-text font-orbitron">PixelVault</span>
          </div>
          <nav className="gallery-nav">
            <button className="nav-btn">
              <span className="btn-icon">📸</span>
              Upload
            </button>
            <button className="nav-btn">
              <span className="btn-icon">📁</span>
              Albums
            </button>
            <button className="nav-btn">
              <span className="btn-icon">⭐</span>
              Favorites
            </button>
            <button onClick={handleLogout} className="nav-btn logout-btn">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="gallery-main">
        <div className="welcome-section">
          <h1 className="welcome-title font-orbitron">
            Welcome to Your Gallery!
          </h1>
          <p className="welcome-subtitle">
            Your digital memories are safe in the vault
          </p>
        </div>

        {/* Gallery Grid Placeholder */}
        <div className="gallery-grid">
          <div className="empty-state">
            <div className="empty-icon">📷</div>
            <h2 className="empty-title">No Images Yet</h2>
            <p className="empty-text">
              Start by uploading your first image to the vault
            </p>
            <button className="upload-btn">
              <span className="btn-icon">⬆️</span>
              Upload Your First Image
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Total Images</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Albums</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0 MB</div>
            <div className="stat-label">Storage Used</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">∞</div>
            <div className="stat-label">Memories</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GalleryPage