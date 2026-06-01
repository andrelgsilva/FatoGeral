import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from '../components/ProtectedRoute';
import { AuthenticatedLayout } from '../components/AuthenticatedLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Trends from '../pages/Trends';
import History from '../pages/History';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';
import AcessoNegado from '../pages/AcessoNegado';
import { useAuth } from '../contexts/AuthContext';
import AnalysisDetail from '../pages/AnalysisDetail';

function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function LoginRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Login />;
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginRoute /> },
      { path: '/register', element: <Register /> },
      { path: '/trends', element: <Trends /> },
      { path: '/acesso-negado', element: <AcessoNegado /> },

      {
        element: <ProtectedRoute />,
        children: [
          {
            // AuthenticatedLayout envolve todas as páginas protegidas
            element: <AuthenticatedLayout />,
            children: [
              { path: '/', element: <Home /> },
              { path: '/history', element: <History /> },
              { path: '/analysis/:id', element: <AnalysisDetail /> },
              {
                element: <AdminRoute />,
                children: [{ path: '/admin', element: <Admin /> }],
              },
            ],
          },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);