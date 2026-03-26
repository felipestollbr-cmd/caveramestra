import { useState, useEffect } from 'react';
import { Dumbbell, Utensils, Droplets, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MOCK_TREINOS = [
  { day: 'Segunda', focus: 'Peito e Tríceps', status: 'done' },
  { day: 'Terça', focus: 'Costas e Bíceps', status: 'done' },
  { day: 'Quarta', focus: 'Descanso Ativo (Cardio)', status: 'pending' },
  { day: 'Quinta', focus: 'Pernas Completas', status: 'waiting' },
  { day: 'Sexta', focus: 'Ombros e Abdômen', status: 'waiting' }
];

const MOCK_REFEICOES = [
  { title: 'Café da Manhã', time: '07:30', items: ['4 Ovos mexidos', 'Mamão', 'Café Preto'], done: true },
  { title: 'Almoço', time: '12:30', items: ['200g Frango', '150g Arroz', 'Salada à vontade'], done: true },
  { title: 'Café da Tarde', time: '16:00', items: ['Whey Protein', 'Banana', 'Aveia'], done: false },
  { title: 'Jantar', time: '20:00', items: ['150g Patinho', 'Legumes no vapor'], done: false }
];

const ForjaDoTemplo = () => {
  const [treinos, setTreinos] = useState<any[]>([]);
  const [refeicoes, setRefeicoes] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Here you would query your established tables 'treinos' and 'refeicoes'
        // Simulating the fallback to mocks if tables are empty/not created yet
        setTreinos(MOCK_TREINOS);
        setRefeicoes(MOCK_REFEICOES);
      } else {
         throw new Error('No user');
      }
    } catch {
      setTreinos(MOCK_TREINOS);
      setRefeicoes(MOCK_REFEICOES);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div className="mb-8 pl-2">
         <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Forja do Templo</h1>
         <p className="text-zinc-400 font-medium">Cuide do seu corpo como templo do Espírito. Treinos, saúde e nutrição.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registro Diário - Status */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-gradient-to-br from-caverna-card/90 to-[#141417]/40 backdrop-blur-xl rounded-[32px] p-8 border border-white/5 shadow-xl relative overflow-hidden">
             
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />

             <div className="flex items-center space-x-3 mb-8 relative z-10">
                <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400 shadow-inner">
                  <Droplets size={26} />
                </div>
                <h2 className="text-xl font-bold text-white">Hidratação Hoje</h2>
             </div>
             
             <div className="text-center mb-8 relative z-10">
                <div className="text-6xl font-black text-white mb-2 tracking-tighter">1.2<span className="text-3xl text-zinc-500 font-medium tracking-normal ml-1">L</span></div>
                <p className="text-sm font-bold text-zinc-500 tracking-wide">META DA CAVERNA: 3.0L</p>
             </div>

             <div className="flex justify-center space-x-3 relative z-10">
               <button className="bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-inner transition active:scale-95">+ 200ml</button>
               <button className="bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-inner transition active:scale-95">+ 500ml</button>
             </div>
           </div>

           <div className="bg-caverna-card/80 backdrop-blur-xl rounded-[32px] p-8 border border-white/5 shadow-xl flex items-center justify-between group cursor-pointer hover:border-white/10 hover:bg-white/5 transition">
              <div>
                <p className="text-sm font-bold text-zinc-500 mb-1">Seu Peso Atual</p>
                <div className="text-3xl font-black text-white">78.5 <span className="text-lg text-zinc-500 font-medium">kg</span></div>
              </div>
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 shadow-inner flex items-center justify-center group-hover:bg-caverna-accent/10 transition">
                <ArrowRight className="text-zinc-500 group-hover:text-caverna-accent transition-transform group-hover:translate-x-1" />
              </div>
           </div>
        </div>

        {/* Treinos da Semana */}
        <div className="lg:col-span-2 bg-caverna-card/80 backdrop-blur-xl rounded-[32px] p-8 border border-white/5 shadow-xl">
           <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4">
              <div className="bg-caverna-accent/10 p-3 rounded-2xl text-caverna-accent shadow-inner">
                <Dumbbell size={26} />
              </div>
              <h2 className="text-xl font-bold text-white">Plano de Treino</h2>
            </div>
            <span className="bg-zinc-900 border border-caverna-accent/30 text-caverna-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-inner">
              Hipertrofia
            </span>
          </div>

          <div className="space-y-4">
             {treinos.map((t, i) => (
                <WorkoutDay key={i} day={t.day} focus={t.focus} status={t.status} />
             ))}
          </div>
        </div>

      </div>

      {/* Refeições e Nutrição */}
      <div className="bg-caverna-card/80 backdrop-blur-xl rounded-[32px] p-8 border border-white/5 shadow-xl">
         <div className="flex items-center space-x-4 mb-10">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 shadow-inner">
              <Utensils size={26} />
            </div>
            <h2 className="text-xl font-bold text-white">Refeições de Hoje</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {refeicoes.map((r, i) => (
                <MealCard key={i} title={r.title} time={r.time} items={r.items} done={r.done} />
             ))}
          </div>
      </div>

    </div>
  );
};

