import { ReactNode } from 'react';
import StyledComponentsRegistry from './registry';
import { GlobalStyles } from '@/styles/GlobalStyles';
import './globals.css';

export const metadata = {
  title: 'Cloud Infrastructure Provisioning',
  description: 'Manage your cloud infrastructure with AI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
