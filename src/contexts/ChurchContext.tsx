import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Church {
  id: string;
  code: string;
  name: string;
  logo_url?: string;
  banner_urls?: string[];
}

interface ChurchContextType {
  church: Church | null;
  loading: boolean;
}

const ChurchContext = createContext<ChurchContextType>({ church: null, loading: true });

export const ChurchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChurchInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Busca o perfil do usuário para pegar o church_id
          const { data: profile } = await supabase
            .from('profiles')
            .select('church_id')
            .eq('id', user.id)
            .single();

          if (profile?.church_id) {
            // Se o usuário tem uma igreja associada, busca os dados dela
            const { data: churchData } = await supabase
              .from('churches')
              .select('*')
              .eq('id', profile.church_id)
              .single();
              
            if (churchData) {
              setChurch(churchData);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados da igreja:", error);
      } finally {
        // Fallback for demo purposes (if we want to demonstrate the design before actual DB implementation)
        // Remove this in production if the DB is fully ready.
        if (!church) {
           setChurch({
              id: 'demo-123',
              code: 'DEMO',
              name: 'Igreja Demonstrativa',
              logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
              banner_urls: [
                'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&h=300&fit=crop',
                'https://images.unsplash.com/photo-1543888514-6dc35b0b2f9c?w=1200&h=300&fit=crop'
              ]
           });
        }
        setLoading(false);
      }
    };

    fetchChurchInfo();
  }, []);

  return (
    <ChurchContext.Provider value={{ church, loading }}>
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => useContext(ChurchContext);
