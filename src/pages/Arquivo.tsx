import { Search, Book, Plus } from 'lucide-react';

const Arquivo = () => {
  return (
    <div className="text-caverna-text bg-caverna-bg p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho e Busca */}
      <div>
        <h1 className="text-5xl font-bold text-white">Biblioteca de Sabedoria</h1>
        <p className="text-caverna-muted mt-3 max-w-xl">Navegue pelos fragmentos de sua jornada para forjar a força futura.</p>
        
        <div className="mt-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-caverna-muted" size={20} />
          <input 
            type="text"
            placeholder="Buscar na biblioteca... (ex: Alquimia, Meditação)" 
            className="w-full bg-caverna-card border border-caverna-border rounded-lg p-4 pl-12 text-white placeholder-caverna-muted focus:outline-none focus:ring-2 focus:ring-caverna-accent transition-all"
          />
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex items-center gap-2">
        <button className="bg-caverna-accent/10 text-caverna-accent px-4 py-1.5 text-sm font-bold rounded-full">Tudo</button>
        <button className="bg-caverna-card text-caverna-muted hover:bg-caverna-border hover:text-white px-4 py-1.5 text-sm font-bold rounded-full transition-colors">Metafísica</button>
        <button className="bg-caverna-card text-caverna-muted hover:bg-caverna-border hover:text-white px-4 py-1.5 text-sm font-bold rounded-full transition-colors">Alquimia</button>
        <button className="bg-caverna-card text-caverna-muted hover:bg-caverna-border hover:text-white px-4 py-1.5 text-sm font-bold rounded-full transition-colors">Insights</button>
      </div>

      {/* Grid de Arquivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArchiveCard 
          category="Metafísica"
          title="A Dualidade do Silêncio"
          excerpt="O verdadeiro poder não está no ruído da greve, mas na quietude que a precede..." 
        />
        <ArchiveCard 
          category="Alquimia"
          title="Tintura da Clareza"
          excerpt="Receitas para a raiz de âmbar. Requer três horas de infusão sob a lua crescente..." 
        />
        <ArchiveCard 
          category="Insights"
          title="Sobre a Natureza do Arrependimento"
          excerpt="O arrependimento é o peso doce de uma pedra não virada, uma lição esperando para ser..." 
        />
        <ArchiveCard 
          category="Metafísica"
          title="O Paradoxo do Agora"
          excerpt="O tempo é um rio, mas a consciência é a margem. Estar presente é a única forma de..." 
        />
      </div>

       {/* Botão Flutuante */}
      <button className="fixed bottom-8 right-8 bg-caverna-accent text-black font-bold p-4 rounded-full shadow-lg glow flex items-center gap-2 animate-in fade-in zoom-in duration-300">
          <Plus size={24} />
      </button>

    </div>
  );
};

const ArchiveCard = ({ category, title, excerpt }: { category: string, title: string, excerpt: string }) => (
  <div className="bg-caverna-card border border-caverna-border rounded-xl p-6 flex flex-col gap-4 hover:border-caverna-accent/50 transition-colors group">
    <div className="flex items-center gap-2">
      <Book size={14} className="text-caverna-muted group-hover:text-caverna-accent transition-colors" />
      <p className="text-sm font-semibold text-caverna-muted group-hover:text-caverna-accent transition-colors">{category}</p>
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-sm text-caverna-muted flex-1">{excerpt}</p>
    <a href="#" className="text-sm font-bold text-caverna-accent opacity-0 group-hover:opacity-100 transition-opacity">Ler fragmento &rarr;</a>
  </div>
)

export default Arquivo;
