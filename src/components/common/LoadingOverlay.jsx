import { memo } from 'react';
import { Wallet } from 'lucide-react';

const LoadingOverlay = memo(function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Wallet className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Memuat data...</p>
    </div>
  );
});

export default LoadingOverlay;
