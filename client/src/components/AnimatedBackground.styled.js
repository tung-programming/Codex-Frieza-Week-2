import styled from 'styled-components';

export const BackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: -10;
`;

export const GradientBackground = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(-45deg, 
    var(--bg), 
    rgba(6, 182, 212, 0.05), 
    rgba(156, 163, 175, 0.05), 
    var(--bg)
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
`;

export const Orb = styled.div`
  position: absolute;
  border-radius: 9999px;
  opacity: 0.1;
  animation: float 3s ease-in-out infinite;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
`;

export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: linear-gradient(var(--text) 1px, transparent 1px),
                    linear-gradient(90deg, var(--text) 1px, transparent 1px);
  background-size: 20px 20px;
`;
