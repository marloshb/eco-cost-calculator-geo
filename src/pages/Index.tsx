import { useState } from 'react';
import { MapContainer } from '../components/MapContainer';
import { ActivitySelector } from '../components/ActivitySelector';
import { CalculationResults } from '../components/CalculationResults';
import { OpportunitiesPanel } from '../components/OpportunitiesPanel';
import { Header } from '../components/Header';
import { StatsOverview } from '../components/StatsOverview';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [selectedArea, setSelectedArea] = useState<number>(0);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const handleAreaCalculated = (area: number, coords: [number, number][]) => {
    console.log('Area calculated:', area, 'hectares');
    setSelectedArea(area);
    setCoordinates(coords);
  };

  const handleActivitySelected = (activity: string) => {
    console.log('Activity selected:', activity);
    setSelectedActivity(activity);
  };

  const handleCalculate = () => {
    if (selectedArea > 0 && selectedActivity) {
      console.log('Calculating environmental costs...');
      // Trigger calculation logic
      const results = calculateEnvironmentalCosts(selectedArea, selectedActivity);
      setCalculationResults(results);
    }
  };

  const calculateEnvironmentalCosts = (area: number, activity: string) => {
    // Implementation of environmental cost calculation
    const ecosystemServices = {
      carbono: 500,
      agua: 300,
      biodiversidade: 200,
      erosao: 200,
      polinizacao: 300,
      enchentes: 500,
      solo: 200,
      turismo: 600
    };

    const activityImpacts = {
      agricultura: ['carbono', 'agua', 'biodiversidade', 'erosao', 'polinizacao'],
      pecuaria: ['carbono', 'agua', 'biodiversidade', 'erosao'],
      extracao_madeira: ['carbono', 'biodiversidade'],
      mineracao: ['agua', 'biodiversidade', 'erosao'],
      rodovia: ['carbono', 'biodiversidade', 'erosao'],
      construcao: ['carbono', 'agua', 'erosao'],
      industria: ['agua', 'biodiversidade'],
      turismo_predatorio: ['biodiversidade', 'erosao']
    };

    const impacts = activityImpacts[activity as keyof typeof activityImpacts] || [];
    const totalLoss = impacts.reduce((sum, service) => sum + ecosystemServices[service as keyof typeof ecosystemServices], 0) * area;
    
    const co2Emissions = area * 50; // 50 tCO2/ha
    const legalReserve = area * 0.8; // 80% legal reserve in Amazon
    
    const compliance = {
      codigoFlorestal: area <= legalReserve ? 'Conforme' : 'Viola reserva legal',
      emissoes: co2Emissions <= 5000 ? 'Conforme com NDC' : 'Excede metas de emissões',
      mercadoCarbono: 'Oportunidade para créditos de carbono'
    };

    return {
      totalLoss,
      impactedServices: impacts,
      compliance,
      area,
      activity,
      co2Emissions,
      opportunities: {
        redd: area * 500,
        psa: area * 300,
        ecoturismo: area * 600,
        carbonCredits: co2Emissions * 10 * 5 // US$10/tCO2 * R$5/USD
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-ocean-50 to-earth-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <StatsOverview 
            totalArea={selectedArea}
            selectedActivity={selectedActivity}
            results={calculationResults}
          />
        </div>

        {/* Botão para Comparação de Setores */}
        <div className="mb-6 text-center">
          <Link to="/comparison">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3">
              <BarChart3 className="h-5 w-5 mr-2" />
              Comparar Múltiplos Setores
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Compare impactos de diferentes atividades econômicas na mesma área
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <MapContainer onAreaCalculated={handleAreaCalculated} />
            <ActivitySelector 
              onActivitySelected={handleActivitySelected}
              onCalculate={handleCalculate}
              disabled={!selectedArea || !selectedActivity}
            />
          </div>
          
          <div className="space-y-6">
            {calculationResults && (
              <>
                <CalculationResults results={calculationResults} />
                <OpportunitiesPanel 
                  opportunities={calculationResults.opportunities} 
                  results={calculationResults}
                  coordinates={coordinates}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
