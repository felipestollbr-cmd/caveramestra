import { useState, useEffect } from 'react';
import { Flame, Dumbbell, BookOpen, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// --- Type Definitions ---
interface Workout {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  is_completed: boolean;
}

// --- Mock Data and Functions ---
const mockWorkouts: Workout[] = [
  {
    id: '1', 
    title: 'Treino de Força (Peito e Tríceps)',
    category: 'Treino Físico',
    duration_minutes: 60,
    is_completed: true,
  },
  {
    id: '2', 
    title: 'Meditação Guiada para Foco',
    category: 'Treino Mental',
    duration_minutes: 15,
    is_completed: false,
  },
  {
    id: '3', 
    title: 'Leitura: "Meditações" de Marco Aurélio',
    category: 'Treino Filosófico',
    duration_minutes: 30,
    is_completed: true,
  },
  {
    id: '4',
    title: 'Desafio do Banho Gelado',
    category: 'Desafio de Resiliência',
    duration_minutes: 5, 
    is_completed: false,
  },
];

const fetchWorkoutsForUser = async (userId: string | undefined): Promise<Workout[]> => {
  console.log(`Fetching mock workouts for user ${userId}`);
  return new Promise(resolve => setTimeout(() => resolve(mockWorkouts), 400));
};
// --- End Mock Data ---


const ForjaDoTemplo = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      const data = await fetchWorkoutsForUser(user.id);
      setWorkouts(data);
      setLoading(false);
    };
    loadData();
  }, [user]);

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Treino Físico':
        return { icon: Dumbbell, color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'Treino Mental':
        return { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'Treino Filosófico':
        return { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' };
      case 'Desafio de Resiliência':
        return { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' };
      default:
        return { icon: Dumbbell, color: 'text-gray-400', bg: 'bg-gray-500/10' };
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
        <div className="text-center mb-10">
            <Flame className="mx-auto text-caverna-accent mb-4" size={40} />
            <h1 className="text-4xl font-bold mb-2">Forja do Templo</h1>
            <p className="text-zinc-400">Seu guia diário para o fortalecimento do corpo, mente e espírito.</p>
        </div>

        <div className="space-y-4">
            {workouts.map(workout => {
                const { icon: Icon, color, bg } = getCategoryStyle(workout.category);
                return (
                    <div key={workout.id} className={`p-5 rounded-xl border border-white/10 flex items-center justify-between transition-all hover:border-caverna-accent/50 hover:bg-zinc-800/50 ${workout.is_completed ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}>
                                <Icon className={color} size={24} />
                            </div>
                            <div>
                                <p className={`font-bold ${color}`}>{workout.category}</p>
                                <h3 className="font-semibold text-lg text-white">{workout.title}</h3>
                                <p className="text-xs text-zinc-400">{workout.duration_minutes} min</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {workout.is_completed && (
                                <span className="text-xs font-bold text-green-500 uppercase">Concluído</span>
                            )}
                             <ChevronRight className="text-zinc-600" size={20} />
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default ForjaDoTemplo;
