import React, { createContext, useContext, useEffect, useState } from 'react';

interface ChurchContextType {
  church: any | null;
  loading: boolean;
}

const ChurchContext = createContext<ChurchContextType>({ church: null, loading: true });

// --- Mock Data ---
const MOCK_CHURCH = {
    id: '1',
    name: 'Caverna Mestra',
    banner_urls: [
        '/banners/banner1.jpg',
        '/banners/banner2.jpg',
        '/banners/banner3.jpg',
    ],
    logo_url: '/logo.png',
};
// --- End Mock Data ---

export const ChurchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [church, setChurch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetching
    const fetchChurchData = () => {
        setLoading(true);
        setTimeout(() => {
            setChurch(MOCK_CHURCH);
            setLoading(false);
        }, 300); // Simulate network delay
    };

    fetchChurchData();
  }, []);

  return (
    <ChurchContext.Provider value={{ church, loading }}>
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => useContext(ChurchContext);
