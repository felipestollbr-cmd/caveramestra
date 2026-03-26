import { useState, useEffect } from 'react';
import { Target, Image as ImageIcon, BookOpen, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MOCK_METAS = [
  { id: '1', title: 'Ler a Bíblia em 1 ano', current_value: 45, target_value: 100, color: 'bg-blue-500' },
  { id: '2', title: 'Juntar R$ 10.000 para missões', current_value: 70, target_value: 100, color: 'bg-emerald-500' },
  { id: '3', title: 'Treinar 4x por semana', current_value: 30, target_value: 100, color: 'bg-caverna-accent' }
];

const OrdemNoCaos = () => {
  const [metas, setMetas] = useState<any[]>([]);

  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('metas_anuais').select('*').eq('user_id', user.id);
        setMetas(data?.length ? data : MOCK_METAS);
      } else {
        throw new Error('No Auth');
      }
    } catch {
      setMetas(MOCK_METAS);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div className="mb-8 pl-2">
         <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Ordem no Caos</h1>
         <p className="text-zinc-400 font-medium">Organize sua mente, defina suas metas e visualize seu futuro.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Metas Anuais */}
        <div className="bg-caverna-card/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 flex flex-col h-full hover:border-white/10 transition shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-caverna-accent/10 p-3 rounded-2xl text-caverna-accent shadow-inner">
                <Target size={26} />
              </div>
              <h2 className="text-xl font-bold text-white">Metas do Ano</h2>
            </div>
            <button className="text-zinc-400 hover:text-caverna-accent hover:bg-white/5 p-2 rounded-xl transition">
              <Plus size={22} />
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
             {metas.map(meta => (
                <GoalItem 
                  key={meta.id} 
                  title={meta.title} 
                  percentage={Math.round((meta.current_value / meta.target_value) * 100)} 
                  color={meta.color} 
                />
             ))}
          </div>
        </div>

        {/* Fontes de Conhecimento */}
        <div className="bg-caverna-card/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 flex flex-col h-full hover:border-white/10 transition shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400 shadow-inner">
                <BookOpen size={26} />
              </div>
              <h2 className="text-xl font-bold text-white">Fontes de Conhecimento</h2>
            </div>
            <button className="text-zinc-400 hover:text-blue-400 hover:bg-white/5 p-2 rounded-xl transition">
              <Plus size={22} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <BookCard title="O Poder do Hábito" author="Charles Duhigg" cover="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop" progress="80%" color="bg-blue-500" />
            <BookCard title="Cristianismo Puro" author="C.S. Lewis" cover="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop" progress="30%" color="bg-amber-500" />
          </div>
        </div>

      </div>

      {/* Lei da Atração (Quadro dos Sonhos) */}
      <div className="bg-caverna-card/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden">
         {/* Decorative Glow */}
         <div className="absolute -top-10 -right-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

         <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-400 shadow-inner">
              <ImageIcon size={26} />
            </div>
            <h2 className="text-xl font-bold text-white">Quadro de Visão</h2>
          </div>
          <p className="text-sm font-medium text-zinc-400 mb-8 relative z-10">Mantenha diante dos seus olhos as promessas de Deus para este ano.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
             <div className="aspect-[4/5] bg-zinc-900/50 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-zinc-500 hover:border-caverna-accent hover:text-caverna-accent transition cursor-pointer group hover:bg-white/5 shadow-inner">
               <Plus size={36} className="mb-3 group-hover:scale-110 transition-transform" />
               <span className="text-sm font-bold">Adicionar Foto</span>
             </div>
             
             {/* Mock uploaded photos */}
             <VisionBoardImage 
                src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=400&auto=format&fit=crop" 
                label="Família Unida" 
             />
             <VisionBoardImage 
                src="https://plus.unsplash.com/premium_photo-1663089688180-444ff0066e5d?q=80&w=400&auto=format&fit=crop" 
                label="Viagem Missionária" 
             />
             <VisionBoardImage 
                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop" 
                label="Saúde Plena" 
             />
          </div>
      </div>
    </div>
  );
};

const GoalItem = ({ title, percentage, color }: any) => (
  <div className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition">
    <div className="flex justify-between items-end mb-3">
      <span className="font-bold text-white tracking-wide">{title}</span>
      <span className="text-xs font-black text-zinc-400">{percentage}%</span>
    </div>
    <div className="w-full bg-zinc-800/80 shadow-inner rounded-full h-2.5 overflow-hidden">
      <div className={`${color} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

const BookCard = ({ title, author, cover, progress, color }: any) => (
  <div className="group cursor-pointer">
    <div className="aspect-[2/3] rounded-2xl overflow-hidden relative border border-white/10 mb-4 shadow-lg">
      <img src={cover} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-[#141417]/20 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
         <div className="w-full bg-zinc-800/80 backdrop-blur rounded-full h-1.5 overflow-hidden shadow-inner">
           <div className={`${color} h-1.5 rounded-full`} style={{ width: progress }}></div>
         </div>
      </div>
    </div>
    <h3 className="text-white font-bold text-sm truncate mb-0.5">{title}</h3>
    <p className="text-zinc-500 font-medium text-xs truncate">{author}</p>
  </div>
);

const VisionBoardImage = ({ src, label }: any) => (
  <div className="aspect-[4/5] rounded-3xl bg-zinc-800 overflow-hidden relative group shadow-xl border border-white/5">
     <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
     <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-transparent flex items-end p-5">
       <span className="text-white font-bold tracking-wide drop-shadow-md">{label}</span>
     </div>
  </div>
);

export default OrdemNoCaos;
