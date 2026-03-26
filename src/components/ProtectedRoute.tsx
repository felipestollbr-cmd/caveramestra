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

  // Se não tem usuário, manda pro login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se tem usuário e ele é apenas 'user' mas não pagou, manda pra página de assinar
  // Administradores passam direto
  if (role !== 'admin' && subscriptionStatus !== 'active') {
    // Evita redirect loop se já estivermos na página de assinar
    if (location.pathname !== '/assinar') {
      return <Navigate to="/assinar" replace />;
    }
  }

  // Se for uma rota de admin, e não for admin, volta pro dashboard
  if (['/admin', '/financeiro'].includes(location.pathname) && role !== 'admin') {
     return <Navigate to="/dashboard" replace />;
  }

  // Tudo certo, renderiza as rotas filhas (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
