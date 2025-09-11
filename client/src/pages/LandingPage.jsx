import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">PixelVault</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
            <Link to="/auth" className="nav-link nav-link-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Memories,
              <span className="hero-title-accent"> Beautifully Organized</span>
            </h1>
            <p className="hero-subtitle">
              Transform your photo collection into a stunning digital gallery. 
              Secure, fast, and beautifully designed for the modern web.
            </p>
            <div className="hero-buttons">
              <Link to="/auth?mode=signup" className="btn btn-primary">
                Sign Up
              </Link>
              <Link to="/auth?mode=login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <div className="floating-card card-1"></div>
              <div className="floating-card card-2"></div>
              <div className="floating-card card-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3 className="feature-title">Smart Organization</h3>
              <p className="feature-description">
                AI-powered tagging and categorization makes finding your photos effortless
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Storage</h3>
              <p className="feature-description">
                Your memories are encrypted and protected with enterprise-grade security
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Optimized performance ensures your gallery loads instantly, every time
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Beautiful Themes</h3>
              <p className="feature-description">
                Customize your gallery with stunning themes and layouts
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Ready</h3>
              <p className="feature-description">
                Access your gallery from any device with our responsive design
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Auto Sync</h3>
              <p className="feature-description">
                Seamlessly sync your photos across all your devices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">PixelVault</h3>
              <p className="footer-text">
                The modern way to store and showcase your digital memories.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-subtitle">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><Link to="/auth">Get Started</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-subtitle">Connect</h4>
              <div className="social-links">
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">GitHub</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 PixelVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage