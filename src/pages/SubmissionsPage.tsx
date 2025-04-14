import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../components/common/Table';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockSubmissions } from '../data/mockData';
import type { Submission } from '../data/mockData';
import { useMCP } from '../hooks/useMCP';

const SubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { trackComponentAdded } = useMCP();

  React.useEffect(() => {
    trackComponentAdded('SubmissionsPage', 'src/pages/SubmissionsPage.tsx', ['Table', 'StatusBadge']);
  }, [trackComponentAdded]);

  const columns = [
    {
      header: 'Submission ID',
      accessor: 'submissionId' as keyof Submission,
      className: 'font-medium text-gray-900'
    },
    {
      header: 'Insured Name',
      accessor: 'insuredName' as keyof Submission
    },
    {
      header: 'Status',
      accessor: (submission: Submission) => <StatusBadge status={submission.status} />
    },
    {
      header: 'Line of Business',
      accessor: 'lineOfBusiness' as keyof Submission
    },
    {
      header: 'Date Received',
      accessor: 'dateReceived' as keyof Submission
    },
    {
      header: 'Broker',
      accessor: 'broker' as keyof Submission
    },
    {
      header: 'Risk Score',
      accessor: (submission: Submission) => (
        <div className="flex items-center">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${submission.riskAnalysis.overallScore >= 75 ? 'bg-green-100 text-green-800' :
              submission.riskAnalysis.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}
          `}>
            {submission.riskAnalysis.overallScore}
          </span>
        </div>
      )
    }
  ];

  const handleRowClick = (submission: Submission) => {
    // TODO: Navigate to submission detail page
    console.log('Clicked submission:', submission.submissionId);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Submissions</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all underwriting submissions including their status, risk score, and key details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add submission
          </button>
        </div>
      </div>
      <div className="mt-8">
        <Table<Submission>
          data={mockSubmissions}
          columns={columns}
          onRowClick={handleRowClick}
          className="shadow-sm"
        />
      </div>
    </div>
  );
};

export default SubmissionsPage; 