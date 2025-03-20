
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useApi } from '@/contexts/ApiContext';
import { getLastQueryResults } from '@/utils/einformaApi';

const Results = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApi();
  const results = getLastQueryResults();
  
  // Check if user is authenticated and has results
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (!results) {
      navigate('/');
    }
    
    // On first load, scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [isAuthenticated, navigate, results]);

  if (!isAuthenticated || !results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
      <Header />
      
      <div 
        className="absolute top-0 left-0 right-0 h-[300px] -z-10 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(236, 245, 255, 0.8) 0%, rgba(240, 247, 255, 0.5) 50%, rgba(248, 250, 252, 0) 100%)',
        }}
      />
      
      <div className="container max-w-7xl mx-auto px-4 pt-24 pb-20">
        <div className="max-w-5xl mx-auto">
          <ResultsDisplay />
        </div>
      </div>
      
      <footer className="py-6 text-center border-t border-border/50 text-sm text-muted-foreground bg-white/50 backdrop-blur-sm">
        <div className="container">
          <p>© {new Date().getFullYear()} einformaQuery - Una interfaz para consultas a einforma.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Results;
