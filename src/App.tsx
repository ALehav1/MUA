import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import QuotesPage from './pages/QuotesPage';
import SubmissionsPage from './pages/SubmissionsPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import Dashboard from './screens/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 