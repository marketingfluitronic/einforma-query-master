
import React, { useEffect } from 'react';
import QueryForm from '@/components/QueryForm';
import ApiCredentialsForm from '@/components/ApiCredentialsForm';
import Header from '@/components/Header';
import AnimatedGradient from '@/components/AnimatedGradient';
import { useApi } from '@/contexts/ApiContext';
import { Database, FileText, Search } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useApi();
  
  // Prefilled values for demonstration (these would normally be empty)
  const prefilledClientId = "udgy3352tzcnrfsspibegn9y7c17azkowp8euuxb.api.einforma.com";
  const prefilledClientSecret = "hFf-CwPSnUqKDz9HBBXKsVqMyWZZOLP5oN63j1EUDho";
  
  // On first load, create a subtle scrolling effect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
      <Header />
      
      <div 
        className="absolute top-0 left-0 right-0 h-[500px] -z-10 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(236, 245, 255, 0.8) 0%, rgba(240, 247, 255, 0.5) 50%, rgba(248, 250, 252, 0) 100%)',
        }}
      />
      
      <div className="container max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex justify-center mb-6">
            <AnimatedGradient className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </AnimatedGradient>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            einforma<span className="text-einforma-500">Query</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Consulta información empresarial de forma sencilla y rápida 
            a través de la API de einforma.com
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {isAuthenticated ? (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm">
                  <div className="p-3 rounded-full bg-einforma-100 text-einforma-500 mb-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">Búsqueda Empresarial</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Encuentra información sobre cualquier empresa española
                  </p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm">
                  <div className="p-3 rounded-full bg-einforma-100 text-einforma-500 mb-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">Datos Actualizados</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Accede a información actualizada del Registro Mercantil
                  </p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm">
                  <div className="p-3 rounded-full bg-einforma-100 text-einforma-500 mb-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">Informes Detallados</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Visualiza informes completos con datos financieros
                  </p>
                </div>
              </div>
              
              <QueryForm />
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Configurar Acceso a la API
              </h2>
              
              <ApiCredentialsForm 
                prefilledClientId={prefilledClientId}
                prefilledClientSecret={prefilledClientSecret}
              />
            </div>
          )}
        </div>
      </div>
      
      <footer className="py-8 text-center border-t border-border/50 text-sm text-muted-foreground bg-white/50 backdrop-blur-sm">
        <div className="container">
          <p>© {new Date().getFullYear()} einformaQuery - Una interfaz para consultas a einforma.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
