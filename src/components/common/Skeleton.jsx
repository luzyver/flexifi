import { memo } from 'react';

const Skeleton = memo(function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700/50 ${className}`}
    />
  );
});

export default Skeleton;
