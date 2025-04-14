import React from 'react';
import { useMCP } from '../hooks/useMCP';

const RiskAnalysisPage: React.FC = () => {
  const { trackComponentAdded } = useMCP();

  React.useEffect(() => {
    trackComponentAdded('RiskAnalysisPage', 'src/pages/RiskAnalysisPage.tsx', []);
  }, [trackComponentAdded]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Risk Analysis</h1>
          <p className="mt-2 text-sm text-gray-700">
            Analyze and evaluate risks for underwriting submissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisPage; 