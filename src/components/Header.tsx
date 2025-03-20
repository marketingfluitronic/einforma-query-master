
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/contexts/ApiContext';
import AnimatedGradient from './AnimatedGradient';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, clearCredentials } = useApi();

  return (
    <header className="w-full fixed top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="container max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <AnimatedGradient className="h-8 w-8 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </AnimatedGradient>
          <h1 
            className="font-semibold text-xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            einforma<span className="text-einforma-500">Query</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Button 
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                onClick={() => navigate('/')}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Nueva Consulta</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  clearCredentials();
                  navigate('/');
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
