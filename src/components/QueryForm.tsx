
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SearchIcon, Database, AlertCircle } from 'lucide-react';
import GlassCard from './GlassCard';
import { useApi } from '@/contexts/ApiContext';
import { queryEinformaApi } from '@/utils/einformaApi';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const QueryForm: React.FC = () => {
  const navigate = useNavigate();
  const { credentials, useMockData, setUseMockData } = useApi();
  const [loading, setLoading] = useState(false);
  
  const [queryType, setQueryType] = useState('company');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [sector, setSector] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error('Por favor, introduce un término de búsqueda');
      return;
    }
    
    if (!credentials) {
      toast.error('No hay credenciales de API configuradas');
      return;
    }
    
    setLoading(true);
    
    try {
      const queryParams = {
        q: searchTerm,
        type: queryType,
        ...(location ? { location } : {}),
        ...(sector ? { sector } : {}),
      };
      
      // Use the real API connection with credentials
      await queryEinformaApi(queryParams, credentials);
      
      // Redirect to results page
      navigate('/results');
    } catch (error) {
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <GlassCard className="p-6 w-full max-w-lg" animateIn>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Modo de datos</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Simulados</span>
              <Switch 
                checked={!useMockData} 
                onCheckedChange={(checked) => setUseMockData(!checked)} 
                className="data-[state=checked]:bg-einforma-500"
              />
              <span className="text-xs text-gray-500">Reales</span>
              <div className="ml-1 text-amber-500 cursor-help" title="Las llamadas a la API real pueden fallar debido a restricciones CORS. Se utilizará un proxy para intentar evitarlo.">
                <AlertCircle size={16} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="queryType">Tipo de búsqueda</Label>
            <Select
              value={queryType}
              onValueChange={setQueryType}
            >
              <SelectTrigger className="w-full bg-white/50 border-einforma-100 focus:border-einforma-300">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Empresa</SelectItem>
                <SelectItem value="person">Persona</SelectItem>
                <SelectItem value="financial">Información Financiera</SelectItem>
                <SelectItem value="legal">Información Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="searchTerm">Término de búsqueda</Label>
            <Input
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre de empresa, CIF, persona, etc."
              className="bg-white/50 border-einforma-100 focus:border-einforma-300"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación (opcional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Provincia, ciudad, etc."
                className="bg-white/50 border-einforma-100 focus:border-einforma-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Sector (opcional)</Label>
              <Input
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Sector o actividad"
                className="bg-white/50 border-einforma-100 focus:border-einforma-300"
              />
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-einforma-500 hover:bg-einforma-600 text-white"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Database className="h-4 w-4 animate-pulse" />
              Consultando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <SearchIcon className="h-4 w-4" />
              Buscar información
            </span>
          )}
        </Button>
      </form>
    </GlassCard>
  );
};

export default QueryForm;