const WorkoutDay = ({ day, focus, status }: any) => (
  <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors ${
    status === 'done' ? 'bg-caverna-accent/5 border-caverna-accent/30' : 
    status === 'pending' ? 'bg-zinc-900/80 border-white/10 shadow-inner' : 
    'bg-zinc-900/30 border-white/5'
  }`}>
    <div className="flex items-center space-x-5">
      <div className={`w-3.5 h-3.5 rounded-full shadow-inner border border-white/10 ${
        status === 'done' ? 'bg-caverna-accent border-caverna-accent shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 
        status === 'pending' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse' : 
        'bg-zinc-700'
      }`} />
      <div>
        <p className={`text-sm font-bold w-24 ${status === 'pending' ? 'text-white' : status === 'done' ? 'text-zinc-200' : 'text-zinc-500'}`}>{day}</p>
      </div>
      <div>
        <p className={`text-sm font-medium ${status === 'done' ? 'text-zinc-400' : status === 'pending' ? 'text-zinc-300' : 'text-zinc-600'}`}>{focus}</p>
      </div>
    </div>
    {status === 'pending' && (
      <button className="bg-white text-zinc-900 text-xs font-black tracking-wider px-5 py-2 rounded-xl hover:bg-zinc-200 transition active:scale-95 shadow-lg">
        INICIAR
      </button>
    )}
    {status === 'done' && (
      <span className="text-xs font-black text-caverna-accent px-5 py-2 rounded-xl bg-caverna-accent/10 border border-caverna-accent/20">
        CONCLUÍDO
      </span>
    )}
  </div>
);

const MealCard = ({ title, time, items, done }: any) => (
  <div className={`p-6 rounded-3xl border ${done ? 'bg-zinc-900/30 border-emerald-500/20 shadow-inner' : 'bg-zinc-900/80 border-white/5 shadow-xl'}`}>
    <div className="flex justify-between items-start mb-6">
      <h3 className={`font-bold tracking-wide ${done ? 'text-emerald-500/80' : 'text-white'}`}>{title}</h3>
      <span className="text-xs font-bold text-zinc-500 bg-zinc-800/80 px-2.5 py-1 rounded shadow-inner">{time}</span>
    </div>
    <ul className="space-y-2 mb-6">
      {items.map((item: string, i: number) => (
        <li key={i} className={`text-sm font-medium ${done ? 'text-zinc-600 line-through' : 'text-zinc-400'}`}>• {item}</li>
      ))}
    </ul>
    {!done && (
      <button className="w-full text-xs font-black tracking-widest text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-white py-3.5 rounded-2xl transition active:scale-95 shadow-inner border border-white/5">
        MARCAR CONSUMIDA
      </button>
    )}
  </div>
);

export default ForjaDoTemplo;
