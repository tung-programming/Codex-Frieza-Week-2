import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import {
  HeaderWrapper,
  Nav,
  NavContent,
  LogoLink,
  Logo,
  DesktopNav,
  NavLinks,
  NavLink,
  AuthButtons,
  SignInButton,
  SignUpButton,
  MobileMenuButton,
  MobileMenu,
  MobileMenuContent,
  MobileNavLink,
  MobileAuthSection,
} from './Header.styled';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#docs', label: 'Docs' },
    { href: '#roadmap', label: 'Roadmap' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <HeaderWrapper isScrolled={isScrolled}>
      <Nav>
        <NavContent>
          <LogoLink href="#">
            <Logo>G</Logo>
            <span>Gallery</span>
          </LogoLink>

          <DesktopNav>
            <NavLinks>
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </NavLinks>
          </DesktopNav>

          <AuthButtons>
            <SignInButton>Sign In</SignInButton>
            <SignUpButton>Sign Up</SignUpButton>
          </AuthButtons>

          <MobileMenuButton onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </NavContent>

        <MobileMenu isOpen={isMenuOpen}>
          <MobileMenuContent>
            {navLinks.map((link, index) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                delay={index * 0.1}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </MobileNavLink>
            ))}

            <MobileAuthSection>
              <SignInButton>Sign In</SignInButton>
              <SignUpButton>Sign Up</SignUpButton>
            </MobileAuthSection>
          </MobileMenuContent>
        </MobileMenu>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
