import { useState } from 'react';
import { Link } from 'react-router-dom'
import './LandingPage.css'


function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
};
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
  <div className="nav-container">
    <div className="nav-brand">
      <span className="brand-text">PIXELVAULT</span>
    </div>
    
    <button 
      className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
      onClick={toggleMobileMenu}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    
    <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
      <a href="#home" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
      <a href="#features" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
      <a href="#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</a>
      <Link to="/auth" className="nav-link nav-link-primary" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
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
      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="section-title">About PixelVault</h2>
          <div className="about-content">
            <div className="about-intro">
              <p className="about-description">
                PixelVault is a full-stack, modern, and extensible image gallery web application 
                built to replace legacy systems. We've created a secure, scalable solution that 
                transforms how you store and showcase your digital memories.
              </p>
            </div>
            
            <div className="about-grid">
              <div className="about-card">
                <h3 className="about-card-title">🏗️ Modern Architecture</h3>
                <p className="about-card-text">
                  Built with a decoupled frontend and backend architecture for better 
                  maintainability and scalability. Our Node.js backend API powers a 
                  dynamic React frontend for optimal performance.
                </p>
              </div>
              
              <div className="about-card">
                <h3 className="about-card-title">🔧 Cutting-Edge Tech Stack</h3>
                <ul className="tech-list">
                  <li><strong>Backend:</strong> Node.js, Express.js</li>
                  <li><strong>Frontend:</strong> React with Vite</li>
                  <li><strong>Database:</strong> PostgreSQL</li>
                  <li><strong>Authentication:</strong> JWT Tokens</li>
                  <li><strong>Processing:</strong> Sharp & Multer</li>
                </ul>
              </div>
              
              <div className="about-card">
                <h3 className="about-card-title">⚡ Advanced Features</h3>
                <ul className="feature-list">
                  <li>Secure JWT-based authentication system</li>
                  <li>Drag-and-drop file uploader with multi-image support</li>
                  <li>Automatic thumbnail generation and EXIF data extraction</li>
                  <li>Album creation and management tools</li>
                  <li>Flexible privacy controls (public, private, unlisted)</li>
                  <li>Fully responsive design across all devices</li>
                </ul>
              </div>
              
              <div className="about-card">
                <h3 className="about-card-title">🚀 Built for Scale</h3>
                <p className="about-card-text">
                  Our application is designed with scalability in mind. From secure 
                  user authentication to efficient image processing, every component 
                  is optimized for performance and reliability.
                </p>
              </div>
            </div>
            
            <div className="about-mission">
              <h3 className="mission-title">Our Mission</h3>
              <p className="mission-text">
                We believe your memories deserve better than outdated, clunky systems. 
                PixelVault represents the future of digital photo management - secure, 
                beautiful, and built for the modern web.
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