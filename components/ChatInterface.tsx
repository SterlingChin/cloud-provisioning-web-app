'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from './Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  disabled?: boolean;
  examplePrompts?: string[];
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  height: 500px;
  box-shadow: ${theme.shadows.md};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.surface};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${props => props.$isUser ? theme.colors.primary : theme.colors.surface};
  color: ${props => props.$isUser ? theme.colors.text.inverse : theme.colors.text.primary};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
`;

const MessageContent = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const MessageTime = styled.span`
  font-size: ${theme.fontSizes.xs};
  opacity: 0.7;
  margin-top: ${theme.spacing.xs};
  display: block;
`;

const InputContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  border-radius: 0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg};
`;

const Input = styled.input`
  flex: 1;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${theme.colors.text.secondary};
  text-align: center;
  padding: ${theme.spacing.xl};

  h3 {
    margin-bottom: ${theme.spacing.sm};
    color: ${theme.colors.text.primary};
  }

  p {
    font-size: ${theme.fontSizes.sm};
  }
`;

const ExamplePrompts = styled.div`
  margin-top: ${theme.spacing.lg};
  width: 100%;
  max-width: 400px;
`;

const ExamplePromptsTitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
`;

const ExamplePrompt = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xs};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.background};
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }
`;

export default function ChatInterface({ onSendMessage, messages, disabled = false, examplePrompts }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultExamplePrompts = [
    "Create a postgres database",
    "I need a mysql database version 8",
    "Make me an Ubuntu server",
    "Create an S3 bucket to store images",
    "Provision networking with CIDR 10.0.0.0/16"
  ];

  const prompts = examplePrompts || defaultExamplePrompts;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleExampleClick = (prompt: string) => {
    if (!disabled) {
      setInput(prompt);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <h3>Welcome to Cloud Infrastructure Provisioning</h3>
            <p>Describe what you&apos;d like to create, and I&apos;ll help you provision it.</p>
            <ExamplePrompts>
              <ExamplePromptsTitle>Try these commands:</ExamplePromptsTitle>
              {prompts.map((prompt, index) => (
                <ExamplePrompt
                  key={index}
                  onClick={() => handleExampleClick(prompt)}
                  disabled={disabled}
                >
                  {prompt}
                </ExamplePrompt>
              ))}
            </ExamplePrompts>
          </EmptyState>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} $isUser={message.role === 'user'}>
                <MessageContent>{message.content}</MessageContent>
                <MessageTime>{formatTime(message.timestamp)}</MessageTime>
              </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>
      <InputContainer>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: theme.spacing.md, width: '100%' }}>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Provisioning in progress..." : "Describe what you want to provision..."}
            disabled={disabled}
          />
          <Button type="submit" disabled={!input.trim() || disabled}>
            {disabled ? 'Processing...' : 'Send'}
          </Button>
        </form>
      </InputContainer>
    </ChatContainer>
  );
}
