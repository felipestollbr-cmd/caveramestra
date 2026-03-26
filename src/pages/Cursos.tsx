import { useState, useEffect } from 'react';
import { PlayCircle, Users, MessageSquare, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MOCK_COURSES = [
  { id: 1, title: 'Fundamentos da Fé', instructor: 'Pr. Leonardo', modules: 12, progress: '100%', featured: false, locked: false, image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'Liderança Extrema', instructor: 'Mestre Caverna', modules: 8, progress: '45%', featured: true, locked: false, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'Família Resiliente', instructor: 'Pr. Marcos Silva', modules: 6, progress: '0%', featured: false, locked: false, image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop' },
  { id: 4, title: 'Produtividade Bíblica', instructor: 'Convidado Mestre', modules: 10, progress: '0%', featured: false, locked: true, image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop' }
];

const Cursos = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCourses(MOCK_COURSES);
      } else {
        throw new Error('No auth');
      }
    } catch {
      setCourses(MOCK_COURSES);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pl-2">
         <div>
           <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Cursos & Alcateia</h1>
           <p className="text-zinc-400 font-medium">Expanda sua visão. Conecte-se com mestres e a comunidade Caverna Mestra.</p>
         </div>
         <div className="mt-6 md:mt-0 flex space-x-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl shadow-inner">
           <button className="bg-caverna-card text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg border border-white/5 transition">
             Trilhas
           </button>
           <button className="text-zinc-400 hover:bg-white/5 hover:text-white px-6 py-2.5 rounded-xl text-sm font-bold transition">
             Networking
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Trilhas em Destaque */}
         <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-bold text-white mb-6 ml-2">Trilhas de Estudo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {courses.map(course => (
                 <CourseCard key={course.id} {...course} />
               ))}
            </div>
         </div>

         {/* Comunidade / Ranking */}
         <div className="space-y-6">
            <div className="bg-caverna-card/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-xl">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center space-x-3">
                   <div className="bg-caverna-accent/10 p-2.5 rounded-xl text-caverna-accent shadow-inner">
                     <Crown size={22} />
                   </div>
                   <h2 className="text-lg font-bold text-white">Mestres</h2>
                 </div>
               </div>
               
               <div className="space-y-3">
                  <RankingUser pos={1} name="Leonardo A." pts="12K" me />
                  <RankingUser pos={2} name="João P." pts="11.5K" />
                  <RankingUser pos={3} name="Carlos M." pts="10.8K" />
                  <RankingUser pos={4} name="Rafael V." pts="9.2K" />
               </div>
               
               <button className="w-full mt-6 text-sm text-caverna-accent hover:text-caverna-accent-light hover:bg-caverna-accent/10 py-3 rounded-xl transition font-bold">Ranking Completo</button>
            </div>

            <div className="bg-gradient-to-br from-[#1e3a8a]/40 to-caverna-card backdrop-blur-xl rounded-[32px] p-8 border border-blue-900/30 shadow-xl relative overflow-hidden group hover:border-[#1e3a8a]/60 transition">
               
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none" />

               <div className="flex items-center space-x-3 mb-6 relative z-10">
                 <Users size={28} className="text-blue-400" />
                 <h2 className="text-xl font-bold text-white">Alcateia Global</h2>
               </div>
               <p className="text-sm text-blue-100/70 font-medium mb-8 relative z-10 leading-relaxed">
                 Junte-se a centenas de irmãos que estão construindo a sua Caverna. Network e oração conjunta.
               </p>
               <button className="w-full relative z-10 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition active:scale-95 flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/50 border border-blue-400/20">
                 <MessageSquare size={18} />
                 <span>Acessar Chat</span>
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

const CourseCard = ({ title, instructor, modules, image, progress, featured, locked }: any) => (
  <div className={`rounded-[32px] p-2 transition-all duration-300 relative group cursor-pointer ${
    featured ? 'bg-gradient-to-b from-caverna-accent/20 to-caverna-card shadow-xl shadow-caverna-accent/5 border border-caverna-accent/20' : 'bg-caverna-card/80 border border-white/5 hover:border-white/10 shadow-xl backdrop-blur-xl'
  }`}>
    <div className="aspect-[16/10] relative rounded-[24px] overflow-hidden shadow-inner">
      <img src={image} alt={title} className={`w-full h-full object-cover transition-transform duration-1000 ${locked ? 'grayscale opacity-20' : 'group-hover:scale-110 opacity-80'}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
      
      {!locked && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle size={64} strokeWidth={1.5} className="text-white drop-shadow-2xl hover:scale-110 transition-transform" />
        </div>
      )}

      {locked && (
        <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10 shadow-inner">
          <span className="text-xs font-black text-zinc-500 tracking-widest uppercase">Bloqueado</span>
        </div>
      )}

      <div className="absolute bottom-5 left-6 right-6">
        <span className="text-xs font-black text-caverna-accent uppercase tracking-widest mb-2 block">{modules} Módulos</span>
        <h3 className="text-2xl font-bold text-white leading-tight tracking-tight">{title}</h3>
      </div>
    </div>
    
    <div className="px-6 py-5 relative">
      <div className="flex justify-between items-end mb-4">
        <p className="text-sm text-zinc-400 font-medium tracking-wide">{instructor}</p>
        <span className="text-xs font-black text-white">{progress}</span>
      </div>
      <div className="w-full bg-zinc-900 shadow-inner rounded-full h-2 overflow-hidden border border-white/5">
        <div className="bg-caverna-accent h-2 rounded-full" style={{ width: progress }}></div>
      </div>
    </div>
  </div>
);

const RankingUser = ({ pos, name, pts, me }: any) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border transition ${me ? 'bg-caverna-accent/10 border-caverna-accent/30 shadow-inner' : 'bg-zinc-900/40 border-white/5 hover:bg-white/5'}`}>
    <div className="flex items-center space-x-4">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-inner border border-white/10 ${
        pos === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' : 
        pos === 2 ? 'bg-gradient-to-br from-zinc-300 to-zinc-500 text-black' : 
        pos === 3 ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-white' : 
        'bg-zinc-800 text-zinc-500'
      }`}>
        {pos}
      </div>
      <span className={`font-bold text-sm tracking-wide ${me ? 'text-caverna-accent' : 'text-white'}`}>{name}</span>
    </div>
    <span className="text-sm font-black text-zinc-500">{pts}</span>
  </div>
);

export default Cursos;
