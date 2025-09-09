import React, { useEffect, useState } from 'react';
import AnimatedBackground from './AnimatedBackground';
import {
  HeroWrapper,
  ContentWrapper,
  MainHeading,
  GradientText,
  Subtitle,
  CtaButtons,
  SignUpButton,
  LoginButton,
  ScrollIndicator,
  ScrollIndicatorContent,
  ScrollText,
  ScrollMouse,
  ScrollWheel,
  DecorativeElement,
} from './HeroSection.styled';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HeroWrapper>
      <AnimatedBackground />

      <ContentWrapper>
        <MainHeading isVisible={isVisible}>
          <span className="block">Revamped</span>
          <GradientText>Media Gallery</GradientText>
        </MainHeading>

        <Subtitle isVisible={isVisible}>
          From legacy PHP gallery → to a modern, extensible media platform.
        </Subtitle>

        <CtaButtons isVisible={isVisible}>
          <SignUpButton>Sign Up Free</SignUpButton>
          <LoginButton>Login</LoginButton>
        </CtaButtons>

        <ScrollIndicator isVisible={isVisible}>
          <ScrollIndicatorContent>
            <ScrollText>Scroll to explore</ScrollText>
            <ScrollMouse>
              <ScrollWheel />
            </ScrollMouse>
          </ScrollIndicatorContent>
        </ScrollIndicator>
      </ContentWrapper>

      <DecorativeElement
        style={{
          top: '5rem',
          left: '1rem',
          width: '0.5rem',
          height: '4rem',
          backgroundColor: 'var(--accent)',
          animationDelay: '1s',
        }}
      />
      <DecorativeElement
        style={{
          bottom: '10rem',
          right: '2rem',
          width: '0.75rem',
          height: '0.75rem',
          backgroundColor: 'var(--primary)',
          animationDelay: '3s',
        }}
      />
    </HeroWrapper>
  );
};

export default HeroSection;
