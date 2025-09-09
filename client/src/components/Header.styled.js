import styled, { css } from 'styled-components';

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s;
  background-color: transparent;

  ${({ isScrolled }) =>
    isScrolled &&
    css`
      background: var(--header-bg);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: var(--shadow-md);
    `};
`;

export const Nav = styled.nav`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

export const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  transition: color 0.3s;
  color: var(--text);
`;

export const Logo = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--accent);
  color: white;
  font-weight: bold;
`;

export const DesktopNav = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

export const NavLinks = styled.div`
  margin-left: 2.5rem;
  display: flex;
  align-items: baseline;
  gap: 2rem;
`;

export const NavLink = styled.a`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s;
  color: var(--text);

  &:hover {
    color: var(--accent);
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
  }
`;

export const AuthButtons = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export const SignInButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
  border: 1px solid var(--border);
  color: var(--text);
  background-color: transparent;

  &:hover {
    background-color: var(--overlay);
    transform: translateY(-1px);
  }
`;

export const SignUpButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
  background-color: var(--primary);
  color: white;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);

  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
  }
`;

export const MobileMenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
  color: var(--text);

  &:hover {
    background-color: var(--overlay);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export const MobileMenu = styled.div`
  transition: all 0.3s;
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? '100vh' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};

  @media (min-width: 768px) {
    display: none;
  }
`;

export const MobileMenuContent = styled.div`
  padding: 0.5rem 0.5rem 0.75rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--card-bg);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MobileNavLink = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
  color: var(--text);
  animation-delay: ${({ delay }) => delay}s;

  &:hover {
    background-color: var(--overlay);
    color: var(--accent);
  }
`;

export const MobileAuthSection = styled.div`
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
