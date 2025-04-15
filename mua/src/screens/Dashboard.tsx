import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSubmissions } from '../data/mockData';

// MCP tracking and component context logic has been fully removed from user-facing code.
// If MCP developer/automation tracking is needed, see src/devtools/MCPProvider.tsx and src/devtools/useMCP.ts.

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleRowClick = (submissionId: string) => {
    navigate(`/submission/${submissionId}`);
  };

  const recentSubmissions = mockSubmissions
    .sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime())
    .slice(0, 5);

  const pendingReviews = mockSubmissions
    .filter(submission => submission.status === 'In Review')
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/submissions/new')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              New Submission
            </button>
            <button
              onClick={() => navigate('/quotes')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Quotes
            </button>
            <button
              onClick={() => navigate('/risk-analysis')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Risk Analysis
            </button>
          </div>
        </div>

        {/* Recent Submissions Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Submissions</h2>
          <div className="space-y-3">
            {recentSubmissions.map(submission => (
              <div
                key={submission.submissionId}
                onClick={() => handleRowClick(submission.submissionId)}
                className="flex justify-between items-center p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              >
                <div>
                  <div className="font-medium">{submission.insuredName}</div>
                  <div className="text-sm text-gray-500">{new Date(submission.dateReceived).toLocaleDateString()}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  submission.status === 'New' ? 'bg-blue-100 text-blue-800' :
                  submission.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                  submission.status === 'Quoted' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {submission.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Reviews Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Reviews</h2>
          <div className="space-y-3">
            {pendingReviews.map(submission => (
              <div
                key={submission.submissionId}
                onClick={() => handleRowClick(submission.submissionId)}
                className="flex justify-between items-center p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              >
                <div>
                  <div className="font-medium">{submission.insuredName}</div>
                  <div className="text-sm text-gray-500">Risk Score: {submission.riskAnalysis.overallScore}</div>
                </div>
                <div className="text-sm text-gray-500">{submission.broker}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Submissions Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">All Submissions</h2>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insured Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Broker
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockSubmissions.map((submission) => (
                <tr
                  key={submission.submissionId}
                  onClick={() => handleRowClick(submission.submissionId)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {submission.insuredName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.submissionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      submission.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      submission.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                      submission.status === 'Quoted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.riskAnalysis.overallScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(submission.dateReceived).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.broker}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;