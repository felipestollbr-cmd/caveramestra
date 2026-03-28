import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, role, subscriptionStatus, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-caverna-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-caverna-accent" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se o usuário não for admin, verificamos a assinatura
  if (role !== 'admin' && subscriptionStatus !== 'active') {
    if (location.pathname !== '/assinar') {
      return <Navigate to="/assinar" replace />;
    }
  }

  // Lógica de acesso para rotas de admin
  if (location.pathname.startsWith('/admin') && role !== 'admin') {
     return <Navigate to="/dashboard" replace />;
  }

  // Lógica de acesso para a rota financeira
  if (location.pathname.startsWith('/financeiro') && !['admin', 'financeiro'].includes(role || '')) {
     return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
