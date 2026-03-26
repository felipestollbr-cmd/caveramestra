import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Dumbbell, BookOpen, Users, DollarSign, LogOut, Calendar as CalendarIcon } from 'lucide-react';
import CaveLogo from './CaveLogo';
import { useChurch } from '../contexts/ChurchContext';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { church } = useChurch();
  const { role, signOut, user } = useAuth();

  return (
    <div className="flex h-screen bg-caverna-bg text-caverna-text overflow-hidden font-sans">
      
      {/* Floating Sidebar (Glassmorphism) */}
      <aside className="w-20 lg:w-64 flex flex-col justify-between m-4 mr-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 transition-all duration-300">
        
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-center lg:justify-start space-x-3 border-b border-white/5">
          {church && church.logo_url ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-black/40">
              <img src={church.logo_url} alt={church.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-caverna-accent to-amber-600 flex items-center justify-center shadow-lg shadow-caverna-accent/20 shrink-0">
              <CaveLogo size={24} className="text-zinc-900" strokeWidth={2.5} />
            </div>
          )}
          
          <div className="hidden lg:block leading-none truncate overflow-hidden">
            {church ? (
              <>
                <h1 className="text-sm font-bold tracking-tight text-white mb-0.5 truncate">{church.name}</h1>
                <h1 className="text-xs font-bold tracking-widest text-[#a8cfc6] uppercase">Membro</h1>
              </>
            ) : (
              <>
                <h1 className="text-lg font-bold tracking-tight text-white mb-0.5">Caverna</h1>
                <h1 className="text-sm font-bold tracking-widest text-caverna-accent uppercase">Mestra</h1>
              </>
            )}
          </div>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Central Mestra" exact={true} />
          <NavItem to="/ordem" icon={<Target size={20} />} label="Ordem no Caos" />
          <NavItem to="/forja" icon={<Dumbbell size={20} />} label="Forja do Templo" />
          <NavItem to="/cursos" icon={<BookOpen size={20} />} label="Cursos & Alcateia" />
          <NavItem to="/agenda" icon={<CalendarIcon size={20} />} label="Minha Agenda" />
          
          {role === 'admin' && (
            <div className="pt-6 mt-6 border-t border-white/5">
              <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden lg:block mb-2">Igreja</p>
              <NavItem to="/admin" icon={<Users size={20} />} label="Gestão Mestra" />
              <NavItem to="/financeiro" icon={<DollarSign size={20} />} label="Financeiro" />
            </div>
          )}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-white/5">
           <button onClick={signOut} className="flex items-center space-x-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors w-full p-2 lg:px-4 lg:py-3 rounded-xl group justify-center lg:justify-start">
             <div className="w-8 h-8 rounded-full border border-caverna-accent/30 overflow-hidden shrink-0">
               <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
             </div>
             <div className="hidden lg:flex flex-col items-start leading-tight">
               <span className="font-medium text-sm text-white truncate max-w-[120px]">{user?.email?.split('@')[0] || 'Meu Perfil'}</span>
               <span className="text-[10px] uppercase font-bold text-caverna-accent/80">{role === 'admin' ? 'Admin' : 'Membro'}</span>
             </div>
             <LogOut size={16} className="hidden lg:block ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
           </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 w-full h-full overflow-y-auto p-4 md:p-8 pt-4 relative">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, exact }: { to: string, icon: React.ReactNode, label: string, exact?: boolean }) => (
  <NavLink
    end={exact}
    to={to}
    className={({ isActive }) =>
      `flex items-center lg:space-x-3 px-0 justify-center lg:justify-start lg:px-4 py-3 rounded-2xl transition-all duration-300 relative group ${
        isActive 
          ? 'bg-caverna-accent/10 text-caverna-accent font-medium' 
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-caverna-accent rounded-r-full hidden lg:block" />
        )}
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`}>
          {icon}
        </div>
        <span className="hidden lg:block">{label}</span>
        
        {/* Tooltip for mobile sidebar */}
        <div className="lg:hidden absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      </>
    )}
  </NavLink>
);

export default Layout;
