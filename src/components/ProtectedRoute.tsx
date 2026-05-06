import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

interface ProtectedRouteProps {
  requiredRole: 'officer' | 'member';
}

/**
 * Guards a set of routes by role.
 *
 * - No session  → redirect to /login
 * - Wrong role  → redirect to the correct home for the user's actual role
 * - Correct role → render <Outlet />
 */
export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const session = useStore(s => s.session);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.role !== requiredRole) {
    const correctHome = session.role === 'officer' ? '/dashboard' : '/home';
    return <Navigate to={correctHome} replace />;
  }

  return <Outlet />;
}
