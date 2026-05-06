import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './components/RootLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import MemberHomePage from './pages/MemberHomePage';
import ScanQRPage from './pages/ScanQRPage';

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Officer-only routes
  {
    element: <ProtectedRoute requiredRole="officer" />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/events',    element: <EventsPage /> },
        ],
      },
    ],
  },

  // Member-only routes
  {
    element: <ProtectedRoute requiredRole="member" />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: '/home', element: <MemberHomePage /> },
          { path: '/scan', element: <ScanQRPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
