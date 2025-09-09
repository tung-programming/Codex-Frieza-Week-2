import React, { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import AnimatedBackground from '../components/AnimatedBackground';
import {
  LandingPageWrapper,
  HeroSection,
  AboutSection,
  DocsSection,
  RoadmapSection,
  Container,
  TextCenter,
  MainHeading,
  GradientText,
  Subtitle,
  CtaButtons,
  SignUpButton,
  LoginButton,
  SectionHeading,
  SectionSubtitle,
  FeatureGrid,
  AboutGrid,
  TechTag,
  RoadmapGrid,
  RoadmapItem,
  RoadmapStatus,
} from './LandingPage.styled';

const LandingPage = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroVisible(true), 100);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Perfect experience across all devices. From mobile phones to desktop displays, your gallery adapts seamlessly.',
    },
    {
      icon: '🏷️',
      title: 'Albums & Collections',
      description: 'Organize your media with smart albums, tags, and collections. Advanced filtering and search capabilities included.',
    },
    {
      icon: '🔒',
      title: 'Secure Uploads',
      description: 'Enterprise-grade security with encrypted uploads, user authentication, and granular permission controls.',
    },
    {
      icon: '⚡',
      title: 'Bonus Features',
      description: 'AI-powered image generation, intelligent palette extraction, vector similarity search, and theme customization.',
    },
  ];

  const isVisible = (sectionId) => visibleSections.has(sectionId);

  return (
    <LandingPageWrapper>
      <Header />

      <HeroSection>
        <AnimatedBackground />
        <Container>
          <TextCenter>
            <MainHeading isVisible={isHeroVisible}>
              <span>Revamped</span>
              <GradientText>Media Gallery</GradientText>
            </MainHeading>
            <Subtitle isVisible={isHeroVisible}>
              From legacy PHP gallery → to a modern, extensible media platform.
            </Subtitle>
            <CtaButtons isVisible={isHeroVisible}>
              <SignUpButton>Sign Up Free</SignUpButton>
              <LoginButton>Login</LoginButton>
            </CtaButtons>
          </TextCenter>
        </Container>
        <Container style={{ marginTop: '5rem' }}>
          <TextCenter>
            <SectionHeading>
              Modern Features for <GradientText>Modern Galleries</GradientText>
            </SectionHeading>
            <SectionSubtitle>
              Built from the ground up with cutting-edge technology to provide the best media management experience.
            </SectionSubtitle>
          </TextCenter>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </FeatureGrid>
        </Container>
      </HeroSection>

      <AboutSection id="about" data-section isVisible={isVisible('about')}>
        <Container>
          <AboutGrid>
            <div>
              <SectionHeading>Transforming Media Management</SectionHeading>
              <p>
                This project represents a complete modernization of traditional PHP-based image galleries. Built with React, Node.js, and PostgreSQL, it offers unprecedented performance, scalability, and user experience.
              </p>
              <p>
                From simple photo sharing to advanced media workflows, our platform grows with your needs. Whether you're a photographer, designer, or content creator, you'll find tools that enhance your creative process.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
                {['React + Vite', 'Node.js + Express', 'PostgreSQL'].map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </div>
            </div>
            <div>
              {/* Placeholder for illustration */}
            </div>
          </AboutGrid>
        </Container>
      </AboutSection>

      <DocsSection id="docs" data-section isVisible={isVisible('docs')}>
        <Container>
          <TextCenter>
            <SectionHeading>Ready to Get Started?</SectionHeading>
            <SectionSubtitle>
              Comprehensive documentation, API references, and step-by-step guides to help you integrate and customize your media gallery experience.
            </SectionSubtitle>
            <SignUpButton style={{ marginTop: '2rem' }}>View Documentation</SignUpButton>
          </TextCenter>
        </Container>
      </DocsSection>

      <RoadmapSection id="roadmap" data-section isVisible={isVisible('roadmap')}>
        <Container>
          <TextCenter>
            <SectionHeading>What's Coming Next</SectionHeading>
            <SectionSubtitle>
              We're constantly evolving. Check out our roadmap to see upcoming features, performance improvements, and community-requested enhancements.
            </SectionSubtitle>
            <RoadmapGrid>
              {[
                { title: 'AI Integration', status: 'In Progress' },
                { title: 'Mobile App', status: 'Planned' },
                { title: 'Advanced Analytics', status: 'Research' },
              ].map((item, index) => (
                <RoadmapItem key={index}>
                  <h4>{item.title}</h4>
                  <RoadmapStatus>{item.status}</RoadmapStatus>
                </RoadmapItem>
              ))}
            </RoadmapGrid>
            <LoginButton>View Full Roadmap</LoginButton>
          </TextCenter>
        </Container>
      </RoadmapSection>

      <Footer />
    </LandingPageWrapper>
  );
};

export default LandingPage;
