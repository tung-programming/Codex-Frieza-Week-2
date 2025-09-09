import styled, { css } from 'styled-components';

export const HeroWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 56rem;
  margin: 0 auto;
`;

const animatedElement = css`
  transition: all 1s;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'translateY(0)' : 'translateY(2rem)')};
`;

export const MainHeading = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--text);
  ${animatedElement}

  @media (min-width: 640px) {
    font-size: 3rem;
  }

  @media (min-width: 768px) {
    font-size: 3.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 4.5rem;
  }
`;

export const GradientText = styled.span`
  display: block;
  background: linear-gradient(to right, #22d3ee, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  color: var(--text-muted);
  transition-delay: 200ms;
  ${animatedElement}

  @media (min-width: 640px) {
    font-size: 1.25rem;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CtaButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  transition-delay: 400ms;
  ${animatedElement}

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export const SignUpButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.3s;
  background-color: var(--accent);
  color: white;
  min-width: 160px;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);

  &:hover {
    background-color: var(--accent-hover);
    transform: scale(1.05) translateY(-2px);
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border: 2px solid var(--border);
  transition: all 0.3s;
  background-color: var(--card-bg);
  color: var(--text);
  min-width: 160px;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  transition-delay: 600ms;
  ${animatedElement}
  opacity: ${({ isVisible }) => (isVisible ? 0.6 : 0)};
`;

export const ScrollIndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const ScrollText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
`;

export const ScrollMouse = styled.div`
  width: 1.5rem;
  height: 2.5rem;
  border: 2px solid var(--border);
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
`;

export const ScrollWheel = styled.div`
  width: 0.25rem;
  height: 0.75rem;
  border-radius: 9999px;
  margin-top: 0.5rem;
  background-color: var(--accent);
`;

export const DecorativeElement = styled.div`
  position: absolute;
  border-radius: 9999px;
  opacity: 0.2;
  animation: float 3s ease-in-out infinite;
`;
