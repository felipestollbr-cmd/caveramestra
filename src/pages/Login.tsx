import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CaveLogo from '../components/CaveLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { session, loading: authLoading, signIn } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (authLoading && !loading) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-caverna-bg text-caverna-text flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm mx-auto animate-in fade-in duration-700">

        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 mb-4">
            <CaveLogo />
          </div>
          <h1 className="font-bold text-caverna-text text-2xl">O Foco é a Moeda Ancestral</h1>
        </div>

        <div className="bg-caverna-card border border-caverna-border rounded-xl p-8">
          <h2 className="font-bold text-white text-3xl text-center">Retorne ao Foco</h2>
          <p className="text-caverna-muted text-center mb-8 text-sm">Acesso seguro ao seu santuário.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-caverna-muted uppercase tracking-wider" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-caverna-bg border border-caverna-border rounded-lg p-3 mt-2 text-white placeholder-caverna-muted focus:outline-none focus:ring-2 focus:ring-caverna-accent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-caverna-muted uppercase tracking-wider" htmlFor="password">
                  Senha
                </label>
                <a href="#" className="text-xs text-caverna-muted hover:text-white transition-colors">Esqueceu?</a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-caverna-bg border border-caverna-border rounded-lg p-3 mt-2 text-white placeholder-caverna-muted focus:outline-none focus:ring-2 focus:ring-caverna-accent transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading || !!session}
              className="w-full bg-caverna-accent hover:bg-opacity-90 text-black text-base font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed glow"
            >
              {loading ? 'Entrando...' : 'Entrar no Santuário'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-caverna-border/50">
              <p className="text-caverna-muted text-sm">
                  Não tem uma conta?{' '}
                  <Link to="/assinar" className="font-bold text-white hover:text-caverna-accent transition-colors">Solicitar Acesso</Link>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
