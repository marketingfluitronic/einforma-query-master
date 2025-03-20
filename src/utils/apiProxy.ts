
import { toast } from 'sonner';

// URL para un servicio de proxy CORS (utilizamos cors-anywhere público como ejemplo)
const PROXY_URL = 'https://corsproxy.io/?';

/**
 * Realiza una petición a la API de einforma a través de un proxy CORS
 */
export const proxyFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Agregamos la URL del proxy delante de la URL original
    const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
    console.log('Fetching through proxy:', proxyUrl);
    
    const response = await fetch(proxyUrl, options);
    
    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error en proxyFetch:', error);
    throw error;
  }
};
