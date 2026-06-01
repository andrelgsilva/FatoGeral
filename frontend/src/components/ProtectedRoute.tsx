import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { role } = useAuth();
  return role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
}
