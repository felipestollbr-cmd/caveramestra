import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type Role = 'user' | 'admin';
type SubStatus = 'active' | 'inactive' | 'pending';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: Role;
  subscriptionStatus: SubStatus;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: 'user',
  subscriptionStatus: 'inactive',
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('user');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubStatus>('inactive');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      // Offline Demo Check
      if (localStorage.getItem('demo_admin') === 'true') {
         if (mounted) {
           setSession({} as any);
           setUser({ email: 'admin@cavernamestra.com', id: '123' } as any);
           setRole('admin');
           setSubscriptionStatus('active');
           setLoading(false);
         }
         return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    // Do not attach the Supabase listener if we are in local offline demo mode
    if (localStorage.getItem('demo_admin') === 'true') {
       return () => { mounted = false; };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setRole('user');
          setSubscriptionStatus('inactive');
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setRole(data.role as Role || 'user');
        // ATENÇÃO: COLOQUE 'active' COMO PADRÃO APENAS PARA O DEMO SE NÃO HOUVER BANCO.
        // O CÓDIGO ABAIXO DEVE SER: setSubscriptionStatus(data.subscription_status || 'inactive');
        setSubscriptionStatus(data.subscription_status as SubStatus || 'inactive');
      } else if (error && error.code === 'PGRST116') {
         // Profile not found, fallback to inactive
         setRole('user');
         setSubscriptionStatus('inactive');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (localStorage.getItem('demo_admin')) {
      localStorage.removeItem('demo_admin');
      window.location.href = '/login';
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, role, subscriptionStatus, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
