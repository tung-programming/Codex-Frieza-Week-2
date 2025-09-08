import React, { useState, useEffect } from 'react';
import { Menu, X, Github, ExternalLink } from 'lucide-react';

// AnimatedBackground Component
const AnimatedBackground = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" 
           style={{
             backgroundSize: '400% 400%',
             animation: 'gradientShift 15s ease infinite'
           }} />
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400/10 rounded-full animate-pulse" 
           style={{ animationDelay: '0s', animationDuration: '6s' }} />
      
      <div className="absolute top-1/2 right-20 w-24 h-24 bg-slate-400/10 rounded-full animate-pulse" 
           style={{ animationDelay: '2s', animationDuration: '8s' }} />
      
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-cyan-400/5 rounded-full animate-pulse" 
           style={{ animationDelay: '4s', animationDuration: '10s' }} />
    </div>
  );
};

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#docs', label: 'Docs' },
    { href: '#roadmap', label: 'Roadmap' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center space-x-2 text-xl font-bold text-slate-800">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span>Gallery</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all duration-300">
              Sign In
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300">
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 pb-2 border-t border-slate-200">
                <div className="flex flex-col space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all duration-300">
                    Sign In
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// FeatureCard Component
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative p-6 bg-white rounded-xl border border-slate-200 shadow-md transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:border-cyan-300`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-all duration-300 ${
          isHovered ? 'bg-cyan-500 scale-110 rotate-3' : 'bg-slate-100'
        }`}>
          <span className="text-2xl">{icon}</span>
        </div>

        <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
          isHovered ? 'text-cyan-600' : 'text-slate-800'
        }`}>
          {title}
        </h3>

        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>

        {isHovered && (
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Revamped Gallery</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              A modern, extensible media platform built to replace legacy PHP galleries with cutting-edge technology.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-800">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '#about', label: 'About' },
                { href: '#docs', label: 'Documentation' },
                { href: '#roadmap', label: 'Roadmap' },
                { href: '#features', label: 'Features' }
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-600 hover:text-cyan-600 transition-colors duration-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-800">Project Info</h4>
            <div className="space-y-3">
              <a
                href="https://github.com/your-repo/revamped-gallery"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-slate-600 hover:text-cyan-600 transition-colors duration-300 group"
              >
                <Github size={16} />
                <span>GitHub Repository</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="text-sm text-slate-600">Built for CloneFest 2025</div>
              <div className="text-sm text-slate-600">Licensed under MIT</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-slate-600 text-center md:text-left">
            © {currentYear} Revamped Gallery. Built with ❤️ for modern web.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <a href="#privacy" className="text-slate-600 hover:text-cyan-600 transition-colors duration-300">
              Privacy Policy
            </a>
            <span className="text-slate-300">|</span>
            <a href="#terms" className="text-slate-600 hover:text-cyan-600 transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    // Trigger hero animation
    const timer = setTimeout(() => setIsHeroVisible(true), 100);
    
    // Intersection observer for sections
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Perfect experience across all devices. From mobile phones to desktop displays, your gallery adapts seamlessly.'
    },
    {
      icon: '🏷️',
      title: 'Albums & Collections',
      description: 'Organize your media with smart albums, tags, and collections. Advanced filtering and search capabilities included.'
    },
    {
      icon: '🔒',
      title: 'Secure Uploads',
      description: 'Enterprise-grade security with encrypted uploads, user authentication, and granular permission controls.'
    },
    {
      icon: '⚡',
      title: 'Bonus Features',
      description: 'AI-powered image generation, intelligent palette extraction, vector similarity search, and theme customization.'
    }
  ];

  const isVisible = (sectionId) => visibleSections.has(sectionId);

  return (
    <div className="min-h-screen bg-slate-50">
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        html { scroll-behavior: smooth; }
      `}</style>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AnimatedBackground />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 transition-all duration-1000 ${
            isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="block text-slate-800">Revamped</span>
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Media Gallery
            </span>
          </h1>

          <p className={`text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-slate-600 transition-all duration-1000 delay-200 ${
            isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            From legacy PHP gallery → to a modern, extensible media platform.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 ${
            isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button className="w-full sm:w-auto px-8 py-4 bg-cyan-500 text-white rounded-lg text-lg font-semibold hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-w-[160px]">
              Sign Up Free
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border-2 border-slate-300 rounded-lg text-lg font-semibold hover:border-cyan-500 hover:text-cyan-600 transition-all duration-300 transform hover:scale-105 min-w-[160px]">
              Login
            </button>
          </div>

          {/* Scroll indicator */}
          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-600 ${
            isHeroVisible ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm font-medium text-slate-500">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center animate-bounce">
                <div className="w-1 h-3 bg-cyan-500 rounded-full mt-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" data-section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto max-w-6xl">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-800">
              Modern Features for
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Modern Galleries
              </span>
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600">
              Built from the ground up with cutting-edge technology to provide the best media management experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 100}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" data-section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${
              isVisible('about') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-800">
                Transforming Media Management
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-slate-600">
                This project represents a complete modernization of traditional PHP-based image galleries. 
                Built with React, Node.js, and PostgreSQL, it offers unprecedented performance, 
                scalability, and user experience.
              </p>
              <p className="text-lg leading-relaxed mb-8 text-slate-600">
                From simple photo sharing to advanced media workflows, our platform grows with your needs. 
                Whether you're a photographer, designer, or content creator, you'll find tools that enhance 
                your creative process.
              </p>
              <div className="flex flex-wrap gap-4">
                {['React + Vite', 'Node.js + Express', 'PostgreSQL'].map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-200 ${
              isVisible('about') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="relative bg-slate-100 rounded-2xl p-8 h-80 flex items-center justify-center overflow-hidden">
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl text-white">🖼️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Gallery Illustration</h3>
                  <p className="text-sm text-slate-600">Placeholder for future interactive demo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section id="docs" data-section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className={`transition-all duration-1000 ${
            isVisible('docs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-800">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-slate-600">
              Comprehensive documentation, API references, and step-by-step guides to help you 
              integrate and customize your media gallery experience.
            </p>
            <button className="px-8 py-4 bg-slate-800 text-white rounded-lg text-lg font-semibold hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" data-section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className={`transition-all duration-1000 ${
            isVisible('roadmap') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-800">What's Coming Next</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-slate-600">
              We're constantly evolving. Check out our roadmap to see upcoming features, 
              performance improvements, and community-requested enhancements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'AI Integration', status: 'In Progress' },
                { title: 'Mobile App', status: 'Planned' },
                { title: 'Advanced Analytics', status: 'Research' }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold mb-2 text-slate-800">{item.title}</h4>
                  <span className="px-3 py-1 bg-cyan-500 text-white rounded-full text-xs font-medium">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="px-8 py-4 bg-white text-slate-800 border-2 border-slate-300 rounded-lg text-lg font-semibold hover:border-cyan-500 hover:text-cyan-600 transition-all duration-300 transform hover:scale-105">
              View Full Roadmap
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;