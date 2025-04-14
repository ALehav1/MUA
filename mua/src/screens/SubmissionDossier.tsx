import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockSubmissions } from '../data/mockData';

const SubmissionDossier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('summary');
  const [showAskMUA, setShowAskMUA] = useState(false);

  const submission = mockSubmissions.find(sub => sub.submissionId === id);

  if (!submission) {
    return <div>Submission not found</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Insured Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{submission.insuredName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{submission.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Line of Business</dt>
                    <dd className="mt-1 text-sm text-gray-900">{submission.lineOfBusiness}</dd>
                  </div>
                </dl>
              </div>
              <div className="card">
                <h3 className="text-lg font-medium mb-4">Financial Data</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Revenue</dt>
                    <dd className="mt-1 text-sm text-gray-900">${submission.enrichmentData.financialData.revenue.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employees</dt>
                    <dd className="mt-1 text-sm text-gray-900">{submission.enrichmentData.financialData.employees}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="mt-1 text-sm text-gray-900">{submission.enrichmentData.financialData.industry}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        );
      case 'risk':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Risk Analysis</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
                  <span className="text-lg font-bold">{submission.riskAnalysis.overallScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{ width: `${submission.riskAnalysis.overallScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-4">
                {submission.riskAnalysis.components.map((component) => (
                  <div key={component.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{component.name}</span>
                      <span className="text-primary-600 font-bold">{component.score}</span>
                    </div>
                    <p className="text-sm text-gray-600">{component.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'quote':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Quote Recommendation</h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    submission.quoteRecommendation.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                    submission.quoteRecommendation.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {submission.quoteRecommendation.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {submission.quoteRecommendation.coverage.map((coverage) => (
                  <div key={coverage.type} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{coverage.type}</h4>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-gray-500">Limit</dt>
                        <dd className="text-sm font-medium">${coverage.limit.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Deductible</dt>
                        <dd className="text-sm font-medium">${coverage.deductible.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Premium</dt>
                        <dd className="text-sm font-medium">${coverage.premium.toLocaleString()}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{submission.insuredName}</h2>
          <p className="text-sm text-gray-500">Submission ID: {submission.submissionId}</p>
        </div>
        <div className="flex space-x-4">
          <button
            className="btn btn-primary"
            onClick={() => setShowAskMUA(true)}
          >
            Ask MUA
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['summary', 'risk', 'quote'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}

      {showAskMUA && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Ask MUA</h3>
              <button
                onClick={() => setShowAskMUA(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              {submission.interactionLog.map((log, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-medium text-gray-900">Q: {log.question}</p>
                  <p className="mt-2 text-gray-600">A: {log.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionDossier; 