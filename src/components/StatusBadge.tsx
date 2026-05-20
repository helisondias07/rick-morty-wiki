import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

type Status = 'Alive' | 'Dead' | 'unknown';

const Badge = styled.div<{ $status: Status }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  width: fit-content;

  background: ${({ $status }) =>
    $status === 'Alive'
      ? 'rgba(151, 206, 76, 0.15)'
      : $status === 'Dead'
      ? 'rgba(214, 61, 46, 0.15)'
      : 'rgba(120, 120, 120, 0.15)'};

  color: ${({ $status }) =>
    $status === 'Alive'
      ? '#97ce4c'
      : $status === 'Dead'
      ? '#e05a47'
      : '#888'};
`;

const Dot = styled.span<{ $status: Status }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  background: ${({ $status }) =>
    $status === 'Alive'
      ? '#97ce4c'
      : $status === 'Dead'
      ? '#e05a47'
      : '#888'};

  box-shadow: ${({ $status }) =>
    $status === 'Alive'
      ? '0 0 6px #97ce4c'
      : $status === 'Dead'
      ? '0 0 6px #e05a47'
      : 'none'};
`;

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  const { t } = useLanguage();

  const getLabel = () => {
    if (status === 'Alive') return t('status_alive');
    if (status === 'Dead') return t('status_dead');
    return t('status_unknown');
  };

  return (
    <Badge $status={status}>
      <Dot $status={status} />
      {getLabel()}
    </Badge>
  );
}
