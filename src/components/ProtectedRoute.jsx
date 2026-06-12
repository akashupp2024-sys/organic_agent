import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading, user } = useAuthContext();

  if (isAuthLoading) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-600">Checking your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
