
import { toast } from 'sonner';

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
    // This is where you would construct the URL and fetch data from einforma.com API
    // As per your request, we'll use the clientId and clientSecret provided
    
    // Base URL for the einforma API
    const baseUrl = `https://${credentials.clientId}`;
    
    // Convert queryParams to URL search params
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const url = `${baseUrl}?${params.toString()}`;
    
    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${credentials.clientId}:${credentials.clientSecret}`)}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API request failed:', errorData || response.statusText);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    // Store the results for display
    lastQueryResults = data;
    
    return data;
  } catch (error) {
    console.error('Error querying einforma API:', error);
    if (error instanceof Error) {
      toast.error(error.message || 'Error querying einforma API');
    } else {
      toast.error('Unknown error occurred while querying einforma API');
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
