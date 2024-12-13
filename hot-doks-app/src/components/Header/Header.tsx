import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrderStore } from '../../store/orderStore';
import { JsonViewerContext } from '../../App';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: ${({ theme }) => theme.layout.headerHeight};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: ${({ theme }) => theme.zIndex.header};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.accent};
  flex: 1;
  text-transform: uppercase;
`;

const DateTimeDisplay = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  flex: 1;
  text-transform: uppercase;
`;

const Separator = styled.span`
  margin: 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  flex: 1;
  justify-content: flex-end;
`;

const UserIcon = styled.i.attrs({ className: 'material-icons' })`
  font-size: 24px;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  text-transform: uppercase;
`;

const JsonButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-right: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const formatDate = (date: Date): string => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName} ${day} ${month} ${year}`;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const Header: React.FC = () => {
  const location = useLocation();
  const { username } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { openJsonViewer } = React.useContext(JsonViewerContext);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Add routes where header should be hidden
  const hideHeaderRoutes = ['/login'];
  
  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <HeaderContainer>
      <Logo>Hot-Doks</Logo>
      <DateTimeDisplay>
        {formatDate(currentDateTime)}
        <Separator>|</Separator>
        {formatTime(currentDateTime)}
      </DateTimeDisplay>
      <UserInfo>
        <JsonButton onClick={openJsonViewer}>
          <i className="material-icons">code</i>
          JSON
        </JsonButton>
        <UserIcon>person</UserIcon>
        <UserName>{username}</UserName>
      </UserInfo>
    </HeaderContainer>
  );
};

export default Header;
