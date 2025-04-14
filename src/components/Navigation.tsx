import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMCP } from '../hooks/useMCP';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { trackComponentAdded } = useMCP();

  React.useEffect(() => {
    trackComponentAdded('Navigation', 'src/components/Navigation.tsx', ['Link', 'useLocation']);
  }, [trackComponentAdded]);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/submissions', label: 'Submissions' },
    { path: '/quotes', label: 'Quotes' },
    { path: '/risk-analysis', label: 'Risk Analysis' },
    { path: '/ask-mua', label: 'Ask MUA' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                location.pathname === item.path
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 