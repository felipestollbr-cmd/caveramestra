import { Swords, Plus, ChevronRight, Timer, BarChart } from 'lucide-react';

const Rituais = () => {
  return (
    <div className="text-caverna-text bg-caverna-bg p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold text-white">Santuário</h1>
          <p className="text-caverna-muted mt-3 max-w-xl">Seu altar de foco e disciplina.</p>
        </div>
        <button className="bg-caverna-accent text-black font-bold py-3 px-6 rounded-lg whitespace-nowrap flex items-center gap-2 glow">
            <Plus size={16} /> Forjar Ritual
        </button>
      </div>

      {/* Seção do Timer e Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-caverna-card border border-caverna-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <Timer size={48} className="text-caverna-accent mb-4"/>
            <h2 className="text-3xl font-bold text-white">Ritual de Foco Ativo</h2>
            <p className="text-8xl font-thin text-caverna-text mt-4">25:00</p>
            <p className="text-caverna-muted">Deep Work</p>
        </div>
        <div className="bg-caverna-card border border-caverna-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <BarChart size={48} className="text-caverna-accent mb-4"/>
            <h2 className="text-3xl font-bold text-white">Horas em Foco</h2>
            <p className="text-6xl font-bold text-caverna-text mt-4">42.5</p>
            <p className="text-caverna-muted">Nesta semana</p>
        </div>
      </div>

      {/* Lista de Rituais Diários */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Rituais Diários</h2>
        <div className="space-y-4">
          <RitualItem title="Meditação Matinal" description="15 minutos de silêncio e foco." />
          <RitualItem title="Deep Work" description="Sessão de 90 minutos de trabalho focado." />
        </div>
      </div>
    </div>
  );
};

const RitualItem = ({ title, description }: { title: string, description: string }) => (
  <div className="bg-caverna-card border border-caverna-border rounded-lg p-6 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <div className="bg-caverna-accent/10 p-3 rounded-lg">
        <Swords size={20} className="text-caverna-accent" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-caverna-muted">{description}</p>
      </div>
    </div>
    <button className="text-caverna-accent hover:text-opacity-80">
      <ChevronRight size={24} />
    </button>
  </div>
);

export default Rituais;
