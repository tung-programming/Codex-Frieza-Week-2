import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  border-top: 1px solid var(--border);
  padding: 3rem 1rem;
  background-color: var(--card-bg);

  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 3rem 2rem;
  }
`;

export const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  font-size: 0.875rem;
`;

export const BrandName = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text);
`;

export const Description = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 20rem;
  color: var(--text-muted);
`;

export const LinksSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
`;

export const LinksList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LinkItem = styled.a`
  font-size: 0.875rem;
  transition: all 0.3s;
  display: inline-block;
  color: var(--text-muted);

  &:hover {
    transform: translateX(0.25rem);
    color: var(--accent);
  }
`;

export const ProjectInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProjectInfoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.3s;
  color: var(--text-muted);

  &:hover {
    transform: translateX(0.25rem);
    color: var(--accent);

    svg:last-child {
      opacity: 1;
    }
  }
`;

export const InfoText = styled.div`
  font-size: 0.875rem;
  color: var(--text-muted);
`;

export const BottomSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 0;
  }
`;

export const Copyright = styled.p`
  font-size: 0.875rem;
  text-align: center;
  color: var(--text-muted);

  @media (min-width: 768px) {
    text-align: left;
  }
`;

export const BottomLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
`;

export const BottomLink = styled.a`
  transition: color 0.3s;
  color: var(--text-muted);

  &:hover {
    color: var(--accent);
  }
`;

export const Separator = styled.span`
  color: var(--border);
`;

export const DecorativeElement = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4rem;
  height: 0.25rem;
  border-radius: 9999px;
  opacity: 0.2;
  background-color: var(--accent);
`;
