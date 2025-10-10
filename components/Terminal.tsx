'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface TerminalProps {
  lines: string[];
  isProcessing?: boolean;
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

const TerminalLine = styled.div<{ $type?: 'info' | 'success' | 'error' | 'header' }>`
  margin-bottom: ${theme.spacing.xs};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${props => {
    switch (props.$type) {
      case 'success':
        return '#27c93f';
      case 'error':
        return '#ff5f56';
      case 'header':
        return theme.colors.primary;
      case 'info':
        return '#00d9ff';
      default:
        return '#00ff00';
    }
  }};
  font-weight: ${props => props.$type === 'header' ? theme.fontWeights.bold : theme.fontWeights.normal};

  &::before {
    content: '${props => {
      switch (props.$type) {
        case 'success':
          return '✓ ';
        case 'error':
          return '✗ ';
        case 'header':
          return '▶ ';
        case 'info':
          return 'ℹ ';
        default:
          return '$ ';
      }
    }}';
    color: ${props => {
      switch (props.$type) {
        case 'success':
          return '#27c93f';
        case 'error':
          return '#ff5f56';
        case 'header':
          return theme.colors.primary;
        case 'info':
          return '#00d9ff';
        default:
          return theme.colors.primary;
      }
    }};
    font-weight: ${theme.fontWeights.bold};
    margin-right: ${theme.spacing.xs};
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

const LoadingSpinner = styled.div`
  display: inline-block;
  margin-left: ${theme.spacing.sm};
`;

const Spinner = styled.span`
  display: inline-block;
  animation: spin 1s linear infinite;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.lg};

  @keyframes spin {
    0% { content: '⠋'; }
    12.5% { content: '⠙'; }
    25% { content: '⠹'; }
    37.5% { content: '⠸'; }
    50% { content: '⠼'; }
    62.5% { content: '⠴'; }
    75% { content: '⠦'; }
    87.5% { content: '⠧'; }
    100% { content: '⠇'; }
  }

  &::before {
    content: '⠋';
  }
`;

export default function Terminal({ lines, isProcessing = false }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineType = (line: string): 'info' | 'success' | 'error' | 'header' | undefined => {
    if (line.startsWith('SUCCESS:') || line.includes('✓') || line.toLowerCase().includes('provisioned')) {
      return 'success';
    }
    if (line.startsWith('ERROR:') || line.toLowerCase().includes('failed')) {
      return 'error';
    }
    if (line.startsWith('AI') || line.includes('analyzing') || line.includes('Response:')) {
      return 'info';
    }
    if (line.startsWith('Action:') || line.startsWith('Resource Type:') || line.startsWith('Resource Details:')) {
      return 'header';
    }
    return undefined;
  };

  return (
    <TerminalContainer ref={terminalRef}>
      <TerminalHeader>
        <TerminalButton $color="#ff5f56" />
        <TerminalButton $color="#ffbd2e" />
        <TerminalButton $color={isProcessing ? "#ffbd2e" : "#27c93f"} />
        <TerminalTitle>AI Terminal {isProcessing && '(Processing...)'}</TerminalTitle>
      </TerminalHeader>
      {lines.map((line, index) => (
        <TerminalLine key={index} $type={getLineType(line)}>{line}</TerminalLine>
      ))}
      {isProcessing && (
        <TerminalLine $type="info">
          Processing
          <LoadingSpinner>
            <Spinner />
          </LoadingSpinner>
        </TerminalLine>
      )}
      <Cursor />
    </TerminalContainer>
  );
}
