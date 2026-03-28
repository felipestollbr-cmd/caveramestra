import { useState, useEffect } from 'react';
import { Check, Zap, Target, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// --- Type Definitions ---
interface Mission {
  id: string;
  title: string;
  is_completed: boolean;
  category: string;
}

// --- Mock Data and Functions ---
const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Definir sua Missão de Vida',
    is_completed: true,
    category: 'Essencial'
  },
  {
    id: '2', 
    title: 'Organizar sua Agenda Semanal',
    is_completed: true,
    category: 'Tático' 
  },
  {
    id: '3',
    title: 'Planejar suas Metas Trimestrais',
    is_completed: false,
    category: 'Estratégico'
  },
    {
    id: '4',
    title: 'Leitura do Livro do Mês',
    is_completed: false,
    category: 'Cultural'
  },
];

const fetchMissionsForUser = async (userId: string | undefined): Promise<Mission[]> => {
  console.log(`Fetching mock missions for user ${userId}`);
  return new Promise(resolve => setTimeout(() => resolve(mockMissions), 300));
};
// --- End Mock Data ---

const OrdemNoCaos = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      const data = await fetchMissionsForUser(user.id);
      setMissions(data);
      setLoading(false);
    };
    loadData();
  }, [user]);

  const completedMissions = missions.filter(m => m.is_completed).length;
  const totalMissions = missions.length;
  const progress = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Essencial': return <Zap className="text-yellow-400" />;
      case 'Tático': return <Target className="text-blue-400" />;
      case 'Estratégico': return <ChevronRight className="text-green-400" />;
      case 'Cultural': return <BookOpen className="text-purple-400" />;
      default: return <Check className="text-gray-400" />;
    }
  };
  
  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caverna-accent"></div>
        </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Protocolo Ordem no Caos</h1>
        <p className="text-center text-zinc-400 mb-8">Complete as missões para conquistar clareza, foco e disciplina.</p>

        <div className="mb-8">
          <div className="w-full bg-zinc-700/50 rounded-full h-4 border border-zinc-600/50">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm font-bold mt-3 uppercase tracking-wider text-green-400">
            {Math.round(progress)}% Dominado
          </p>
        </div>

        <div className="bg-caverna-card/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
          <ul className="divide-y divide-white/10">
            {missions.map((mission) => (
              <li 
                key={mission.id}
                className={`p-5 flex items-center justify-between transition-colors duration-300 ${mission.is_completed ? 'bg-green-500/10' : 'hover:bg-zinc-800/60'}`}
              >
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-full border border-white/10">
                        {getCategoryIcon(mission.category)}
                    </div>
                    <span className={`font-medium ${mission.is_completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
                        {mission.title}
                    </span>
                </div>
                <button 
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${mission.is_completed ? 'bg-green-500 border-green-400' : 'border-zinc-600 hover:bg-caverna-accent hover:border-caverna-accent group'}`}>
                  <Check className={`transition-transform ${mission.is_completed ? 'text-white scale-100' : 'text-zinc-500 scale-0 group-hover:scale-100 group-hover:text-zinc-900'}`} size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrdemNoCaos;
