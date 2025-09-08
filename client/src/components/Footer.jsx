import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="border-t py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: 'var(--text)' }}
              >
                Revamped Gallery
              </span>
            </div>
            <p 
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              A modern, extensible media platform built to replace legacy PHP galleries with cutting-edge technology.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '#about', label: 'About' },
                { href: '#docs', label: 'Documentation' },
                { href: '#roadmap', label: 'Roadmap' },
                { href: '#features', label: 'Features' }
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info Section */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Project Info
            </h4>
            <div className="space-y-3">
              <a
                href="https://github.com/your-repo/revamped-gallery"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm transition-all duration-300 hover:translate-x-1 group"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                <Github size={16} />
                <span>GitHub Repository</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <div 
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Built for CloneFest 2025
              </div>
              
              <div 
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Licensed under MIT
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
             style={{ borderColor: 'var(--border)' }}>
          <p 
            className="text-sm text-center md:text-left"
            style={{ color: 'var(--text-muted)' }}
          >
            © {currentYear} Revamped Gallery. Built with ❤️ for modern web.
          </p>
          
          <div className="flex items-center space-x-4 text-sm">
            <a
              href="#privacy"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              Privacy Policy
            </a>
            <span style={{ color: 'var(--border)' }}>|</span>
            <a
              href="#terms"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              Terms of Service
            </a>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full opacity-20"
             style={{ backgroundColor: 'var(--accent)' }} />
      </div>
    </footer>
  );
};

export default Footer;