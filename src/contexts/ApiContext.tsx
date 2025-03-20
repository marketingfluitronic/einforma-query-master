
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ApiCredentials {
  clientId: string;
  clientSecret: string;
}

interface ApiContextType {
  credentials: ApiCredentials | null;
  setCredentials: (credentials: ApiCredentials) => void;
  clearCredentials: () => void;
  isAuthenticated: boolean;
  useMockData: boolean;
  setUseMockData: (useMock: boolean) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credentials, setCredentialsState] = useState<ApiCredentials | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Por defecto usamos datos simulados para evitar problemas con CORS
  const [useMockData, setUseMockDataState] = useState<boolean>(() => {
    const stored = localStorage.getItem('useMockData');
    return stored ? JSON.parse(stored) : true;
  });

  // Load credentials from localStorage on initial render
  useEffect(() => {
    try {
      const storedCredentials = localStorage.getItem('einforma_credentials');
      if (storedCredentials) {
        const parsedCredentials = JSON.parse(storedCredentials);
        setCredentialsState(parsedCredentials);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading credentials from localStorage:', error);
      localStorage.removeItem('einforma_credentials');
    }
  }, []);

  const setCredentials = (newCredentials: ApiCredentials) => {
    try {
      localStorage.setItem('einforma_credentials', JSON.stringify(newCredentials));
      setCredentialsState(newCredentials);
      setIsAuthenticated(true);
      toast.success('API credentials stored successfully');
    } catch (error) {
      console.error('Error storing credentials:', error);
      toast.error('Failed to store API credentials');
    }
  };

  const clearCredentials = () => {
    localStorage.removeItem('einforma_credentials');
    setCredentialsState(null);
    setIsAuthenticated(false);
    toast.info('API credentials cleared');
  };
  
  const setUseMockData = (useMock: boolean) => {
    localStorage.setItem('useMockData', JSON.stringify(useMock));
    setUseMockDataState(useMock);
    toast.info(useMock 
      ? 'Usando datos simulados para demostración' 
      : 'Intentando usar la API real (requiere proxy para CORS)'
    );
  };

  return (
    <ApiContext.Provider
      value={{
        credentials,
        setCredentials,
        clearCredentials,
        isAuthenticated,
        useMockData,
        setUseMockData,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
