import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Settings, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useChurch } from '../contexts/ChurchContext';
import AgendaModal from '../components/AgendaModal';
import CaveLogo from '../components/CaveLogo';

const MOCK_RITUAIS = [
  { id: '1', title: 'Oração Matinal', period: 'matinal', completed: true },
  { id: '2', title: 'Leitura de Tiago 1', period: 'matinal', completed: false },
  { id: '3', title: 'Jejum Mídia Social', period: 'matinal', completed: false }
];

const MOCK_AGENDA = [
  { id: '1', title: 'Culto de Ensino', schedule_time: '2026-03-24T20:00:00-03:00' }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'matinal' | 'noturno'>('matinal');
  const [rituais, setRituais] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [streak, setStreak] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Tenta puxar do Supabase (com fallback pros Mocks se falhar / chaves não configuradas)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const [ritualsRes, agendaRes, profileRes] = await Promise.all([
          supabase.from('rituais').select('*').eq('user_id', user.id),
          supabase.from('agenda').select('*').eq('user_id', user.id).gte('schedule_time', new Date().toISOString()),
          supabase.from('profiles').select('streak_days').eq('id', user.id).single()
        ]);

        setRituais(ritualsRes.data?.length ? ritualsRes.data : MOCK_RITUAIS);
        setAgenda(agendaRes.data?.length ? agendaRes.data : MOCK_AGENDA);
        if (profileRes.data) setStreak(profileRes.data.streak_days);
      } else {
        throw new Error("No user");
      }
    } catch (e) {
      // Fallbacks para demonstração
      setRituais(MOCK_RITUAIS);
      setAgenda(MOCK_AGENDA);
      setStreak(12);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const currentRituais = rituais.filter(r => r.period === activeTab);
  const { church } = useChurch();
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Rotate banners every 5 seconds if there are multiple
  useEffect(() => {
    if (church?.banner_urls && church.banner_urls.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % church.banner_urls!.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [church]);

  // Handle Agenda Success
  const handleAgendaSuccess = () => {
    fetchDashboardData();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 gap-6 overflow-y-auto no-scrollbar pb-6 -mt-4">
      
      {/* Dynamic Church Banner */}
      {church && church.banner_urls && church.banner_urls.length > 0 && (
        <div className="w-full h-32 md:h-48 rounded-[32px] overflow-hidden relative shadow-xl shrink-0 -mx-4 md:-mx-8 mb-2">
          {church.banner_urls.map((url, idx) => (
             <img 
               key={idx}
               src={url} 
               alt={`Banner ${idx}`} 
               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                 idx === currentBannerIndex ? 'opacity-100' : 'opacity-0'
               }`} 
             />
          ))}
          {/* Overlay gradient so contents below don't conflict visually */}
          <div className="absolute inset-0 bg-gradient-to-t from-caverna-bg to-transparent" />
        </div>
      )}

      {/* Grid columns - Layout organizado como no Modo Caverna */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 min-h-[400px] auto-rows-fr">
      
      {/* Column 1: Streak / Caverna */}
      <div className="bg-caverna-card rounded-[32px] p-8 flex flex-col justify-between border border-white/5 relative overflow-hidden group shadow-xl lg:row-span-2">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-1">
            Você está há <span className="text-caverna-accent">{streak} dias</span>
          </h2>
          <h2 className="text-2xl font-bold text-caverna-accent mb-2">
            consecutivos
          </h2>
          <p className="text-zinc-400 font-medium">acessando a Caverna Mestra</p>
        </div>
        
        {/* Glow behind the cave */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-caverna-accent/10 rounded-full blur-[80px]" />

        {/* Abstract vector shape for the "Cave" */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[220px] opacity-90 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 flex justify-center">
          <CaveLogo size={120} className="text-zinc-800" strokeWidth={1} />
        </div>
      </div>

      {/* Column 2: Rituais */}
      <div className="bg-caverna-card rounded-[32px] p-8 flex flex-col border border-white/5 shadow-xl relative lg:row-span-2">
        <div className="flex justify-between items-center mb-6">
          <div className="border border-zinc-700 bg-zinc-900/50 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-white shadow-inner">
            RITUAIS
          </div>
          <button className="bg-caverna-accent/10 text-caverna-accent hover:bg-caverna-accent hover:text-zinc-900 p-2 rounded-xl transition-all">
            <Settings size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-6 border-b border-white/5 mb-6">
          <button 
            className={`pb-4 font-bold text-sm transition-colors relative ${activeTab === 'matinal' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setActiveTab('matinal')}
          >
            Matinal
            {activeTab === 'matinal' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-caverna-accent rounded-t" />}
          </button>
          <button 
            className={`pb-4 font-bold text-sm transition-colors relative ${activeTab === 'noturno' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setActiveTab('noturno')}
          >
            Noturno
            {activeTab === 'noturno' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-caverna-accent rounded-t" />}
          </button>
        </div>

        {/* Loading State or Data */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-3">
          {loading ? (
             <div className="animate-pulse flex flex-col items-center justify-center h-full text-zinc-600">Carregando...</div>
          ) : currentRituais.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 h-full">
               <p className="text-zinc-500 text-sm max-w-[200px]">
                 Nenhum ritual {activeTab}.
                 <br/><br/>
                 Adicione um item para realizar o ritual
               </p>
             </div>
          ) : (
             currentRituais.map((ritual) => (
               <div key={ritual.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                 ritual.completed ? 'bg-caverna-accent/5 border-caverna-accent/30' : 'bg-zinc-900/50 border-white/5'
               }`}>
                 <span className={`text-sm font-medium ${ritual.completed ? 'text-white' : 'text-zinc-400'}`}>{ritual.title}</span>
                 <button className="text-zinc-500 hover:text-caverna-accent transition cursor-pointer">
                    {ritual.completed ? <CheckCircle2 className="text-caverna-accent" size={20} /> : <Circle size={20} />}
                 </button>
               </div>
             ))
          )}
        </div>

        <button className="w-full mt-4 bg-zinc-900/80 border border-caverna-accent/30 text-caverna-accent hover:bg-caverna-accent/10 py-4 rounded-2xl text-sm font-bold transition flex items-center justify-center space-x-2">
          <Plus size={18} />
          <span>Novo Item</span>
        </button>
      </div>

      {/* Column 3: Agenda do Dia */}
      <Link to="/agenda" className="bg-caverna-green rounded-[32px] p-8 flex flex-col relative overflow-hidden shadow-xl border border-caverna-green-text/20 hover:bg-caverna-green/90 transition-colors cursor-pointer group">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-caverna-green-text/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="mb-8 relative z-10">
          <div className="flex flex-col">
            <h2 className="text-white text-lg font-bold tracking-widest uppercase mb-1 flex items-center gap-2 group-hover:text-caverna-accent transition-colors">
              AGENDA DO DIA
              <ChevronRight size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h2>
            <span className="text-caverna-accent text-2xl mb-4">•</span>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Próximo Compromisso</h3>
              <p className="text-[#a8cfc6] text-sm font-medium capitalize">
                {currentDate}
              </p>
            </div>
          </div>
        </div>

        {/* Agenda Content */}
        <div className="flex-1 flex flex-col space-y-4 mb-4 relative z-10 overflow-y-auto no-scrollbar">
          {agenda.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-[#a8cfc6] text-sm max-w-[250px] leading-relaxed">
                Você ainda não tem nada marcado para hoje.<br/><br/>
                Adicione seus horários de refeição, treinos e rituais para manter sua rotina afinada.
              </p>
            </div>
          ) : (
             agenda.map((item) => (
                <div key={item.id} className="bg-[#144037]/80 backdrop-blur p-4 rounded-2xl border border-caverna-green-text/10">
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-xs text-[#a8cfc6]">{new Date(item.schedule_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
             ))
          )}
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/agenda');
          }}
          className="w-full relative z-10 border-2 border-caverna-green-text/20 text-[#a8cfc6] hover:bg-caverna-green-text hover:text-zinc-900 hover:border-caverna-green-text py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center space-x-2"
        >
          <Plus size={18} />
          <span>Adicionar compromisso</span>
        </button>
      </Link>

      {/* Column 4: Desafio Caverna */}
      <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-[32px] p-8 flex flex-col justify-between border border-purple-500/20 relative overflow-hidden shadow-xl group">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-white text-lg font-bold tracking-widest uppercase mb-1">
            DESAFIO CAVERNA
          </h2>
          <span className="text-purple-400 text-2xl mb-4">•</span>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Desafio Caverna</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Está pronto para o desafio?<br/>
              Comece agora e transforme sua rotina.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-3">
          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center space-x-2">
            <span>Começar Agora!</span>
          </button>
          
          <button className="w-full bg-purple-900/50 border border-purple-500/30 text-purple-200 hover:bg-purple-800/50 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center">
            <span>Histórico</span>
          </button>
        </div>
      </div>

      {/* Column 5: Flow Produtividade */}
      <div className="bg-gradient-to-br from-blue-900/80 to-cyan-900/80 rounded-[32px] p-8 flex flex-col border border-blue-500/20 relative overflow-hidden shadow-xl group">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 mb-6">
          <h2 className="text-white text-lg font-bold tracking-widest uppercase mb-1">
            FLOW PRODUTIVIDADE
          </h2>
          <span className="text-blue-400 text-2xl mb-4">•</span>
          <h3 className="text-xl font-bold text-white mb-4">Produtividade</h3>
          
          {/* Métricas */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-blue-200 text-sm">Estudos</span>
              <span className="text-white font-bold text-lg">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200 text-sm">Descanso</span>
              <span className="text-white font-bold text-lg">0</span>
            </div>
          </div>
          
          {/* Dias da semana */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-blue-300 font-medium">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center">
            <span>Ativar</span>
          </button>
        </div>
      </div>

      </div>

      {/* Modals */}
      <AgendaModal 
        isOpen={isAgendaModalOpen} 
        onClose={() => setIsAgendaModalOpen(false)} 
        onSuccess={handleAgendaSuccess} 
      />
    </div>
  );
};

export default Dashboard;
