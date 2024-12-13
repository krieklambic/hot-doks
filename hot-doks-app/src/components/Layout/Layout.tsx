import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NavigationSidebar from '../Navigation/NavigationSidebar';

interface MainContentProps {
  sidebarExpanded: boolean;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main<MainContentProps>`
  margin-top: ${({ theme }) => theme.layout.headerHeight};
  margin-bottom: ${({ theme }) => theme.layout.footerHeight};
  min-height: calc(
    100vh - ${({ theme }) => theme.layout.headerHeight} - ${({ theme }) =>
      theme.layout.footerHeight}
  );
  margin-left: calc(${({ theme }) => theme.spacing.md} * 2 + ${({ sidebarExpanded, theme }) =>
    sidebarExpanded ? theme.layout.sidebarExpandedWidth : theme.layout.sidebarCollapsedWidth});
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  transition: margin-left ${({ theme }) => theme.transitions.default};
`;

const Layout: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  let expandTimeout: NodeJS.Timeout;

  const handleMouseEnter = useCallback(() => {
    expandTimeout = setTimeout(() => {
      setExpanded(true);
    }, 2000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(expandTimeout);
    setExpanded(false);
  }, []);

  return (
    <LayoutContainer>
      <Header />
      <NavigationSidebar 
        expanded={expanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <MainContent sidebarExpanded={expanded}>
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
