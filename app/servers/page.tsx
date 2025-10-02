'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ResourceCard from '@/components/ResourceCard';
import Button from '@/components/Button';
import { theme } from '@/styles/theme';
import { api } from '@/lib/api';
import { Server } from '@/types';

const PageContainer = styled.div`
  max-width: 1400px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes.xxl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.text.secondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.text.secondary};
`;

export default function ServersPage() {
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      setLoading(true);
      const data = await api.getServers();
      setServers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load servers:', error);
      setServers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this server?')) {
      try {
        await api.deleteServer(id);
        loadServers();
      } catch (error) {
        console.error('Failed to delete server:', error);
      }
    }
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <Title>Servers</Title>
          <Button onClick={() => router.push('/provision?type=server')}>
            Provision New Server
          </Button>
        </Header>

        {loading ? (
          <LoadingState>Loading servers...</LoadingState>
        ) : servers.length === 0 ? (
          <EmptyState>
            <h3>No servers found</h3>
            <p>Create your first server to get started</p>
          </EmptyState>
        ) : (
          <ResourceGrid>
            {servers.map((server) => (
              <ResourceCard
                key={server.id}
                title={server.name}
                details={[
                  { label: 'ID', value: server.id },
                  { label: 'Status', value: server.status },
                  { label: 'IP Address', value: server.ipAddress || 'N/A' },
                ]}
                onView={() => console.log('View', server.id)}
                onEdit={() => console.log('Edit', server.id)}
                onDelete={() => handleDelete(server.id)}
              />
            ))}
          </ResourceGrid>
        )}
      </PageContainer>
    </Layout>
  );
}
