import styled, { css } from 'styled-components';

export const CardWrapper = styled.div`
  position: relative;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background-color: var(--card-bg);
  box-shadow: var(--shadow-md);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
  animation-delay: ${({ delay }) => delay}ms;

  &:hover {
    transform: scale(1.05) translateY(-0.5rem);
    border-color: var(--accent);
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.15);
  }
`;

export const BackgroundGradient = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  opacity: 0;
  transition: opacity 0.5s;
  background: linear-gradient(135deg, var(--accent), var(--primary));

  ${({ isHovered }) =>
    isHovered &&
    css`
      opacity: 0.05;
    `};
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s;

  ${CardWrapper}:hover & {
    transform: scale(1.1);
  }
`;

export const IconBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background-color: ${({ isHovered }) => (isHovered ? 'var(--accent)' : 'var(--overlay)')};
  transform: ${({ isHovered }) => (isHovered ? 'rotate(5deg)' : 'rotate(0deg)')};
`;

export const Icon = styled.span`
  font-size: 1.5rem;
`;

export const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  transition: color 0.3s;
  color: ${({ isHovered }) => (isHovered ? 'var(--accent)' : 'var(--text)')};
`;

export const Description = styled.p`
  line-height: 1.6;
  transition: color 0.3s;
  color: var(--text-muted);
`;

export const HoverIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  transition: all 0.3s;
  background-color: var(--accent);
  transform: ${({ isHovered }) => (isHovered ? 'scale(1)' : 'scale(0.5)')};
  opacity: ${({ isHovered }) => (isHovered ? 1 : 0)};
`;

export const AnimatedBorder = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  pointer-events: none;
  transition: all 0.5s;
  opacity: ${({ isHovered }) => (isHovered ? 1 : 0)};
  background: conic-gradient(from 0deg, var(--accent), var(--primary), var(--accent));
  padding: 2px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: exclude;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
`;
