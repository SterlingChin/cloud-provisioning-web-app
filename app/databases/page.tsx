'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ResourceCard from '@/components/ResourceCard';
import Button from '@/components/Button';
import { theme } from '@/styles/theme';
import { api } from '@/lib/api';
import { Database } from '@/types';

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

export default function DatabasesPage() {
  const router = useRouter();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatabases();
  }, []);

  const loadDatabases = async () => {
    try {
      setLoading(true);
      const data = await api.getDatabases();
      setDatabases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load databases:', error);
      setDatabases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this database?')) {
      try {
        await api.deleteDatabase(id);
        loadDatabases();
      } catch (error) {
        console.error('Failed to delete database:', error);
      }
    }
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <Title>Databases</Title>
          <Button onClick={() => router.push('/provision?type=database')}>
            Provision New Database
          </Button>
        </Header>

        {loading ? (
          <LoadingState>Loading databases...</LoadingState>
        ) : databases.length === 0 ? (
          <EmptyState>
            <h3>No databases found</h3>
            <p>Create your first database to get started</p>
          </EmptyState>
        ) : (
          <ResourceGrid>
            {databases.map((database) => (
              <ResourceCard
                key={database.id}
                title={database.name}
                details={[
                  { label: 'ID', value: database.id },
                  { label: 'Engine', value: database.engine },
                  { label: 'Version', value: database.version },
                ]}
                onView={() => console.log('View', database.id)}
                onEdit={() => console.log('Edit', database.id)}
                onDelete={() => handleDelete(database.id)}
              />
            ))}
          </ResourceGrid>
        )}
      </PageContainer>
    </Layout>
  );
}
