import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import { useMCP } from '../hooks/useMCP';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { trackComponentAdded } = useMCP();

  React.useEffect(() => {
    trackComponentAdded('Layout', 'src/components/Layout.tsx', ['Header', 'Navigation', 'Outlet']);
  }, [trackComponentAdded]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Layout; 