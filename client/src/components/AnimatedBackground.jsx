import React from 'react';

const AnimatedBackground = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      {/* Primary gradient background */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 animate-float" 
           style={{ 
             background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
             animationDelay: '0s'
           }} 
      />
      
      <div className="absolute top-1/2 right-20 w-24 h-24 rounded-full opacity-10 animate-float" 
           style={{ 
             background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
             animationDelay: '2s'
           }} 
      />
      
      <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full opacity-10 animate-float" 
           style={{ 
             background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
             animationDelay: '4s'
           }} 
      />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
           style={{
             backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px),
                              linear-gradient(90deg, var(--text) 1px, transparent 1px)`,
             backgroundSize: '20px 20px'
           }}
      />
    </div>
  );
};

export default AnimatedBackground;