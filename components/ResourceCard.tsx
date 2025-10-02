'use client';

import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface ResourceCardProps {
  title: string;
  details: { label: string; value: string }[];
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Card = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const IconPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.inverse};
  font-weight: ${theme.fontWeights.bold};
  font-size: ${theme.fontSizes.lg};
`;

const CardTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.fontSizes.sm};
`;

const DetailLabel = styled.span`
  color: ${theme.colors.text.secondary};
`;

const DetailValue = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeights.medium};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  transition: all 0.2s ease;
  background: ${props => {
    if (props.$variant === 'primary') return theme.colors.primary;
    if (props.$variant === 'danger') return theme.colors.error;
    return theme.colors.surface;
  }};
  color: ${props => props.$variant === 'primary' || props.$variant === 'danger'
    ? theme.colors.text.inverse
    : theme.colors.text.primary};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export default function ResourceCard({ title, details, onView, onEdit, onDelete }: ResourceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
        <IconPlaceholder>
          {title.charAt(0).toUpperCase()}
        </IconPlaceholder>
      </CardHeader>
      <CardDetails>
        {details.map((detail, index) => (
          <DetailRow key={index}>
            <DetailLabel>{detail.label}:</DetailLabel>
            <DetailValue>{detail.value}</DetailValue>
          </DetailRow>
        ))}
      </CardDetails>
      <CardActions>
        {onView && (
          <ActionButton onClick={onView}>View</ActionButton>
        )}
        {onEdit && (
          <ActionButton onClick={onEdit}>Edit</ActionButton>
        )}
        {onDelete && (
          <ActionButton $variant="danger" onClick={onDelete}>Delete</ActionButton>
        )}
      </CardActions>
    </Card>
  );
}
