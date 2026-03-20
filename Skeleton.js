import React from 'react';

const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, style = {} }) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-hover) 50%, var(--bg-card) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }}
  />
);

export const SkeletonCard = () => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Skeleton width={120} height={14} />
      <Skeleton width={36} height={36} borderRadius={10} />
    </div>
    <Skeleton width={160} height={32} />
    <Skeleton width={100} height={12} />
  </div>
);

export const SkeletonRow = () => (
  <div style={{ display: 'flex', gap: 12, padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
    <Skeleton width={120} height={14} />
    <Skeleton width={80} height={14} />
    <Skeleton width={60} height={14} />
    <Skeleton width={80} height={14} />
    <Skeleton width={80} height={14} />
  </div>
);

export default Skeleton;