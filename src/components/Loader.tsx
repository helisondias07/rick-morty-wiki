import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
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
`;

const ImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
`;

const Content = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Line = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '14px'};
`;

export function SkeletonCard() {
  return (
    <CardWrapper>
      <ImageSkeleton />
      <Content>
        <Line width="70%" height="18px" />
        <Line width="50%" />
        <Line width="60%" />
        <Line width="40%" height="32px" style={{ borderRadius: '10px' }} />
      </Content>
    </CardWrapper>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid transparent;
  border-top-color: #97ce4c;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  filter: drop-shadow(0 0 8px rgba(151, 206, 76, 0.3));
`;

export function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <Spinner />
    </div>
  );
}
