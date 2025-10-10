'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ResourceCard from '@/components/ResourceCard';
import Button from '@/components/Button';
import ConfirmDialog from '@/components/ConfirmDialog';
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

interface Bucket {
  name: string;
  createdAt: string;
}

export default function StoragePage() {
  const router = useRouter();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; bucketName: string | null }>({
    isOpen: false,
    bucketName: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://deriv-space-yaml.flows.pstmn.io/api/default/LIST-S3-BUCKETS', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buckets');
      }

      const data = await response.json();
      console.log('Flow response:', JSON.stringify(data, null, 2));

      // Parse the Flow response format: data.body[1].ListAllMyBucketsResult[1].Buckets
      let bucketList = [];

      try {
        if (data?.body && Array.isArray(data.body) && data.body.length > 1) {
          const result = data.body[1]?.ListAllMyBucketsResult;
          if (result && Array.isArray(result) && result.length > 1) {
            bucketList = result[1]?.Buckets || [];
          }
        }
      } catch (parseError) {
        console.error('Error parsing bucket list structure:', parseError);
      }

      console.log('Bucket list:', bucketList);

      const parsedBuckets: Bucket[] = (bucketList || []).map((bucketWrapper: any) => {
        // Each bucket is: {"Bucket": [{"Name": [...]}, {"CreationDate": [...]}]}
        const bucketData = bucketWrapper.Bucket || [];

        const name = bucketData[0]?.Name?.[0]?.['#text'] || '';
        const createdAt = bucketData[1]?.CreationDate?.[0]?.['#text'] || '';

        return { name, createdAt };
      }).filter((b: Bucket) => b.name); // Filter out invalid entries

      console.log('Parsed buckets:', parsedBuckets);

      setBuckets(parsedBuckets);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching buckets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (bucketName: string) => {
    setDeleteDialog({ isOpen: true, bucketName });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, bucketName: null });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.bucketName) return;

    try {
      setIsDeleting(true);

      const response = await fetch('https://deriv-space-yaml.flows.pstmn.io/api/default/DELETE-S3-BUCKET', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketName: deleteDialog.bucketName,
          region: 'us-east-1',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete bucket');
      }

      // Remove bucket from local state
      setBuckets(prev => prev.filter(b => b.name !== deleteDialog.bucketName));

      // Close dialog
      setDeleteDialog({ isOpen: false, bucketName: null });
    } catch (err: any) {
      console.error('Error deleting bucket:', err);
      alert(`Failed to delete bucket: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <Title>Storage ({buckets.length} buckets)</Title>
          <Button onClick={() => router.push('/provision?type=storage')}>
            Provision New Bucket
          </Button>
        </Header>

        {loading ? (
          <EmptyState>
            <h3>Loading buckets...</h3>
            <p>Fetching from AWS via Postman Flow</p>
          </EmptyState>
        ) : error ? (
          <EmptyState>
            <h3>Error loading buckets</h3>
            <p>{error}</p>
            <Button onClick={fetchBuckets} style={{ marginTop: '1rem' }}>
              Retry
            </Button>
          </EmptyState>
        ) : buckets.length === 0 ? (
          <EmptyState>
            <h3>No storage buckets found</h3>
            <p>Create your first bucket to get started</p>
          </EmptyState>
        ) : (
          <ResourceGrid>
            {buckets.map((bucket) => (
              <ResourceCard
                key={bucket.name}
                title={bucket.name}
                details={[
                  { label: 'Type', value: 'S3 Bucket' },
                  { label: 'Region', value: 'us-east-1' },
                  { label: 'Created', value: new Date(bucket.createdAt).toLocaleDateString() },
                ]}
                onDelete={() => handleDeleteClick(bucket.name)}
              />
            ))}
          </ResourceGrid>
        )}

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete S3 Bucket"
          message={`Are you sure you want to delete the bucket "${deleteDialog.bucketName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={isDeleting}
        />
      </PageContainer>
    </Layout>
  );
}
