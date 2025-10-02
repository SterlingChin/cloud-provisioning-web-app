'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface TerminalProps {
  lines: string[];
}

const TerminalContainer = styled.div`
  background: ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${theme.fontSizes.sm};
  color: #00ff00;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  box-shadow: ${theme.shadows.lg};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 4px;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TerminalButton = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const TerminalTitle = styled.span`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.xs};
  margin-left: auto;
`;

const TerminalLine = styled.div`
  margin-bottom: ${theme.spacing.xs};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;

  &::before {
    content: '$ ';
    color: ${theme.colors.primary};
    font-weight: ${theme.fontWeights.bold};
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #00ff00;
  animation: blink 1s infinite;
  margin-left: 4px;

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

export default function Terminal({ lines }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <TerminalContainer ref={terminalRef}>
      <TerminalHeader>
        <TerminalButton $color="#ff5f56" />
        <TerminalButton $color="#ffbd2e" />
        <TerminalButton $color="#27c93f" />
        <TerminalTitle>AI Terminal</TerminalTitle>
      </TerminalHeader>
      {lines.map((line, index) => (
        <TerminalLine key={index}>{line}</TerminalLine>
      ))}
      <Cursor />
    </TerminalContainer>
  );
}
