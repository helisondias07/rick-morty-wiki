import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -400px 0 }
  100% { background-position: 400px 0 }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg, 
    ${({ theme }) => theme.shimmerBase} 25%, 
    ${({ theme }) => theme.shimmerHighlight} 50%, 
    ${({ theme }) => theme.shimmerBase} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 8px;
`;

const CardWrapper = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.surfaceCard};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;

const ImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0;
`;

const Content = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;

  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.45rem;
  }
`;

const Line = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '14px'};
`;

const Spacer = styled.div`
  flex: 1;
`;

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 12 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <CardWrapper key={`skeleton-${idx}`} aria-busy="true" aria-hidden="true">
          <ImageSkeleton />
          <Content>
            <Line width="70%" height="20px" />
            <Line width="40%" height="16px" style={{ marginTop: '0.2rem' }} />
            <Spacer />
            <Line width="100%" height="40px" style={{ borderRadius: '10px', marginTop: '0.5rem' }} />
          </Content>
        </CardWrapper>
      ))}
    </>
  );
}
