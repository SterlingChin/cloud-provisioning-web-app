'use client';

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  padding: ${props => {
    if (props.$size === 'small') return `${theme.spacing.sm} ${theme.spacing.md}`;
    if (props.$size === 'large') return `${theme.spacing.md} ${theme.spacing.xl}`;
    return `${theme.spacing.sm} ${theme.spacing.lg}`;
  }};
  border-radius: ${theme.borderRadius.md};
  font-size: ${props => {
    if (props.$size === 'small') return theme.fontSizes.sm;
    if (props.$size === 'large') return theme.fontSizes.lg;
    return theme.fontSizes.md;
  }};
  font-weight: ${theme.fontWeights.semibold};
  transition: all 0.2s ease;
  border: 2px solid transparent;

  background: ${props => {
    if (props.$variant === 'primary') return theme.colors.primary;
    if (props.$variant === 'secondary') return theme.colors.secondary;
    return 'transparent';
  }};

  color: ${props => {
    if (props.$variant === 'outline') return theme.colors.primary;
    return theme.colors.text.inverse;
  }};

  border-color: ${props => {
    if (props.$variant === 'outline') return theme.colors.primary;
    return 'transparent';
  }};

  &:hover {
    opacity: ${props => props.$variant === 'outline' ? '1' : '0.9'};
    background: ${props => {
      if (props.$variant === 'outline') return 'rgba(255, 108, 55, 0.1)';
      return undefined;
    }};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
}
