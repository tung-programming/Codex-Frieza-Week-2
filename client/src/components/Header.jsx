import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="#" 
              className="flex items-center space-x-2 text-xl font-bold transition-colors duration-300"
              style={{ color: 'var(--text)' }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
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
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:glow-effect"
                  style={{ 
                    color: 'var(--text)',
                    ':hover': { color: 'var(--accent)' }
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text)'}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 border"
              style={{ 
                color: 'var(--text)',
                borderColor: 'var(--border)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--overlay)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 glow-effect"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary-hover)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--primary)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300"
              style={{ color: 'var(--text)' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--overlay)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div 
            className="px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                style={{ 
                  color: 'var(--text)',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--overlay)';
                  e.target.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text)';
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            
            <div className="pt-4 pb-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex flex-col space-y-2">
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 border"
                  style={{ 
                    color: 'var(--text)',
                    borderColor: 'var(--border)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--overlay)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Sign In
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;