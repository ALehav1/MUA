import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import Dashboard from './screens/Dashboard';
import SubmissionDossier from './screens/SubmissionDossier';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/submission/:id',
    element: <SubmissionDossier />,
  },
], {
  future: {
    v7_relativeSplatPath: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App; 