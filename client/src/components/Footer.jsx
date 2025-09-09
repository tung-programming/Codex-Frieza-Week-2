import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import {
  FooterWrapper,
  Container,
  Grid,
  BrandSection,
  Brand,
  Logo,
  BrandName,
  Description,
  LinksSection,
  SectionTitle,
  LinksList,
  LinkItem,
  ProjectInfoSection,
  ProjectInfoLink,
  InfoText,
  BottomSection,
  Copyright,
  BottomLinks,
  BottomLink,
  Separator,
  DecorativeElement,
} from './Footer.styled';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Container>
        <Grid>
          <BrandSection>
            <Brand>
              <Logo>G</Logo>
              <BrandName>Revamped Gallery</BrandName>
            </Brand>
            <Description>
              A modern, extensible media platform built to replace legacy PHP galleries with cutting-edge technology.
            </Description>
          </BrandSection>

          <LinksSection>
            <SectionTitle>Quick Links</SectionTitle>
            <LinksList>
              {[
                { href: '#about', label: 'About' },
                { href: '#docs', label: 'Documentation' },
                { href: '#roadmap', label: 'Roadmap' },
                { href: '#features', label: 'Features' },
              ].map((link) => (
                <li key={link.href}>
                  <LinkItem href={link.href}>{link.label}</LinkItem>
                </li>
              ))}
            </LinksList>
          </LinksSection>

          <ProjectInfoSection>
            <SectionTitle>Project Info</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <ProjectInfoLink
                href="https://github.com/your-repo/revamped-gallery"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} />
                <span>GitHub Repository</span>
                <ExternalLink size={12} style={{ opacity: 0, transition: 'opacity 0.3s' }} />
              </ProjectInfoLink>

              <InfoText>Built for CloneFest 2025</InfoText>

              <InfoText>Licensed under MIT</InfoText>
            </div>
          </ProjectInfoSection>
        </Grid>

        <BottomSection>
          <Copyright>
            © {currentYear} Revamped Gallery. Built with ❤️ for modern web.
          </Copyright>

          <BottomLinks>
            <BottomLink href="#privacy">Privacy Policy</BottomLink>
            <Separator>|</Separator>
            <BottomLink href="#terms">Terms of Service</BottomLink>
          </BottomLinks>
        </BottomSection>

        <DecorativeElement />
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
