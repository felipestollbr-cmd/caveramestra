import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock types for Session and User to avoid Supabase dependency
type User = {
  id: string;
  email?: string;
};
type Session = {};

type Role = 'user' | 'admin';
type SubStatus = 'active' | 'inactive' | 'pending';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: Role;
  subscriptionStatus: SubStatus;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<{ error: { message: string } | null }>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: 'user',
  subscriptionStatus: 'inactive',
  loading: true,
  signOut: async () => {},
  signIn: async () => ({ error: { message: 'Provider not ready' } }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('user');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubStatus>('inactive');
  const [loading, setLoading] = useState(true);

  // Mock sign-in function
  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    if (email === 'admin@cavernamestra.com' && pass === 'admin') {
      const mockUser = { id: '123', email: 'admin@cavernamestra.com' };
      setSession({});
      setUser(mockUser);
      setRole('admin');
      setSubscriptionStatus('active');
      setLoading(false);
      return { error: null };
    }
    setLoading(false);
    return { error: { message: 'Credenciais inválidas. Use admin@cavernamestra.com e admin.' } };
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    setRole('user');
    setSubscriptionStatus('inactive');
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    session,
    user,
    role,
    subscriptionStatus,
    loading,
    signOut,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
