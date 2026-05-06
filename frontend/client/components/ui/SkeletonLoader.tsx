import React from 'react';

type Props = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
};

function SkeletonLoader({ width = '100%', height = 16, borderRadius = 6, className = '' }: Props) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : `${borderRadius}`,
  };

  return (
    <div
      className={`bg-libsmart-slate/10 overflow-hidden relative animate-pulse ${className}`}
      style={style}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-r from-libsmart-slate/10 via-libsmart-slate/20 to-libsmart-slate/10 opacity-70" />
    </div>
  );
}

export default React.memo(SkeletonLoader);
