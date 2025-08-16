const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;