import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: string;
  children: React.ReactNode;
}

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  min-width: 160px;
  height: 44px;
  background-color: ${({ theme, variant }) => 
    variant === 'secondary' ? 'transparent' : theme.colors.primary};
  color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.colors.primary : theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.small};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  justify-content: center;

  &:hover {
    background-color: ${({ theme, variant }) => 
      variant === 'secondary' ? theme.colors.backgroundGrey : theme.colors.accent};
    border-color: ${({ theme, variant }) => 
      variant === 'secondary' ? theme.colors.primary : theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Icon = styled.i.attrs({ className: 'material-icons' })`
  font-size: 20px;
`;

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  icon,
  children,
  ...props
}) => {
  return (
    <StyledButton variant={variant} {...props}>
      {icon && <Icon>{icon}</Icon>}
      {children}
    </StyledButton>
  );
};

export default Button;
