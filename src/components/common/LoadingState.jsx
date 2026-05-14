import React from 'react';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-2',
    xl: 'w-16 h-16 border-2',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-muted-foreground border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}

export function LoadingCard() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/4" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5, columns = 4 }) {
  return (
    <div className="animate-pulse space-y-2">
      {/* Header */}
      <div className="flex gap-4">
        {Array(columns).fill(0).map((_, i) => (
          <div key={i} className="flex-1 h-10 bg-muted rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array(rows).fill(0).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array(columns).fill(0).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 h-12 bg-muted rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="xl" />
        <p className="text-sm text-muted-foreground mt-3">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonText({ className = '', lines = 1 }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array(lines).fill(0).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${100 - (i * 10)}%` }}
        />
      ))}
    </div>
  );
}

export default LoadingSpinner;
