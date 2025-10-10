'use client';

import React, { useState, useEffect, Suspense } from 'react';
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

function ProvisionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resourceType = searchParams.get('type') || 'resource';

  const getResourceTitle = () => {
    const titles: Record<string, string> = {
      server: 'Server',
      database: 'Database',
      storage: 'Storage Bucket',
      networking: 'Network Resource',
    };
    return titles[resourceType] || 'Resource';
  };

  const getInitialTerminalLines = () => {
    const lines = ['Initializing AI provisioning assistant...'];

    if (resourceType === 'storage') {
      lines.push('Connected to Postman Flow (AWS S3)');
    } else {
      lines.push('Connected to Postman Mock API');
    }

    lines.push(`Ready to provision ${getResourceTitle()}s`);
    return lines;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [terminalLines, setTerminalLines] = useState<string[]>(getInitialTerminalLines());
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionedResource, setProvisionedResource] = useState<any>(null);
  const [pendingS3Request, setPendingS3Request] = useState<{bucketName: string; region: string} | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const getResourcePage = () => {
    const pages: Record<string, string> = {
      server: '/servers',
      database: '/databases',
      storage: '/storage',
      networking: '/networking',
    };
    return pages[resourceType] || '/';
  };

  const getExamplePrompts = () => {
    const examples: Record<string, string[]> = {
      database: [
        "Create a postgres database",
        "I need a mysql database version 8",
        "Make me a PostgreSQL 14 database",
        "Create a database for my application",
      ],
      server: [
        "Create an Ubuntu server",
        "I need a CentOS server",
        "Make me a medium-sized server",
        "Provision a server with Ubuntu 20.04",
      ],
      storage: [
        "Create an S3 bucket called my-app-data",
        "I need a storage bucket for images",
        "Make me a bucket in us-west-2",
        "Create an S3 bucket for backups",
      ],
      networking: [
        "Create a VPC with CIDR 10.0.0.0/16",
        "I need networking with CIDR 192.168.0.0/16",
        "Make me a network resource",
        "Provision a VPC for my application",
      ],
    };
    return examples[resourceType] || [
      "Create a resource",
      "I need help provisioning infrastructure",
    ];
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

    // Check if this is an S3 request and we need confirmation
    if (resourceType === 'storage' && !awaitingConfirmation && !pendingS3Request) {
      // Extract bucket name from message using simple heuristics
      const lowerContent = content.toLowerCase();
      let suggestedName = '';

      // Try to extract bucket name from phrases like "called X" or "named X"
      const calledMatch = content.match(/(?:called|named)\s+([a-z0-9-]+)/i);
      if (calledMatch) {
        suggestedName = calledMatch[1].toLowerCase();
      } else {
        suggestedName = `bucket-${Date.now()}`;
      }

      // Set pending request and ask for confirmation
      setPendingS3Request({ bucketName: suggestedName, region: 'us-east-1' });
      setAwaitingConfirmation(true);

      setTimeout(() => {
        const confirmMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I'll create an S3 bucket for you!\n\n📦 Bucket name: ${suggestedName}\n🌍 Region: us-east-1\n\nWould you like to change these settings? Reply with:\n- "yes" to proceed\n- "change name to X" to use a different name\n- "change region to Y" to use a different region`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, confirmMessage]);
      }, 500);
      return;
    }

    // Handle confirmation responses
    if (awaitingConfirmation && pendingS3Request) {
      const lowerContent = content.toLowerCase();

      if (lowerContent.includes('yes') || lowerContent.includes('proceed') || lowerContent.includes('confirm')) {
        // User confirmed, proceed with creation
        setAwaitingConfirmation(false);
        const bucketName = pendingS3Request.bucketName;
        const region = pendingS3Request.region;
        const result = await provisionResourceWithDetails(bucketName, region);
        setPendingS3Request(null);

        setTimeout(() => {
          const completionMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: result
              ? `✅ Great! Your S3 bucket "${bucketName}" has been successfully created in ${region}!`
              : `❌ I encountered an error while creating the bucket. Please check the terminal for details.`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, completionMessage]);
        }, 1000);
        return;
      } else if (lowerContent.includes('change name')) {
        // Extract new name
        const nameMatch = content.match(/change name to\s+([a-z0-9-]+)/i);
        if (nameMatch) {
          setPendingS3Request({ ...pendingS3Request, bucketName: nameMatch[1].toLowerCase() });
          setTimeout(() => {
            const updateMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `Updated!\n\n📦 Bucket name: ${nameMatch[1].toLowerCase()}\n🌍 Region: ${pendingS3Request.region}\n\nReply "yes" to create the bucket.`,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, updateMessage]);
          }, 300);
        }
        return;
      } else if (lowerContent.includes('change region')) {
        // Extract new region
        const regionMatch = content.match(/change region to\s+([a-z0-9-]+)/i);
        if (regionMatch) {
          setPendingS3Request({ ...pendingS3Request, region: regionMatch[1].toLowerCase() });
          setTimeout(() => {
            const updateMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `Updated!\n\n📦 Bucket name: ${pendingS3Request.bucketName}\n🌍 Region: ${regionMatch[1].toLowerCase()}\n\nReply "yes" to create the bucket.`,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, updateMessage]);
          }, 300);
        }
        return;
      }
    }

    // Original flow for non-S3 resources
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want to create a ${getResourceTitle()}. I'm analyzing your requirements and will provision it for you. Please check the terminal for the provisioning progress.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    const result = await provisionResource(content);

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

  const provisionResourceWithDetails = async (bucketName: string, region: string) => {
    setIsProvisioning(true);

    const addTerminalLine = (line: string, delay: number = 0) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, delay);
    };

    addTerminalLine(`Creating S3 bucket: ${bucketName}`);
    addTerminalLine(`Region: ${region}`, 200);
    addTerminalLine('', 400);
    addTerminalLine('Calling Postman Flow...', 600);

    try {
      const response = await fetch('/api/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create an S3 bucket called ${bucketName} in region ${region}`,
          resourceType: 'storage',
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Provision API response:', data);

      // Check if the provisioning was successful
      if (!data.success || !data.result || !data.result.resource) {
        throw new Error(data.error || 'Failed to create bucket');
      }

      addTerminalLine('', 1000);
      addTerminalLine(`✅ Bucket created: ${bucketName}`, 1200);
      addTerminalLine(`Region: ${region}`, 1400);
      addTerminalLine(`Total buckets in AWS: ${data.result.resource.totalBuckets || 'N/A'}`, 1600);
      addTerminalLine('', 1800);
      addTerminalLine('SUCCESS: S3 bucket provisioned!', 2000);

      setProvisionedResource(data.result.resource);
      setIsProvisioning(false);
      return data.result.resource;
    } catch (error: any) {
      addTerminalLine('', 1000);
      addTerminalLine(`ERROR: Failed to create bucket`, 1200);
      addTerminalLine(`Details: ${error.message}`, 1400);
      setIsProvisioning(false);
      return null;
    }
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
              examplePrompts={getExamplePrompts()}
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
                    setTerminalLines(getInitialTerminalLines());
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
            <Terminal lines={terminalLines} isProcessing={isProvisioning} />
          </Section>
        </ContentGrid>
      </ProvisionContainer>
    </Layout>
  );
}

export default function ProvisionPage() {
  return (
    <Suspense fallback={<Layout><div>Loading...</div></Layout>}>
      <ProvisionContent />
    </Suspense>
  );
}
