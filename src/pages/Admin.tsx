import { Users as UsersIcon, Settings, ShieldCheck, MoreVertical, Search } from 'lucide-react';

const Admin = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-zinc-400">Gerencie membros, desafios e permissões da igreja.</p>
        </div>
        <button className="bg-white text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition">
          + Convidar Membro
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Membros" value="1,204" icon={<UsersIcon />} trend="+12%" />
        <StatCard title="Em Desafio ATIVO" value="842" icon={<ShieldCheck />} trend="+5%" />
        <StatCard title="Trilhas Concluídas" value="3.4k" icon={<Settings />} trend="+22%" />
      </div>

      {/* Users Table */}
      <div className="bg-caverna-card border border-zinc-800 rounded-3xl overflow-hidden mt-8">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Membros Recentes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar membro..." 
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-caverna-orange"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-400 text-sm">
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Papel</th>
                <th className="px-6 py-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <UserRow name="João Silva" email="joao@igreja.com" status="Ativo" role="Membro" />
              <UserRow name="Maria Santos" email="maria@igreja.com" status="Ativo" role="Admin" />
              <UserRow name="Pedro Costa" email="pedro@igreja.com" status="Inativo" role="Membro" />
              <UserRow name="Ana Oliveira" email="ana@igreja.com" status="Ativo" role="Financeiro" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: any) => (
  <div className="bg-caverna-card p-6 rounded-3xl border border-zinc-800 flex items-center space-x-4">
    <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-caverna-orange border border-zinc-800">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <span className="text-xs font-medium text-emerald-500">{trend}</span>
      </div>
    </div>
  </div>
);

const UserRow = ({ name, email, status, role }: any) => (
  <tr className="hover:bg-zinc-900/30 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex flex-shrink-0 items-center justify-center text-xs font-bold text-zinc-400">
          {name.charAt(0)}
        </div>
        <span className="text-white font-medium">{name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-zinc-400 text-sm">{email}</td>
    <td className="px-6 py-4">
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-zinc-400 text-sm">{role}</td>
    <td className="px-6 py-4 text-right">
      <button className="text-zinc-500 hover:text-white transition p-1">
        <MoreVertical size={18} />
      </button>
    </td>
  </tr>
);

export default Admin;
