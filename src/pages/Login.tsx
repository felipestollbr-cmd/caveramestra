import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import CaveLogo from '../components/CaveLogo';
import { supabase } from '../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [isChurchSignUp, setIsChurchSignUp] = useState(false);
  const [churchName, setChurchName] = useState('');

  const handleOAuth = async (provider: 'google' | 'apple') => {
     try {
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithOAuth({
           provider,
           options: {
             redirectTo: `${window.location.origin}/dashboard`
           }
        });
        if (error) throw error;
     } catch (err: any) {
        setError(err.message || `Erro ao conectar com ${provider}`);
        setLoading(false);
     }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Fallback for demo without Supabase configured
        if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
           alert("Configuração do Supabase ausente. Crie a conta como Admin para testar: email: admin@cavernamestra.com, senha: admin");
           setLoading(false);
           return;
        }

        let churchId = '';
        let code = '';

        if (isChurchSignUp) {
          // Cadastro de igreja: gerar código único e criar igreja
          if (!churchName) {
            setError('Informe o nome da igreja.');
            setLoading(false);
            return;
          }
          // Gera código aleatório de 6 caracteres
          code = Math.random().toString(36).substring(2, 8).toUpperCase();
          const { data: church, error: churchError } = await supabase
            .from('churches')
            .insert({ name: churchName, code })
            .select('id, code')
            .single();
          if (churchError || !church) {
            setError('Erro ao criar igreja. Tente novamente.');
            setLoading(false);
            return;
          }
          churchId = church.id;
        } else {
          // Cadastro de membro: precisa do código da igreja
          if (!churchCode) {
            setError('Informe o código da igreja para se cadastrar.');
            setLoading(false);
            return;
          }
          // Busca a igreja pelo código
          const { data: church, error: churchError } = await supabase
            .from('churches')
            .select('id')
            .eq('code', churchCode)
            .single();
          if (churchError || !church) {
            setError('Código da igreja inválido. Peça o código correto ao administrador.');
            setLoading(false);
            return;
          }
          churchId = church.id;
        }

        // Cria usuário no Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        // Cria o perfil do usuário já vinculado à igreja
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: signUpData.user.id, church_id: churchId, email });
          if (profileError) {
            setError('Erro ao criar perfil do membro. Tente novamente.');
            setLoading(false);
            return;
          }
        }

        // Se cadastrou igreja, mostra o código gerado
        if (isChurchSignUp && code) {
          alert(`Igreja cadastrada com sucesso! Código: ${code}\nCompartilhe este código com seus membros para que possam se cadastrar.`);
        }
        navigate('/dashboard');
      } else {
        // Fallback for Admin Test without Supabase configured
        const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || 
                             import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
                             import.meta.env.VITE_SUPABASE_URL.includes('seu-projeto');

        if (isPlaceholder) {
           if (email === 'admin@cavernamestra.com' && password === 'admin') {
              // Sets a local mock token or simply reloads the page with a storage flag so AuthContext knows
              localStorage.setItem('demo_admin', 'true');
              setLoading(false);
              navigate('/dashboard');
              return;
           } else {
              throw new Error("Modo Demo local ativado: use admin@cavernamestra.com e senha admin para entrar.");
           }
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-caverna-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow for Dark Gold theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-caverna-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-caverna-accent to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-caverna-accent/20 border border-white/10">
            <CaveLogo size={48} className="text-zinc-900" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Caverna Mestra</h1>
          <p className="text-caverna-accent/80 font-medium">Excelência e Crescimento Contínuo</p>
        </div>

        <form onSubmit={handleAuth} className="bg-caverna-card/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-xl font-semibold border transition-all ${isChurchSignUp ? 'bg-caverna-accent text-zinc-900 border-caverna-accent' : 'bg-zinc-900 text-white border-white/10'}`}
                    onClick={() => setIsChurchSignUp(true)}
                  >Cadastrar Igreja</button>
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-xl font-semibold border transition-all ${!isChurchSignUp ? 'bg-caverna-accent text-zinc-900 border-caverna-accent' : 'bg-zinc-900 text-white border-white/10'}`}
                    onClick={() => setIsChurchSignUp(false)}
                  >Cadastrar Membro</button>
                </div>
                {isChurchSignUp ? (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nome da Igreja</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={churchName}
                        onChange={e => setChurchName(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-4 pr-4 text-white focus:outline-none focus:border-caverna-accent focus:ring-1 focus:ring-caverna-accent transition-all"
                        placeholder="Ex: Igreja Central"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Código da Igreja</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={churchCode}
                        onChange={e => setChurchCode(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-4 pr-4 text-white focus:outline-none focus:border-caverna-accent focus:ring-1 focus:ring-caverna-accent transition-all"
                        placeholder="Ex: ABC123"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-caverna-accent focus:ring-1 focus:ring-caverna-accent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-caverna-accent focus:ring-1 focus:ring-caverna-accent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-caverna-accent hover:bg-caverna-accent-light text-zinc-900 font-bold py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 shadow-xl shadow-caverna-accent/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>{isSignUp ? 'Criar Conta' : 'Acessar Caverna Mestra'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isSignUp ? 'Já tem uma conta? Faça login' : 'Primeira vez? Crie sua conta'}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-caverna-bg text-zinc-500">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black px-4 py-3 rounded-2xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleOAuth('apple')}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white px-4 py-3 rounded-2xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
