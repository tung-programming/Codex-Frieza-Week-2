import React, { useEffect, useState } from 'react';
import AnimatedBackground from './AnimatedBackground';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main heading */}
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: 'var(--text)' }}
        >
          <span className="block">Revamped</span>
          <span 
            className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            Media Gallery
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: 'var(--text-muted)' }}
        >
          From legacy PHP gallery → to a modern, extensible media platform.
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            className="w-full sm:w-auto px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 glow-effect transform hover:scale-105"
            style={{ 
              backgroundColor: 'var(--accent)',
              color: 'white',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--accent-hover)';
              e.target.style.transform = 'scale(1.05) translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--accent)';
              e.target.style.transform = 'scale(1) translateY(0)';
            }}
          >
            Sign Up Free
          </button>
          
          <button
            className="w-full sm:w-auto px-8 py-4 rounded-lg text-lg font-semibold border-2 transition-all duration-300 transform hover:scale-105"
            style={{ 
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text)',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.color = 'var(--accent)';
              e.target.style.transform = 'scale(1.05) translateY(-2px)';
              e.target.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--text)';
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Login
          </button>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Scroll to explore
            </span>
            <div 
              className="w-6 h-10 border-2 rounded-full flex justify-center animate-float"
              style={{ borderColor: 'var(--border)' }}
            >
              <div 
                className="w-1 h-3 rounded-full mt-2"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-4 w-2 h-16 rounded-full opacity-20 animate-float" 
           style={{ 
             backgroundColor: 'var(--accent)',
             animationDelay: '1s'
           }} 
      />
      <div className="absolute bottom-40 right-8 w-3 h-3 rounded-full opacity-30 animate-float" 
           style={{ 
             backgroundColor: 'var(--primary)',
             animationDelay: '3s'
           }} 
      />
    </section>
  );
};

export default HeroSection;