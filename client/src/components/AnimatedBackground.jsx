import React from 'react';
import {
  BackgroundWrapper,
  GradientBackground,
  Orb,
  GridOverlay,
} from './AnimatedBackground.styled';

const AnimatedBackground = ({ className = "" }) => {
  return (
    <BackgroundWrapper className={className}>
      <GradientBackground />
      <Orb
        style={{
          top: '5rem',
          left: '2.5rem',
          width: '8rem',
          height: '8rem',
          animationDelay: '0s',
          background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
        }}
      />
      <Orb
        style={{
          top: '50%',
          right: '5rem',
          width: '6rem',
          height: '6rem',
          animationDelay: '2s',
          background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
        }}
      />
      <Orb
        style={{
          bottom: '5rem',
          left: '25%',
          width: '10rem',
          height: '10rem',
          animationDelay: '4s',
          background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
        }}
      />
      <GridOverlay />
    </BackgroundWrapper>
  );
};

export default AnimatedBackground;
