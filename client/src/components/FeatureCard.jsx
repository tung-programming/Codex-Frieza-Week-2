import React, { useState } from 'react';

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative p-6 rounded-xl border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-md)',
        animationDelay: `${delay}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Background gradient effect on hover */}
      <div 
        className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-5' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, var(--accent), var(--primary))`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-all duration-300 group-hover:scale-110">
          <div
            className="w-full h-full rounded-lg flex items-center justify-center transition-all duration-300"
            style={{ 
              backgroundColor: isHovered ? 'var(--accent)' : 'var(--overlay)',
              transform: isHovered ? 'rotate(5deg)' : 'rotate(0deg)'
            }}
          >
            <span className="text-2xl" role="img" aria-label={title}>
              {icon}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="text-xl font-semibold mb-3 transition-colors duration-300"
          style={{ color: isHovered ? 'var(--accent)' : 'var(--text)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p 
          className="leading-relaxed transition-colors duration-300"
          style={{ color: 'var(--text-muted)' }}
        >
          {description}
        </p>

        {/* Hover indicator */}
        <div 
          className={`absolute bottom-4 right-4 w-2 h-2 rounded-full transition-all duration-300 ${
            isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{ backgroundColor: 'var(--accent)' }}
        />
      </div>

      {/* Animated border effect */}
      <div 
        className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `conic-gradient(from 0deg, var(--accent), var(--primary), var(--accent))`,
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'exclude',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude'
        }}
      />
    </div>
  );
};

export default FeatureCard;