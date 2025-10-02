'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ResourceCard from '@/components/ResourceCard';
import Button from '@/components/Button';
import { theme } from '@/styles/theme';

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

export default function StoragePage() {
  const router = useRouter();
  const [buckets] = useState([]);

  return (
    <Layout>
      <PageContainer>
        <Header>
          <Title>Storage</Title>
          <Button onClick={() => router.push('/provision?type=storage')}>
            Provision New Bucket
          </Button>
        </Header>

        {buckets.length === 0 ? (
          <EmptyState>
            <h3>No storage buckets found</h3>
            <p>Create your first bucket to get started</p>
          </EmptyState>
        ) : (
          <ResourceGrid>
            {/* Storage buckets will be displayed here */}
          </ResourceGrid>
        )}
      </PageContainer>
    </Layout>
  );
}
