import { BarChart3, ChevronRight, Zap } from 'lucide-react';

const Insights = () => {
  return (
    <div className="text-caverna-text bg-caverna-bg p-8 space-y-8 animate-in fade-in duration-500">
        {/* Cabeçalho */}
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-5xl font-bold text-white">Altar de Foco</h1>
                <p className="text-caverna-muted mt-3 max-w-xl">Observe seus ritmos cognitivos e refine a maestria de seus rituais.</p>
            </div>
        </div>

        {/* Grid de Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Coluna Principal (2/3) */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-caverna-card border border-caverna-border rounded-xl p-8">
                    <h3 className="font-bold text-white text-xl">Cronologia do Foco</h3>
                    <p className="text-sm text-caverna-muted">Últimos 7 ciclos</p>
                    {/* Placeholder para o gráfico */}
                    <div className="h-64 mt-6 bg-caverna-bg/50 rounded-lg flex items-center justify-center">
                        <BarChart3 className="text-caverna-muted" size={48}/>
                    </div>
                </div>
                 <div className="bg-caverna-card border border-caverna-border rounded-xl p-8">
                    <h3 className="font-bold text-white text-xl">Profecias de Foco</h3>
                    <div className="border-l-4 border-caverna-accent pl-4 mt-4">
                        <h4 className="text-caverna-accent font-semibold">ORÁCULO DA MANHÃ</h4>
                        <p className="text-sm text-white">Sua atenção está mais brilhante entre 09:00 e 11:30. Dedique suas mais complexas incantações a esta janela.</p>
                    </div>
                    <button className="text-caverna-accent text-sm font-bold mt-4 flex items-center gap-2">REVELAR MAIS PROFECIAS <ChevronRight size={16} /></button>
                </div>
            </div>

            {/* Coluna Lateral (1/3) */}
            <div className="space-y-8">
                <div className="bg-caverna-card border border-caverna-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    <h3 className="font-bold text-white text-xl">Maestria de Ritual</h3>
                    <p className="text-sm text-caverna-muted">Taxa de sucesso</p>
                     {/* Placeholder para o gráfico circular */}
                    <div className="relative w-40 h-40 mt-4 flex items-center justify-center">
                        <svg className="absolute" width="160" height="160"><circle className="text-caverna-border" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80"/></svg>
                        <svg className="absolute" width="160" height="160"><circle className="text-caverna-accent" strokeWidth="12" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80"/></svg>
                        <p className="text-4xl font-bold">75%</p>
                    </div>
                </div>
                <div className="bg-caverna-card border border-caverna-border rounded-xl p-8 text-center">
                    <h4 className="font-bold text-white text-xl">Sequência Atual</h4>
                    <p className="text-7xl font-bold text-caverna-accent my-2">14 <span className="text-2xl text-caverna-muted">Dias</span></p>
                    <p className="text-xs text-caverna-muted uppercase tracking-widest">Devoção Contínua</p>
                </div>
                 <div className="bg-caverna-card border border-caverna-border rounded-xl p-6">
                    <h4 className="font-bold text-white">Conhecimento Oculto</h4>
                    <p className="text-sm text-caverna-muted">Você tem 3 insights analíticos aguardando extração.</p>
                    <button className="w-full bg-caverna-accent text-black font-bold py-2 px-4 rounded-lg mt-4 flex items-center justify-center gap-2 glow">
                        <Zap size={16}/> Extrair Agora
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Insights;
