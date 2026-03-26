import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';

const Financeiro = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel Financeiro</h1>
          <p className="text-zinc-400">Acompanhamento de vendas, acessos e receita.</p>
        </div>
        <button className="bg-zinc-800 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-zinc-700 transition flex items-center space-x-2">
          <Download size={18} />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Main KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="md:col-span-2 bg-gradient-to-br from-caverna-orange/20 to-caverna-card p-1 rounded-3xl">
          <div className="bg-caverna-card h-full w-full rounded-[23px] p-8 border border-zinc-800/50">
             <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-zinc-400 font-medium mb-1">Receita Mensal (Estimada)</h3>
                  <div className="text-5xl font-bold text-white tracking-tight">R$ 42.500<span className="text-2xl text-zinc-500">,00</span></div>
               </div>
               <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                 <TrendingUp size={16} />
                 <span>+14.5%</span>
               </div>
             </div>
             
             {/* Mock Chart Area */}
             <div className="h-40 w-full mt-8 flex items-end space-x-2">
               {[40, 55, 30, 70, 45, 80, 65, 90, 60, 100, 75, 85].map((h, i) => (
                 <div key={i} className="flex-1 bg-caverna-orange/20 rounded-t-sm hover:bg-caverna-orange transition-all duration-300 relative group" style={{ height: `${h}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      R$ {h * 100}
                    </div>
                 </div>
               ))}
             </div>
             <div className="flex justify-between mt-2 text-xs text-zinc-500 font-medium">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Ago</span>
                <span>Set</span>
                <span>Out</span>
                <span>Nov</span>
                <span>Dez</span>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-caverna-card p-6 rounded-3xl border border-zinc-800 flex items-center space-x-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-blue-500 border border-zinc-800">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Assinaturas Ativas</p>
              <h3 className="text-2xl font-bold text-white">845</h3>
            </div>
          </div>
          
          <div className="bg-caverna-card p-6 rounded-3xl border border-zinc-800 flex items-center space-x-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-emerald-500 border border-zinc-800">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Ticket Médio</p>
              <h3 className="text-2xl font-bold text-white">R$ 50,29</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-caverna-card border border-zinc-800 rounded-3xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white mb-6">Transações Recentes</h2>
        <div className="space-y-4">
          <TransactionRow name="Assinatura Mensal - João S." date="Hoje, 14:30" amount="+ R$ 49,90" status="Aprovado" />
          <TransactionRow name="Assinatura Anual - Maria C." date="Hoje, 11:15" amount="+ R$ 499,00" status="Aprovado" />
          <TransactionRow name="Curso Fundamentos - Pedro M." date="Ontem, 16:45" amount="+ R$ 99,90" status="Pendente" />
          <TransactionRow name="Assinatura Mensal - Ana O." date="Ontem, 09:20" amount="+ R$ 49,90" status="Aprovado" />
        </div>
      </div>
    </div>
  );
};

const TransactionRow = ({ name, date, amount, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition">
    <div className="flex items-center space-x-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
      }`}>
        <DollarSign size={18} />
      </div>
      <div>
        <h4 className="text-white font-medium">{name}</h4>
        <p className="text-xs text-zinc-500 mt-0.5">{date}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-white font-bold">{amount}</div>
      <div className={`text-xs mt-0.5 font-medium ${
        status === 'Aprovado' ? 'text-emerald-500' : 'text-amber-500'
      }`}>
        {status}
      </div>
    </div>
  </div>
);

export default Financeiro;
