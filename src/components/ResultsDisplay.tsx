
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';
import AnimatedGradient from './AnimatedGradient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftIcon, FileTextIcon, PieChartIcon, BuildingIcon, Briefcase, Calendar } from 'lucide-react';
import { getLastQueryResults } from '@/utils/einformaApi';

interface ResultsDisplayProps {
  data?: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  const navigate = useNavigate();
  const results = data || getLastQueryResults();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!results || !results.results || results.results.length === 0) {
    return (
      <GlassCard className="p-8 text-center" animateIn>
        <h3 className="text-2xl font-medium mb-4">No se encontraron resultados</h3>
        <p className="text-muted-foreground mb-6">
          No se encontraron datos para la consulta realizada. Por favor, intenta con otros parámetros de búsqueda.
        </p>
        <Button onClick={() => navigate('/')} variant="outline" className="mx-auto">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Volver a la búsqueda
        </Button>
      </GlassCard>
    );
  }

  const firstCompany = results.results[0];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Nueva búsqueda
        </Button>
      </div>

      <AnimatedGradient className="px-8 py-6 rounded-2xl text-white mb-6" variant="primary">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-white/70">Empresa</div>
            <h1 className="text-2xl font-semibold mb-2">{firstCompany.name}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white">
                {firstCompany.type}
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white">
                CIF: {firstCompany.cif}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col justify-end text-right">
            <div className="text-sm font-medium text-white/70">Estado</div>
            <div className="text-lg font-medium">{firstCompany.status}</div>
          </div>
        </div>
      </AnimatedGradient>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-white/50 backdrop-blur-sm border border-white/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-white">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Datos Financieros
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white">
            <BuildingIcon className="mr-2 h-4 w-4" />
            Detalles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BuildingIcon className="mr-2 h-5 w-5 text-einforma-500" />
                Información General
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Dirección</dt>
                  <dd className="mt-1">{firstCompany.address}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Fecha de fundación</dt>
                  <dd className="mt-1 flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-einforma-400" />
                    {firstCompany.foundationDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Capital social</dt>
                  <dd className="mt-1">{formatCurrency(parseFloat(firstCompany.capital))}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Empleados</dt>
                  <dd className="mt-1">{firstCompany.employees}</dd>
                </div>
              </dl>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-einforma-500" />
                Actividad
              </h3>
              <p className="text-muted-foreground mb-4">
                {firstCompany.activity}
              </p>

              <h4 className="text-sm font-medium mt-6 mb-2">Evolución de Ingresos</h4>
              <div className="h-24 flex items-end justify-between gap-2">
                {Object.entries(firstCompany.financials.revenue).map(([year, value]) => (
                  <div key={year} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-einforma-400 rounded-t-sm transition-all duration-500" 
                      style={{ 
                        height: `${Math.round((Number(value) / 6000000) * 100)}%`,
                        maxHeight: '100%' 
                      }}
                    ></div>
                    <span className="text-xs mt-2">{year}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-0">
          <GlassCard className="p-6">
            <h3 className="text-xl font-medium mb-6">Datos Financieros</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Ingresos Anuales</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left">Año</th>
                        <th className="pb-2 text-right">Ingresos</th>
                        <th className="pb-2 text-right">Variación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(firstCompany.financials.revenue)
                        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                        .map(([year, value], index, array) => {
                          const prevValue = index < array.length - 1 
                            ? Number(array[index + 1][1]) 
                            : null;
                          
                          const variation = prevValue 
                            ? ((Number(value) - prevValue) / prevValue) * 100 
                            : null;
                          
                          return (
                            <tr key={year} className="border-b border-border/50">
                              <td className="py-3">{year}</td>
                              <td className="py-3 text-right font-medium">
                                {formatCurrency(Number(value))}
                              </td>
                              <td className="py-3 text-right">
                                {variation !== null ? (
                                  <span className={
                                    variation > 0 
                                      ? 'text-green-600' 
                                      : variation < 0 
                                        ? 'text-red-600' 
                                        : ''
                                  }>
                                    {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                                  </span>
                                ) : '-'}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Beneficios</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left">Año</th>
                        <th className="pb-2 text-right">Beneficio</th>
                        <th className="pb-2 text-right">Margen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(firstCompany.financials.profit)
                        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                        .map(([year, profit]) => {
                          const revenue = firstCompany.financials.revenue[year];
                          const margin = revenue ? (Number(profit) / Number(revenue)) * 100 : null;
                          
                          return (
                            <tr key={year} className="border-b border-border/50">
                              <td className="py-3">{year}</td>
                              <td className="py-3 text-right font-medium">
                                {formatCurrency(Number(profit))}
                              </td>
                              <td className="py-3 text-right">
                                {margin !== null ? `${margin.toFixed(1)}%` : '-'}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="details" className="mt-0">
          <GlassCard className="p-6">
            <h3 className="text-xl font-medium mb-6">Detalles de la Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-3">Información Legal</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Denominación social:</dt>
                    <dd className="font-medium">{firstCompany.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">CIF:</dt>
                    <dd className="font-medium">{firstCompany.cif}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Forma jurídica:</dt>
                    <dd className="font-medium">{firstCompany.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Estado:</dt>
                    <dd className="font-medium">{firstCompany.status}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-3">Ubicación</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Dirección completa:</dt>
                    <dd className="font-medium">{firstCompany.address}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-medium mb-3">Actividad Empresarial</h4>
              <p className="text-muted-foreground">
                {firstCompany.activity}
              </p>
              
              <div className="mt-4">
                <h5 className="text-sm font-medium">Personal:</h5>
                <p>{firstCompany.employees} empleados</p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
      
      {results.results.length > 1 && (
        <GlassCard className="p-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Otras empresas encontradas</h3>
          <div className="space-y-4">
            {results.results.slice(1).map((company: any) => (
              <div key={company.id} className="p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors cursor-pointer border border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{company.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{company.address}</p>
                  </div>
                  <Badge>{company.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ResultsDisplay;
