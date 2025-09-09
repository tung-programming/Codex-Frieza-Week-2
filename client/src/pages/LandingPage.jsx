import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Style constants
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.6,
      color: '#111',
      backgroundColor: '#f5f5f5',
      margin: 0,
      padding: 0,
    },
    navbar: {
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: 'rgba(245, 245, 245, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      padding: '1rem 0',
      borderBottom: '1px solid rgba(51, 51, 51, 0.1)',
      transition: 'all 0.3s ease',
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
      textDecoration: 'none',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navLink: {
      color: '#333',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
    },
    hamburger: {
      display: 'none',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#333',
    },
    section: {
      padding: '4rem 1rem',
      maxWidth: '100%',
      margin: '0 auto',
    },
    hero: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      position: 'relative',
      overflow: 'hidden',
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '700',
      margin: '0 0 1rem 0',
      background: 'linear-gradient(135deg, #333 0%, #00bcd4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'fadeInUp 1s ease-out',
    },
    heroSubtitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
      color: '#666',
      margin: '0 0 2rem 0',
      maxWidth: '600px',
      animation: 'fadeInUp 1s ease-out 0.2s both',
    },

    ctaContainer: {
      display: 'flex',
      gap: '1rem',
      flexDirection : 'column',
      alignItems : 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      animation: 'fadeInUp 1s ease-out 0.4s both',
    },
    btnPrimary: {
      backgroundColor: '#333',
      color: 'white',
      padding: '0.75rem 2rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.2rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      zIndex : '10',
    },
    btnSecondary: {
      backgroundColor: '#333',
      color: 'white',
      padding: '0.75rem 2rem',
      border: '2px solid #333',
      borderRadius: '8px',
      fontSize: '1.2rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      zIndex : '10',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      marginTop: '3rem',
    },
    featureCard: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    sectionTitle: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: '700',
      width : '100%',
      textAlign: 'center',
      marginBottom: '1rem',
      color: '#333',
    },
    sectionSubtitle: {
      fontSize: '1.2rem',
      textAlign: 'center',
      color: '#666',
      marginBottom: '3rem',
      maxWidth: '600px',
      margin: '0 auto 3rem auto',
    },
    roadmapGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '3rem',
    },
    roadmapItem: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      marginTop: '0.5rem',
    },
    footer: {
      backgroundColor: '#222',
      color: '#ccc',
      padding: '3rem 1rem 2rem',
      textAlign: 'center',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
    },
    footerLink: {
      color: '#ccc',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
    techTags: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '2rem',
    },
    techTag: {
      backgroundColor: '#00bcd4',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    orb: {
      position: 'absolute',
      borderRadius: '50%',
      opacity: 0.1,
      animation: 'float 9s ease-in-out infinite',
    },
  };

  const features = [
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Perfect experience across all devices - mobile, tablet, and desktop.'
    },
    {
      icon: '📚',
      title: 'Albums & Collections',
      description: 'Organize your media with smart albums and custom collections.'
    },
    {
      icon: '🔒',
      title: 'Secure Uploads',
      description: 'Enterprise-grade security with encrypted storage and access controls.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance with modern web technologies and CDN delivery.'
    }
  ];

  const roadmapItems = [
    {
      title: 'AI Integration',
      description: 'Smart tagging, content recognition, and automated organization.',
      status: 'In Progress',
      statusColor: '#00bcd4'
    },
    {
      title: 'Mobile App',
      description: 'Native iOS and Android apps with offline capabilities.',
      status: 'Planned',
      statusColor: '#ff9800'
    },
    {
      title: 'Advanced Analytics',
      description: 'Detailed insights into media usage and engagement patterns.',
      status: 'Research',
      statusColor: '#9c27b0'
    }
  ];

  return (
    <div style={styles.container}>
      <style>
        {`.
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(10px) rotate(240deg); }
          }
          @media (max-width: 768px) {
            .nav-links { display: none !important; }
            .hamburger { display: block !important; }
            .mobile-menu {
              position: absolute;
              top: 100%;
              left: 0;
              width: 100%;
              background: rgba(245, 245, 245, 0.98);
              backdrop-filter: blur(10px);
              padding: 1rem;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .mobile-menu-links {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              align-items: center;
            }
            
            .cta-container-mobile {
              flex-direction: column;
              align-items: center;
            }
            .cta-container-mobile > * {
              width: 100%;
              max-width: 280px;
              text-align: center;
            }
            .features-grid-mobile {
              grid-template-columns: 1fr;
            }
            .roadmap-grid-mobile {
              grid-template-columns: 1fr;
            }
          }
          .btn-primary:hover {
            background-color: #00bcd4;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 188, 212, 0.3);
          }
          .btn-secondary:hover {
            background-color: #00bcd4;
            border-color: #00bcd4;
            color: white;
            transform: translateY(-2px);
          }
          .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
            border-color: #00bcd4;
          }
          .nav-link:hover {
            color: #00bcd4;
          }
          .footer-link:hover {
            color: #00bcd4;
          }
          .section-fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
          }
          .section-fade-in.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .cta-container-mobile {
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  display: flex;
}
.cta-container-mobile > * {
  width: 100%;
  max-width: 280px;
  text-align: center;
  display: block;
  margin: 0 auto;
}
        `}
      </style>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <a href="#" style={styles.logo}>ImageGallery-Revamp</a>
          <ul className="nav-links" style={styles.navLinks}>
            <li><a style={styles.navLink} className="nav-link" onClick={() => scrollToSection('about')}>About</a></li>
            <li><a style={styles.navLink} className="nav-link" onClick={() => scrollToSection('docs')}>Docs</a></li>
            <li><a style={styles.navLink} className="nav-link" onClick={() => scrollToSection('roadmap')}>Roadmap</a></li>
            <li><a href = "/signup" style={{...styles.navLink, ...styles.btnPrimary, padding: '0.5rem 1rem'}} className="btn-primary">Sign Up</a></li>
            <li><a href = "/login" style={{...styles.navLink, ...styles.btnSecondary, padding: '0.5rem 1rem'}} className="btn-secondary">Login</a></li>
          </ul>
          <button 
            className="hamburger"
            style={styles.hamburger} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-links">
                <a style={styles.navLink} className="nav-link" onClick={() => scrollToSection('about')}>About</a>
                <a style={styles.navLink} className="nav-link" onClick={() => scrollToSection('docs')}>Docs</a>
                <a style={styles.navLink} className="nav-link" onClick={() => scrollToSection('roadmap')}>Roadmap</a>
                <a href = "/signup" style={{...styles.btnPrimary, width: '200px', textAlign: 'center'}} className="btn-primary">Sign Up</a>
                <a href = "/login" style={{...styles.btnSecondary, width: '200px', textAlign: 'center'}} className="btn-secondary">Login</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero} id="hero">
        <div className="cta-container-mobile" style={{...styles.ctaContainer, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}></div>
        <div style={{...styles.orb, width: '200px', height: '200px', background: 'linear-gradient(45deg, #00bcd4, #333)', top: '20%', left: '10%'}}></div>
        <div style={{...styles.orb, width: '150px', height: '150px', background: 'linear-gradient(45deg, #333, #00bcd4)', top: '60%', right: '15%', animationDelay: '2s'}}></div>
        <div style={{...styles.orb, width: '100px', height: '100px', background: 'linear-gradient(45deg, #00bcd4, #f5f5f5)', bottom: '30%', left: '20%', animationDelay: '4s'}}></div>
        
        <h1 style={styles.heroTitle}>
          Revamped <span style={{background: 'linear-gradient(135deg, #00bcd4, #333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Media Gallery</span>
        </h1>
        <p style={styles.heroSubtitle}>
          From legacy PHP gallery → to a modern, extensible media platform.
        </p>
        <div className="cta-container-mobile" style={styles.ctaContainer}>
          <a href = "/signup" style={styles.btnPrimary} className="btn-primary">Sign Up</a>
          <a href = "/login" style={styles.btnSecondary} className="btn-secondary">Login</a>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section} id="features" >
        <h2 style={styles.sectionTitle}>Powerful Features</h2>
        <p style={styles.sectionSubtitle}>Everything you need for modern media management</p>
        <div className="features-grid-mobile" style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard} className="feature-card">
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={{margin: '0 0 1rem 0', fontSize: '1.3rem', color: '#333'}}>{feature.title}</h3>
              <p style={{margin: 0, color: '#666', fontSize: '0.95rem'}}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section style={styles.section} id="about">
        <h2 style={styles.sectionTitle}>Transforming Media Management</h2>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1.5rem', color: '#555'}}>
            Born from the need to modernize legacy systems, our platform represents a complete transformation from outdated PHP galleries to a cutting-edge, scalable solution built for today's digital landscape.
          </p>
          <p style={{fontSize: '1.1rem', marginBottom: '1.5rem', color: '#555'}}>
            We've reimagined every aspect of media management - from intuitive user interfaces to robust backend architecture - ensuring your content is not just stored, but truly organized, secured, and accessible across all devices.
          </p>
          <p style={{fontSize: '1.1rem', marginBottom: '2rem', color: '#555'}}>
            Experience the power of modern web technologies combined with thoughtful design, creating a platform that grows with your needs and adapts to tomorrow's challenges.
          </p>
          <div style={styles.techTags}>
            <span style={styles.techTag}>React + Vite</span>
            <span style={styles.techTag}>Node.js + Express</span>
            <span style={styles.techTag}>PostgreSQL</span>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section style={{...styles.section, backgroundColor: 'white', margin: '0', padding: '4rem 1rem'}} id="docs">
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={styles.sectionTitle}>Ready to Get Started?</h2>
          <p style={styles.sectionSubtitle}>
            Comprehensive documentation, API references, and step-by-step guides to help you build amazing experiences.
          </p>
          <a style={{...styles.btnPrimary, fontSize: '1.1rem', padding: '1rem 2.5rem'}} className="btn-primary">
            View Documentation
          </a>
        </div>
      </section>

      {/* Roadmap Section */}
      <section style={styles.section} id="roadmap">
        <h2 style={styles.sectionTitle}>What's Coming Next</h2>
        <p style={styles.sectionSubtitle}>Our vision for the future of media management</p>
        <div className="roadmap-grid-mobile" style={styles.roadmapGrid}>
          {roadmapItems.map((item, index) => (
            <div key={index} style={styles.roadmapItem}>
              <h3 style={{margin: '0 0 1rem 0', fontSize: '1.4rem', color: '#333'}}>{item.title}</h3>
              <p style={{margin: '0 0 1rem 0', color: '#666', fontSize: '0.95rem'}}>{item.description}</p>
              <span style={{...styles.statusBadge, backgroundColor: item.statusColor, color: 'white'}}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '3rem', width: '100%', display: 'flex', justifyContent: 'center'}}>
          <a style={{...styles.btnSecondary, fontSize: '1.1rem', padding: '1rem 2.5rem'}} className="btn-secondary">
            View Full Roadmap
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div className="footer-links-mobile" style={styles.footerLinks}>
            <a href="#" style={styles.footerLink} className="footer-link">GitHub</a>
            <a href="#" style={styles.footerLink} className="footer-link">Documentation</a>
            <a href="#" style={styles.footerLink} className="footer-link">Roadmap</a>
          </div>
          <p style={{margin: 0, fontSize: '0.9rem', color: '#888'}}>
            © 2025 Revamped Media Gallery. Built with ❤️ for Clone Fest.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;