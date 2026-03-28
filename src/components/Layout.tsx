import { Outlet, NavLink } from 'react-router-dom';
import { Swords, Archive, BarChart3, Users, User, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CaveLogo from './CaveLogo';

const Layout = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen bg-caverna-bg text-caverna-text font-sans">

      {/* Barra Lateral Estática */}
      <aside className="w-20 bg-caverna-bg border-r border-caverna-border flex flex-col items-center justify-between py-6">
        
        {/* Logo e Navegação Principal */}
        <div className="flex flex-col items-center space-y-8">
          <div className="h-10 w-10">
            <CaveLogo />
          </div>
          
          <nav className="flex flex-col items-center space-y-4">
            <NavItem to="/rituais" icon={<Swords size={24} />} label="Rituais" />
            <NavItem to="/cursos" icon={<BookOpen size={24} />} label="Cursos" />
            <NavItem to="/arquivo" icon={<Archive size={24} />} label="Arquivo" />
            <NavItem to="/insights" icon={<BarChart3 size={24} />} label="Insights" />
            <NavItem to="/comunidade" icon={<Users size={24} />} label="Comunidade" />
          </nav>
        </div>

        {/* Navegação Inferior (Conta e Sair) */}
        <div className="flex flex-col items-center space-y-4">
            <NavItem to="/conta" icon={<User size={24} />} label="Minha Conta" />
             <button onClick={signOut} className="flex items-center justify-center h-12 w-12 text-caverna-muted hover:text-caverna-accent rounded-lg transition-colors duration-200 group relative">
                <LogOut size={24} />
                <span className="absolute left-full ml-4 px-2 py-1 text-xs text-white bg-caverna-card border border-caverna-border rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                    Sair
                </span>
            </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center justify-center h-12 w-12 rounded-lg transition-colors duration-200 group relative ${
        isActive 
          ? 'bg-caverna-accent/10 text-caverna-accent' 
          : 'text-caverna-muted hover:text-caverna-accent'
      }`
    }
  >
    {icon}
    <span className="absolute left-full ml-4 px-2 py-1 text-xs text-white bg-caverna-card border border-caverna-border rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
      {label}
    </span>
  </NavLink>
);

export default Layout;
