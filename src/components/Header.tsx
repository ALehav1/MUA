import React from 'react';
import { useMCP } from '../hooks/useMCP';

const Header: React.FC = () => {
  const { trackComponentAdded } = useMCP();

  React.useEffect(() => {
    trackComponentAdded('Header', 'src/components/Header.tsx', []);
  }, [trackComponentAdded]);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">MUA Underwriting Platform</h1>
      </div>
    </header>
  );
};

export default Header; 