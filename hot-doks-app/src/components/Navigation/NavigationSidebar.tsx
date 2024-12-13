import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { id: 'commandes', label: 'Commandes', icon: 'receipt_long', path: '/commandes' },
  { id: 'preparation', label: 'Preparation', icon: 'restaurant', path: '/preparation' },
];

interface SidebarProps {
  expanded: boolean;
}

interface NavigationSidebarProps {
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SidebarContainer = styled.nav<SidebarProps>`
  position: fixed;
  left: ${({ theme }) => theme.spacing.md};
  top: calc(${({ theme }) => theme.layout.headerHeight} + ${({ theme }) => theme.spacing.md});
  height: calc(100vh - ${({ theme }) => theme.layout.headerHeight} - ${({ theme }) => theme.layout.footerHeight} - ${({ theme }) => theme.spacing.md} * 2);
  width: ${({ expanded, theme }) =>
    expanded ? theme.layout.sidebarExpandedWidth : theme.layout.sidebarCollapsedWidth};
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.sidebar};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width ${({ theme }) => theme.transitions.default};
`;

const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    color: ${({ theme }) => theme.colors.white};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
  border: none;
  background: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Icon = styled.i.attrs({ className: 'material-icons' })`
  font-size: 24px;
  width: 24px;
  height: 24px;
  margin-right: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span<SidebarProps>`
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
  white-space: nowrap;
  transition: opacity ${({ theme }) => theme.transitions.default};
`;

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  expanded,
  onMouseEnter,
  onMouseLeave,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarContainer
      expanded={expanded}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MenuContainer>
        {menuItems.map((item) => (
          <MenuItem key={item.id} to={item.path}>
            <Icon>{item.icon}</Icon>
            <Label expanded={expanded}>{item.label}</Label>
          </MenuItem>
        ))}
      </MenuContainer>
      <LogoutButton onClick={handleLogout}>
        <Icon>logout</Icon>
        <Label expanded={expanded}>Déconnexion</Label>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default NavigationSidebar;
