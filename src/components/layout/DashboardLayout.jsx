import { useState, memo } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

const DashboardLayout = memo(function DashboardLayout({
  children,
  onLogout,
  username,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar
        username={username}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <TopHeader
        onLogout={onLogout}
        username={username}
        onMobileMenuToggle={() => setIsMobileOpen(true)}
      />
      <main className="lg:ml-72 pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
});

export default DashboardLayout;
