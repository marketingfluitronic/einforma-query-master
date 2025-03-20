
import { toast } from 'sonner';
import { proxyFetch } from './apiProxy';

interface ApiCredentials {
  clientId: string;
  clientSecret: string;
}

// This is where we'll store the results for display
let lastQueryResults: any = null;

export const getLastQueryResults = () => {
  return lastQueryResults;
};

export const clearLastQueryResults = () => {
  lastQueryResults = null;
};

// Function to query einforma API
export const queryEinformaApi = async (
  queryParams: Record<string, string>,
  credentials: ApiCredentials
): Promise<any> => {
  try {
    console.log('Querying einforma API with:', queryParams);
    console.log('Using credentials:', credentials.clientId);
    
    const { useMockData } = window.localStorage.getItem('useMockData') 
      ? { useMockData: JSON.parse(window.localStorage.getItem('useMockData') || 'true') } 
      : { useMockData: true };
    
    if (useMockData) {
      console.log('Using mock data for demonstration');
      toast.info('Usando datos simulados para demostración. En un entorno real, esto usaría la API de einforma.');
      return await mockQueryEinformaApi(queryParams);
    }
    
    // Extract the domain from clientId
    const baseUrl = credentials.clientId.includes('.api.einforma.com') 
      ? `https://${credentials.clientId}`
      : credentials.clientId;
    
    // Convert queryParams to URL search params
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const url = `${baseUrl}?${params.toString()}`;
    console.log('Request URL:', url);
    
    // Prepare authorization header
    const authHeader = `Basic ${btoa(`${credentials.clientId}:${credentials.clientSecret}`)}`;
    
    // Make the API request through our proxy
    try {
      const response = await proxyFetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('API response:', data);
      
      // Store the results for display
      lastQueryResults = data;
      
      toast.success('Datos recibidos correctamente de einforma API');
      return data;
    } catch (error) {
      console.error('API proxy request failed:', error);
      toast.error('Error al acceder a la API: Probablemente problemas con el proxy o CORS');
      
      // Fallback to mock data
      console.log('Fallback to mock data after API error');
      toast.info('Utilizando datos de muestra como alternativa');
      return await mockQueryEinformaApi(queryParams);
    }
  } catch (error) {
    console.error('Error querying einforma API:', error);
    if (error instanceof Error) {
      toast.error(error.message || 'Error al consultar la API de einforma');
    } else {
      toast.error('Error desconocido al consultar la API de einforma');
    }
    throw error;
  }
};

// Mock function to simulate API response for testing
export const mockQueryEinformaApi = async (
  queryParams: Record<string, string>
): Promise<any> => {
  console.log('Mock query with params:', queryParams);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock data based on the query
  const mockData = {
    query: queryParams,
    timestamp: new Date().toISOString(),
    results: [
      {
        id: '1234567890',
        name: 'Empresa Ejemplo S.L.',
        type: 'Sociedad Limitada',
        cif: 'B12345678',
        address: 'Calle Ejemplo, 123, 28001 Madrid',
        status: 'Activa',
        foundationDate: '2005-06-15',
        capital: '150000.00',
        activity: 'Desarrollo de software y consultoría tecnológica',
        employees: 48,
        financials: {
          revenue: {
            '2021': 1250000,
            '2020': 980000,
            '2019': 850000
          },
          profit: {
            '2021': 320000,
            '2020': 210000,
            '2019': 180000
          }
        }
      },
      {
        id: '0987654321',
        name: 'Test Corporation Española S.A.',
        type: 'Sociedad Anónima',
        cif: 'A87654321',
        address: 'Avenida Test, 456, 08001 Barcelona',
        status: 'Activa',
        foundationDate: '1995-03-22',
        capital: '500000.00',
        activity: 'Comercio al por mayor de equipos electrónicos',
        employees: 112,
        financials: {
          revenue: {
            '2021': 5450000,
            '2020': 4980000,
            '2019': 4250000
          },
          profit: {
            '2021': 890000,
            '2020': 750000,
            '2019': 620000
          }
        }
      }
    ]
  };
  
  // Store the mock results for display
  lastQueryResults = mockData;
  
  return mockData;
};
