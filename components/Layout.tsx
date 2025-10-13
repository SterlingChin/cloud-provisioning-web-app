'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { theme } from '@/styles/theme';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background: ${theme.colors.secondary};
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.xl} 0;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  padding: 0 ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
`;

const ConnectionStatus = styled.div`
  padding: 0 ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
`;

const StatusDot = styled.span<{ $connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$connected ? '#27c93f' : '#ff5f56'};
  animation: ${props => props.$connected ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NavBottom = styled.div`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${theme.spacing.md};
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${props => props.$isActive ? theme.colors.primary : theme.colors.text.inverse};
  background: ${props => props.$isActive ? 'rgba(255, 108, 55, 0.1)' : 'transparent'};
  border-left: 3px solid ${props => props.$isActive ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  font-weight: ${props => props.$isActive ? theme.fontWeights.semibold : theme.fontWeights.normal};

  &:hover {
    background: rgba(255, 108, 55, 0.1);
    color: ${theme.colors.primary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: ${theme.spacing.xl};
`;

const Header = styled.header`
  margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes.xxl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = React.useState(true);

  // Check connection status on mount
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (apiUrl) {
          // Just check if the env var is set for now
          setIsConnected(true);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/servers', label: 'Servers' },
    { href: '/databases', label: 'Databases' },
    { href: '/storage', label: 'Storage' },
    { href: '/networking', label: 'Networking' },
  ];

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>Cloud Infra</Logo>
        <ConnectionStatus>
          <StatusDot $connected={isConnected} />
          {isConnected ? 'Connected to Postman API' : 'Disconnected'}
        </ConnectionStatus>
        <Nav>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              $isActive={pathname === item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>
        <NavBottom>
          <NavLink
            href="/diagram"
            $isActive={pathname === '/diagram'}
          >
            📊 Architecture Diagram
          </NavLink>
        </NavBottom>
      </Sidebar>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
