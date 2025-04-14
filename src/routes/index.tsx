import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load route components
const Dashboard = lazy(() => import('../screens/Dashboard'));
const SubmissionDossier = lazy(() => import('../screens/SubmissionDossier'));
const AskMUA = lazy(() => import('../screens/AskMUA'));
const NotFound = lazy(() => import('../screens/NotFound'));
const SubmissionsPage = lazy(() => import('../pages/SubmissionsPage'));
const QuotesPage = lazy(() => import('../pages/QuotesPage'));
const RiskAnalysisPage = lazy(() => import('../pages/RiskAnalysisPage'));

// Create routes configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'submissions',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SubmissionsPage />
          </Suspense>
        ),
      },
      {
        path: 'submission/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SubmissionDossier />
          </Suspense>
        ),
      },
      {
        path: 'quotes',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <QuotesPage />
          </Suspense>
        ),
      },
      {
        path: 'risk-analysis',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RiskAnalysisPage />
          </Suspense>
        ),
      },
      {
        path: 'ask-mua',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AskMUA />
          </Suspense>
        ),
      },
    ],
  },
]);

// Router provider component
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter; 