'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { theme } from '@/styles/theme';
import { api } from '@/lib/api';

const DashboardContainer = styled.div`
  max-width: 1200px;
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes.xxl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
`;

const StatValue = styled.div`
  font-size: ${theme.fontSizes.xxl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text.secondary};
`;

const QuickActions = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
`;

const QuickActionsTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Servers', value: '0' },
    { label: 'Total Databases', value: '0' },
    { label: 'Storage Buckets', value: '0' },
    { label: 'Network Resources', value: '0' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servers, databases, storage, networking] = await Promise.allSettled([
          api.getServers(),
          api.getDatabases(),
          api.getStorage(),
          api.getNetworkingResources(),
        ]);

        setStats([
          {
            label: 'Total Servers',
            value: servers.status === 'fulfilled' ? servers.value.length.toString() : '0'
          },
          {
            label: 'Total Databases',
            value: databases.status === 'fulfilled' ? databases.value.length.toString() : '0'
          },
          {
            label: 'Storage Buckets',
            value: storage.status === 'fulfilled' ? storage.value.length.toString() : '0'
          },
          {
            label: 'Network Resources',
            value: networking.status === 'fulfilled' ? networking.value.length.toString() : '0'
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <DashboardContainer>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Manage and provision your cloud infrastructure</Subtitle>
        </Header>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatValue>{loading ? '...' : stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <QuickActions>
          <QuickActionsTitle>Quick Actions</QuickActionsTitle>
          <ActionsGrid>
            <Button onClick={() => router.push('/provision?type=server')}>
              Provision New Server
            </Button>
            <Button onClick={() => router.push('/provision?type=database')}>
              Provision New Database
            </Button>
            <Button onClick={() => router.push('/provision?type=storage')}>
              Provision New Storage
            </Button>
            <Button onClick={() => router.push('/provision?type=networking')}>
              Provision New Network
            </Button>
          </ActionsGrid>
        </QuickActions>
      </DashboardContainer>
    </Layout>
  );
}
