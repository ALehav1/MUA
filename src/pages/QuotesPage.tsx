import React from 'react';
import { useMCP } from '../hooks/useMCP';

const QuotesPage: React.FC = () => {
  const { trackComponentAdded } = useMCP();

  React.useEffect(() => {
    trackComponentAdded('QuotesPage', 'src/pages/QuotesPage.tsx', []);
  }, [trackComponentAdded]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Quotes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and review underwriting quotes for submissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotesPage; 