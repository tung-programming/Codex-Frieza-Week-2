import styled, { css } from 'styled-components';

export const LandingPageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--bg);
`;

export const Section = styled.section`
  padding: 5rem 1rem;
  position: relative;

  @media (min-width: 640px) {
    padding: 5rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 5rem 2rem;
  }

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
      transform: translateY(0);
      transition: all 1s;
    `}

  ${({ isVisible }) =>
    !isVisible &&
    css`
      opacity: 0;
      transform: translateY(2rem);
    `}
`;

export const HeroSection = styled(Section)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const AboutSection = styled(Section)`
  background-color: var(--card-bg);
`;

export const DocsSection = styled(Section)``;

export const RoadmapSection = styled(Section)`
  background-color: var(--card-bg);
`;

export const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

export const TextCenter = styled.div`
  text-align: center;
`;

export const MainHeading = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--text);
  transition: all 1s;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'translateY(0)' : 'translateY(2rem)')};

  @media (min-width: 640px) {
    font-sze: 3rem;
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
  background: linear-gradient(to right, var(--accent), #3b82f6);
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
  transition: all 1s;
  transition-delay: 200ms;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'translateY(0)' : 'translateY(2rem)')};

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
  transition: all 1s;
  transition-delay: 400ms;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'translateY(0)' : 'translateY(2rem)')};

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export const SignUpButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background-color: var(--accent);
  color: white;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.3s;
  transform: scale(1);

  &:hover {
    background-color: var(--accent-hover);
    transform: scale(1.05);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background-color: var(--card-bg);
  color: var(--text);
  border: 2px solid var(--border);
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.3s;
  transform: scale(1);

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: scale(1.05);
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

export const SectionHeading = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: var(--text);

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  max-width: 48rem;
  margin: 0 auto;
  color: var(--text-muted);

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TechTag = styled.span`
  padding: 0.5rem 1rem;
  background-color: var(--accent-hover);
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const RoadmapGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const RoadmapItem = styled.div`
  padding: 1rem;
  background-color: var(--bg);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
`;

export const RoadmapStatus = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: var(--accent);
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;
