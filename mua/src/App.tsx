import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import SubmissionDossier from './screens/SubmissionDossier';
import NewSubmission from './screens/NewSubmission';
import './App.css';
import { RepoInput } from './components/RepoInput';

// MCP tracking and component context logic has been fully removed from user-facing code.
// If MCP developer/automation tracking is needed, see src/devtools/MCPProvider.tsx and src/devtools/useMCP.ts.

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submissions/:id" element={<SubmissionDossier />} />
          <Route path="/submissions/new" element={<NewSubmission />} />
        </Routes>
        <RepoInput />
      </div>
    </Router>
  );
};

export default App;