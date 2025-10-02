'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/ChatInterface';
import Terminal from '@/components/Terminal';
import Button from '@/components/Button';
import { theme } from '@/styles/theme';
import { api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ProvisionContainer = styled.div`
  max-width: 1400px;
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes.xxl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text.secondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div``;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

const SectionDescription = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.lg};
`;

const SuccessActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

export default function ProvisionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resourceType = searchParams.get('type') || 'resource';

  const [messages, setMessages] = useState<Message[]>([]);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Initializing AI provisioning assistant...',
    'Connected to Postman Mock API',
    'Ready to provision resources',
  ]);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionedResource, setProvisionedResource] = useState<any>(null);

  const getResourceTitle = () => {
    const titles: Record<string, string> = {
      server: 'Server',
      database: 'Database',
      storage: 'Storage Bucket',
      networking: 'Network Resource',
    };
    return titles[resourceType] || 'Resource';
  };

  const getResourcePage = () => {
    const pages: Record<string, string> = {
      server: '/servers',
      database: '/databases',
      storage: '/storage',
      networking: '/networking',
    };
    return pages[resourceType] || '/';
  };

  const provisionResource = async (userMessage: string) => {
    setIsProvisioning(true);

    // Add terminal output
    const addTerminalLine = (line: string, delay: number = 0) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, delay);
    };

    addTerminalLine('Sending request to AI...');
    addTerminalLine(`User: ${userMessage}`, 200);
    addTerminalLine('', 400);
    addTerminalLine('AI analyzing command...', 600);

    try {
      // Call OpenAI API endpoint
      const response = await fetch('/api/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          resourceType: resourceType,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      addTerminalLine('', 1000);
      addTerminalLine(`AI Response: ${data.aiResponse}`, 1200);
      addTerminalLine('', 1400);

      if (data.success && data.result) {
        addTerminalLine(`Action: ${data.action}`, 1600);
        addTerminalLine(`Resource Type: ${data.resourceType}`, 1800);
        addTerminalLine('', 2000);

        if (data.result.resource) {
          const resource = data.result.resource;
          addTerminalLine('Resource Details:', 2200);
          addTerminalLine(`  ✓ ID: ${resource.id || 'N/A'}`, 2400);
          addTerminalLine(`  ✓ Name: ${resource.name || 'N/A'}`, 2600);

          if (resource.engine) addTerminalLine(`  ✓ Engine: ${resource.engine}`, 2800);
          if (resource.version) addTerminalLine(`  ✓ Version: ${resource.version}`, 3000);
          if (resource.status) addTerminalLine(`  ✓ Status: ${resource.status}`, 3200);
          if (resource.ipAddress) addTerminalLine(`  ✓ IP: ${resource.ipAddress}`, 3400);
          if (resource.cidrBlock) addTerminalLine(`  ✓ CIDR: ${resource.cidrBlock}`, 3600);
        }

        addTerminalLine('', 3800);
        addTerminalLine(`SUCCESS: ${getResourceTitle()} provisioned!`, 4000);

        setProvisionedResource(data.result.resource || data.result);
        setIsProvisioning(false);

        return data.result.resource || data.result;
      } else if (data.noAction) {
        addTerminalLine('No provisioning action taken.', 1600);
        addTerminalLine('Try: "Create a postgres database" or "Create a server"', 1800);
        setIsProvisioning(false);
        return null;
      }

      setIsProvisioning(false);
      return data.result;
    } catch (error: any) {
      addTerminalLine('', 1000);
      addTerminalLine(`ERROR: Failed to provision ${resourceType}`, 1200);
      addTerminalLine(`Details: ${error.message}`, 1400);
      setIsProvisioning(false);
      return null;
    }
  };

  const handleSendMessage = async (content: string) => {
    // Prevent multiple simultaneous provisions
    if (isProvisioning) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want to create a ${getResourceTitle()}. I'm analyzing your requirements and will provision it for you. Please check the terminal for the provisioning progress.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    // Actually provision the resource (only once)
    const result = await provisionResource(content);

    // Completion message
    setTimeout(() => {
      const completionMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: result
          ? `Great! Your ${getResourceTitle()} has been successfully provisioned. You can view it in the ${getResourceTitle()}s page.`
          : `I encountered an error while provisioning the ${getResourceTitle()}. Please check the terminal for details.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, completionMessage]);
    }, 5000);
  };

  return (
    <Layout>
      <ProvisionContainer>
        <Header>
          <Title>Provision New {getResourceTitle()}</Title>
          <Subtitle>
            Describe what you need, and our AI will help you create it
          </Subtitle>
        </Header>

        <ContentGrid>
          <Section>
            <SectionTitle>Chat with AI</SectionTitle>
            <SectionDescription>
              Tell the AI what you want to create in natural language
            </SectionDescription>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              disabled={isProvisioning}
            />
            {provisionedResource && (
              <SuccessActions>
                <Button onClick={() => router.push(getResourcePage())}>
                  View {getResourceTitle()}s
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProvisionedResource(null);
                    setTerminalLines([
                      'Initializing AI provisioning assistant...',
                      'Connected to Postman Mock API',
                      'Ready to provision resources',
                    ]);
                  }}
                >
                  Provision Another
                </Button>
              </SuccessActions>
            )}
          </Section>

          <Section>
            <SectionTitle>AI Terminal</SectionTitle>
            <SectionDescription>
              Watch the AI execute commands to provision your resources
            </SectionDescription>
            <Terminal lines={terminalLines} />
          </Section>
        </ContentGrid>
      </ProvisionContainer>
    </Layout>
  );
}
