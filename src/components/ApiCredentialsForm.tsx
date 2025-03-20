
import React, { useState, useEffect } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GlassCard from './GlassCard';
import { toast } from 'sonner';

interface ApiCredentialsFormProps {
  prefilledClientId?: string;
  prefilledClientSecret?: string;
  onSuccess?: () => void;
}

const ApiCredentialsForm: React.FC<ApiCredentialsFormProps> = ({
  prefilledClientId = '',
  prefilledClientSecret = '',
  onSuccess
}) => {
  const { setCredentials } = useApi();
  const [clientId, setClientId] = useState(prefilledClientId);
  const [clientSecret, setClientSecret] = useState(prefilledClientSecret);
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    setClientId(prefilledClientId);
    setClientSecret(prefilledClientSecret);
  }, [prefilledClientId, prefilledClientSecret]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId.trim() || !clientSecret.trim()) {
      toast.error('Por favor, introduce tanto el Client ID como el Client Secret');
      return;
    }
    
    setLoading(true);
    
    // Simulate validation with a timeout
    setTimeout(() => {
      try {
        setCredentials({
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim()
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error saving credentials:', error);
        toast.error('Error al guardar las credenciales');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <GlassCard className="p-6 w-full max-w-md mx-auto" animateIn>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="udgy3352tzcnrfsspibegn9y7c17azkowp8euuxb.api.einforma.com"
            className="bg-white/50 border-einforma-100 focus:border-einforma-300"
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="clientSecret">Client Secret</Label>
          <div className="relative">
            <Input
              id="clientSecret"
              type={showSecret ? 'text' : 'password'}
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="hFf-CwPSnUqKDz9HBBXKsVqMyWZZOLP5oN63j1EUDho"
              className="bg-white/50 border-einforma-100 focus:border-einforma-300 pr-24"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-einforma-500 hover:bg-einforma-600 text-white"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Credenciales'}
        </Button>
      </form>
    </GlassCard>
  );
};

export default ApiCredentialsForm;
