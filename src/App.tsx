import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChurchProvider } from './contexts/ChurchContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Financeiro from './pages/Financeiro';
import OrdemNoCaos from './pages/OrdemNoCaos';
import ForjaDoTemplo from './pages/ForjaDoTemplo';
import Cursos from './pages/Cursos';
import Layout from './components/Layout';
import Assinatura from './pages/Assinatura';
import Agenda from './pages/Agenda';

function App() {
  return (
    <AuthProvider>
      <ChurchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/assinar" element={<Assinatura />} />
            
            {/* Protected Routes with Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ordem" element={<OrdemNoCaos />} />
                <Route path="/ordem-no-caos" element={<OrdemNoCaos />} />
                <Route path="/forja" element={<ForjaDoTemplo />} />
                <Route path="/cursos" element={<Cursos />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/agenda" element={<Agenda />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ChurchProvider>
    </AuthProvider>
  );
}

export default App;
