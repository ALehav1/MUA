import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Dashboard from './screens/Dashboard';
import SubmissionDossier from './screens/SubmissionDossier';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">MUA</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/submission/:id" element={<SubmissionDossier />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 