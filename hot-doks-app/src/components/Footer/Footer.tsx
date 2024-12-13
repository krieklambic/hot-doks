import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: ${({ theme }) => theme.layout.footerHeight};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: ${({ theme }) => theme.zIndex.footer};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Copyright> {currentYear} HOT-DOK'S. All rights reserved.</Copyright>
    </FooterContainer>
  );
};

export default Footer;
