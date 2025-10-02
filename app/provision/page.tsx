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
    const addTerminalLine = (line: string, delay: number) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, delay);
    };

    addTerminalLine('Analyzing request...', 0);
    addTerminalLine(`Parsing intent for ${resourceType} creation...`, 800);
    addTerminalLine('Extracting resource parameters...', 1600);

    try {
      let result;

      if (resourceType === 'database') {
        addTerminalLine('Creating database with parameters:', 2400);
        addTerminalLine('  - engine: postgres', 2600);
        addTerminalLine('  - version: 14', 2800);
        addTerminalLine('Executing: POST /databases', 3200);

        result = await api.createDatabase({
          name: `my-database-${Date.now()}`,
          engine: 'postgres',
          version: '14'
        });

        addTerminalLine(`✓ Database created: ${result.id || result.name}`, 3600);
      } else if (resourceType === 'server') {
        addTerminalLine('Creating server with parameters:', 2400);
        addTerminalLine('  - image: ubuntu-20.04', 2600);
        addTerminalLine('  - size: medium', 2800);
        addTerminalLine('Executing: POST /servers', 3200);

        result = await api.createServer({
          name: `my-server-${Date.now()}`,
          image: 'ubuntu-20.04',
          size: 'medium'
        });

        addTerminalLine(`✓ Server created: ${result.id || result.name}`, 3600);
      } else if (resourceType === 'networking') {
        addTerminalLine('Creating network with parameters:', 2400);
        addTerminalLine('  - cidrBlock: 10.0.0.0/16', 2600);
        addTerminalLine('Executing: POST /networking', 3200);

        result = await api.createNetworkingResource({
          name: `my-network-${Date.now()}`,
          cidrBlock: '10.0.0.0/16'
        });

        addTerminalLine(`✓ Network created: ${result.id || result.name}`, 3600);
      }

      addTerminalLine('', 3800);
      addTerminalLine(`SUCCESS: ${getResourceTitle()} provisioned!`, 4000);

      setProvisionedResource(result);
      setIsProvisioning(false);

      return result;
    } catch (error) {
      addTerminalLine('', 3800);
      addTerminalLine(`ERROR: Failed to provision ${resourceType}`, 4000);
      addTerminalLine(`Details: ${error}`, 4200);
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
