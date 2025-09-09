import React, { useState } from 'react';
import {
  CardWrapper,
  BackgroundGradient,
  ContentWrapper,
  IconContainer,
  IconBackground,
  Icon,
  Title,
  Description,
  HoverIndicator,
  AnimatedBorder,
} from './FeatureCard.styled';

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardWrapper
      delay={delay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BackgroundGradient isHovered={isHovered} />
      <ContentWrapper>
        <IconContainer>
          <IconBackground isHovered={isHovered}>
            <Icon role="img" aria-label={title}>
              {icon}
            </Icon>
          </IconBackground>
        </IconContainer>
        <Title isHovered={isHovered}>{title}</Title>
        <Description>{description}</Description>
        <HoverIndicator isHovered={isHovered} />
      </ContentWrapper>
      <AnimatedBorder isHovered={isHovered} />
    </CardWrapper>
  );
};

export default FeatureCard;
