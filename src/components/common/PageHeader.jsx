import { Plus } from 'lucide-react';

const PageHeader = ({
  title,
  subtitle,
  icon = "plus-circle",
  actions = null,
  className = ""
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'plus-circle':
        return Plus;
      default:
        return Plus;
    }
  };

  const IconComponent = getIcon();

  return (
    <div className={`text-center mb-6 animate-fade-in ${className}`}>
      <div className="mb-4">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto">
          <IconComponent className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {actions && (
        <div className="mt-6">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
