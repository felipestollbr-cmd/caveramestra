import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Assinatura from './pages/Assinatura';
import Rituais from './pages/Rituais';
import Arquivo from './pages/Arquivo';
import Cursos from './pages/Cursos';
import Insights from './pages/Insights';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const noSidebarRoutes = ['/login', '/assinar'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-caverna-bg">
      {showSidebar && <Layout />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/assinar" element={<Assinatura />} />
          <Route path="/" element={<PrivateRoute />} />
          <Route path="/arquivo" element={<PrivateRoute />} />
          <Route path="/cursos" element={<PrivateRoute />} />
          <Route path="/insights" element={<PrivateRoute />} />
        </Routes>
      </main>
    </div>
  );
}

const PrivateRoute = () => {
  const { session, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      window.location.href = '/login';
    }
  }, [session, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caverna-accent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  switch (location.pathname) {
    case '/':
      return <Rituais />;
    case '/arquivo':
      return <Arquivo />;
    case '/cursos':
      return <Cursos />;
    case '/insights':
      return <Insights />;
    default:
      return <Rituais />;
  }
};

export default App;
