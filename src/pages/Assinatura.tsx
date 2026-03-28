import { useState } from 'react';
import { Check, ArrowRight, QrCode, CreditCard, Loader2 } from 'lucide-react';
import CaveLogo from '../components/CaveLogo';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Assinatura = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'pix' | 'card'>('pix');

  const handleCheckout = () => {
    setLoading(true);
    // Placeholder para integração futura de Gateway (ex: Stripe, MercadoPago, Kiwify)
    setTimeout(() => {
      alert("Integração de pagamento a ser configurada pelo gateway.");
      setLoading(false);
    }, 1500);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-caverna-bg text-caverna-text flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow for Dark Gold theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-caverna-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-caverna-accent to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-caverna-accent/20 border border-white/10 p-4">
            <CaveLogo />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Liberte seu <span className="text-caverna-accent">Potencial Mestre</span>
          </h1>
          <p className="text-zinc-400 font-medium max-w-xl mx-auto text-lg">
            Sua assinatura encontra-se inativa. Para acessar as ferramentas de forja, networking e conhecimento da Caverna Mestra, escolha um plano abaixo.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Plano PIX */}
          <div 
            onClick={() => setMethod('pix')}
            className={`cursor-pointer bg-caverna-card/80 backdrop-blur-xl p-8 rounded-[32px] border-2 transition-all relative overflow-hidden group ${
              method === 'pix' ? 'border-caverna-accent shadow-2xl shadow-caverna-accent/10 scale-[1.02]' : 'border-caverna-border hover:border-white/20'
            }`}
          >
            {method === 'pix' && (
              <div className="absolute top-0 right-0 bg-caverna-accent text-zinc-900 text-xs font-bold px-4 py-1.5 rounded-bl-xl">MAIS VANTAJOSO</div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${method === 'pix' ? 'bg-caverna-accent/20 text-caverna-accent' : 'bg-zinc-800 text-zinc-400'}`}>
                <QrCode size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">À Vista no PIX</h3>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold text-caverna-accent">R$ 49</span>
              <span className="text-caverna-muted font-medium">/acesso total</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Acesso imediato à plataforma', 'Todos os rituais e treinamentos', 'Networking com a Alcateia', 'Economia e praticidade'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                  <Check size={18} className="text-caverna-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plano Parcelado */}
          <div 
            onClick={() => setMethod('card')}
            className={`cursor-pointer bg-caverna-card/80 backdrop-blur-xl p-8 rounded-[32px] border-2 transition-all relative overflow-hidden group ${
              method === 'card' ? 'border-caverna-accent shadow-2xl shadow-caverna-accent/10 scale-[1.02]' : 'border-caverna-border hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${method === 'card' ? 'bg-caverna-accent/20 text-caverna-accent' : 'bg-zinc-800 text-zinc-400'}`}>
                <CreditCard size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Cartão de Crédito</h3>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">6x</span>
              <span className="text-2xl font-bold text-white ml-2">R$ 9,20</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Acesso imediato à plataforma', 'Todos os rituais e treinamentos', 'Networking com a Alcateia', 'Pague aos poucos'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                  <Check size={18} className="text-caverna-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-12 text-center max-w-md mx-auto">
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-caverna-accent hover:bg-amber-400 text-zinc-900 font-bold py-5 px-8 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-[0_0_30px_rgba(232,142,10,0.3)] hover:shadow-[0_0_50px_rgba(232,142,10,0.5)] active:scale-95 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <span>Assinar via {method === 'pix' ? 'PIX' : 'Cartão'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            <p className="text-caverna-muted text-sm">Logado como: <strong className="text-zinc-300">{user?.email}</strong></p>
            <button onClick={handleLogout} className="text-sm text-caverna-accent hover:underline opacity-80 decoration-caverna-accent/50 underline-offset-4">
              Sair desta conta
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Assinatura;
