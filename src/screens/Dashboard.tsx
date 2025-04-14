import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSubmissions } from '../data/mockData';
import { StatusBadge } from '../components/common/StatusBadge';
import { useMCP } from '../hooks/useMCP';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { trackComponentAdded } = useMCP();

  React.useEffect(() => {
    trackComponentAdded('Dashboard', 'src/screens/Dashboard.tsx', ['StatusBadge']);
  }, [trackComponentAdded]);

  // Get recent submissions (last 3)
  const recentSubmissions = mockSubmissions.slice(0, 3);

  // Get submissions that need review
  const pendingReviews = mockSubmissions.filter(
    submission => submission.status === 'In Review' || submission.status === 'Needs Info'
  );

  // Calculate key metrics
  const totalSubmissions = mockSubmissions.length;
  const averageRiskScore = mockSubmissions.reduce((acc, curr) => acc + curr.riskAnalysis.overallScore, 0) / totalSubmissions;
  const highRiskSubmissions = mockSubmissions.filter(sub => sub.riskAnalysis.overallScore < 60).length;

  const handleViewSubmission = (submissionId: string) => {
    navigate(`/submission/${submissionId}`);
  };

  const handleViewAllSubmissions = () => {
    navigate('/submissions');
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button
          onClick={handleViewAllSubmissions}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          View All Submissions
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Total Submissions</h2>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{totalSubmissions}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Average Risk Score</h2>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{averageRiskScore.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">High Risk Submissions</h2>
          <p className="mt-2 text-3xl font-semibold text-red-600">{highRiskSubmissions}</p>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="rounded-lg bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Submissions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentSubmissions.map((submission) => (
            <div
              key={submission.submissionId}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleViewSubmission(submission.submissionId)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-indigo-600">{submission.insuredName}</h3>
                  <p className="text-sm text-gray-500">{submission.lineOfBusiness}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <StatusBadge status={submission.status} />
                  <span className={`text-sm font-medium ${
                    submission.riskAnalysis.overallScore >= 75 ? 'text-green-600' :
                    submission.riskAnalysis.overallScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    Risk Score: {submission.riskAnalysis.overallScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="rounded-lg bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pending Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingReviews.length > 0 ? (
            pendingReviews.map((submission) => (
              <div
                key={submission.submissionId}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewSubmission(submission.submissionId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-indigo-600">{submission.insuredName}</h3>
                    <p className="text-sm text-gray-500">{submission.lineOfBusiness}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={submission.status} />
                    <span className={`text-sm font-medium ${
                      submission.riskAnalysis.overallScore >= 75 ? 'text-green-600' :
                      submission.riskAnalysis.overallScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      Risk Score: {submission.riskAnalysis.overallScore}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-sm text-gray-500">
              No pending reviews at this time
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/submissions')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              View All Submissions
            </button>
            <button
              onClick={() => navigate('/quotes')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Manage Quotes
            </button>
            <button
              onClick={() => navigate('/risk-analysis')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Risk Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 