
import { toast } from 'sonner';

// Usamos corsproxy.io que es más confiable
const PROXY_URL = 'https://corsproxy.io/?';

// Opción alternativa por si el anterior falla
const BACKUP_PROXY_URL = 'https://api.allorigins.win/raw?url=';

/**
 * Realiza una petición a través de un proxy CORS
 */
export const proxyFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Intentamos con el proxy principal
    const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
    console.log('Fetching through primary proxy:', proxyUrl);
    
    try {
      const response = await fetch(proxyUrl, options);
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      // Si falla el primer proxy, intentamos con el de respaldo
      console.log('Primary proxy failed, trying backup proxy...');
      const backupProxyUrl = `${BACKUP_PROXY_URL}${encodeURIComponent(url)}`;
      console.log('Fetching through backup proxy:', backupProxyUrl);
      
      // Para el proxy de respaldo no enviamos headers sensibles ya que podría causar problemas
      const backupOptions = { ...options };
      // Mantenemos solo headers básicos necesarios
      if (backupOptions.headers) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        backupOptions.headers = headers;
      }
      
      const backupResponse = await fetch(backupProxyUrl, backupOptions);
      
      if (!backupResponse.ok) {
        throw new Error(`Error en la respuesta del proxy de respaldo: ${backupResponse.status} ${backupResponse.statusText}`);
      }
      
      return backupResponse;
    }
  } catch (error) {
    console.error('Error en proxyFetch (todos los proxies fallaron):', error);
    toast.error('No se pudo conectar con el servidor a través de los proxies CORS');
    throw error;
  }
};
