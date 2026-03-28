import { User } from 'lucide-react';

const Conta = () => {
  return (
    <div className="text-white bg-[#111111] p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold text-white">Minha Conta</h1>
          <p className="text-zinc-400 mt-3 max-w-xl">Gerencie suas informações e preferências.</p>
        </div>
        <button className="bg-amber-500 text-black font-bold py-3 px-6 rounded-lg whitespace-nowrap flex items-center gap-2">
            <User size={16} /> Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default Conta;
