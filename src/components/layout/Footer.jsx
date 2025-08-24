import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto ml-0 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left mb-2 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} FlexiFi. Hak Cipta Dilindungi.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-end">
              Dibuat dengan <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" /> untuk manajemen keuangan yang lebih baik
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
