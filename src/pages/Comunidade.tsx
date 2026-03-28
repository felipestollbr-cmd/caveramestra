import { Users } from 'lucide-react';

const Comunidade = () => {
  return (
    <div className="text-white bg-[#111111] p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold text-white">Comunidade</h1>
          <p className="text-zinc-400 mt-3 max-w-xl">Conecte-se com outros membros da Caverna.</p>
        </div>
        <button className="bg-amber-500 text-black font-bold py-3 px-6 rounded-lg whitespace-nowrap flex items-center gap-2">
            <Users size={16} /> Entrar na Comunidade
        </button>
      </div>
    </div>
  );
};

export default Comunidade;
