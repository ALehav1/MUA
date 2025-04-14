import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Placeholder components until we build the real ones
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  </div>
);

const Header: React.FC = () => (
  <header className="bg-white shadow mb-8">
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900">MUA Project</h1>
    </div>
  </header>
);

const Navigation: React.FC = () => (
  <nav className="bg-white shadow mb-8">
    <div className="container mx-auto px-4 py-4">
      <div className="flex space-x-6">
        <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
        <a href="/quotes" className="text-gray-700 hover:text-gray-900">Quotes</a>
        <a href="/submissions" className="text-gray-700 hover:text-gray-900">Submissions</a>
        <a href="/risk-analysis" className="text-gray-700 hover:text-gray-900">Risk Analysis</a>
      </div>
    </div>
  </nav>
);

// Placeholder pages
const HomePage: React.FC = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Welcome to MUA</h2>
    <p className="text-gray-600">Your commercial casualty underwriting assistant.</p>
  </div>
);

const QuotesPage: React.FC = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Quotes</h2>
    <p className="text-gray-600">Manage your quotes here.</p>
  </div>
);

const SubmissionsPage: React.FC = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Submissions</h2>
    <p className="text-gray-600">Handle submissions here.</p>
  </div>
);

const RiskAnalysisPage: React.FC = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Risk Analysis</h2>
    <p className="text-gray-600">Analyze risks here.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Header />
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
            <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
          </Routes>
        </main>
      </Layout>
    </Router>
  );
};

export default App;
