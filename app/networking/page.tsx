'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ResourceCard from '@/components/ResourceCard';
import Button from '@/components/Button';
import { theme } from '@/styles/theme';
import { api } from '@/lib/api';
import { NetworkingResource } from '@/types';

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

export default function NetworkingPage() {
  const router = useRouter();
  const [resources, setResources] = useState<NetworkingResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.getNetworkingResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load networking resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this networking resource?')) {
      try {
        await api.deleteNetworkingResource(id);
        loadResources();
      } catch (error) {
        console.error('Failed to delete networking resource:', error);
      }
    }
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <Title>Networking</Title>
          <Button onClick={() => router.push('/provision?type=networking')}>
            Provision New Network
          </Button>
        </Header>

        {loading ? (
          <LoadingState>Loading networking resources...</LoadingState>
        ) : resources.length === 0 ? (
          <EmptyState>
            <h3>No networking resources found</h3>
            <p>Create your first network to get started</p>
          </EmptyState>
        ) : (
          <ResourceGrid>
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                title={resource.name}
                details={[
                  { label: 'ID', value: resource.id },
                  { label: 'CIDR Block', value: resource.cidrBlock },
                ]}
                onView={() => console.log('View', resource.id)}
                onEdit={() => console.log('Edit', resource.id)}
                onDelete={() => handleDelete(resource.id)}
              />
            ))}
          </ResourceGrid>
        )}
      </PageContainer>
    </Layout>
  );
}
