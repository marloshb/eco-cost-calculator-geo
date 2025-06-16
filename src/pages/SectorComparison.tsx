
import { useState } from 'react';
import { MapContainer } from '../components/MapContainer';
import { SectorSelector } from '../components/SectorSelector';
import { ComparisonResults } from '../components/ComparisonResults';
import { ComparisonCharts } from '../components/ComparisonCharts';
import { Header } from '../components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SectorComparison = () => {
  const [selectedArea, setSelectedArea] = useState<number>(0);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const handleAreaCalculated = (area: number, coords: [number, number][]) => {
    console.log('Area calculated for comparison:', area, 'hectares');
    setSelectedArea(area);
    setCoordinates(coords);
  };

  const handleSectorsSelected = (sectors: string[]) => {
    console.log('Sectors selected:', sectors);
    setSelectedSectors(sectors);
  };

  const handleCompare = () => {
    if (selectedArea > 0 && selectedSectors.length > 1) {
      console.log('Comparing sectors...');
      const results = calculateSectorComparison(selectedArea, selectedSectors);
      setComparisonResults(results);
    }
  };

  const calculateSectorComparison = (area: number, sectors: string[]) => {
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

    const sectorImpacts = {
      agricultura: ['carbono', 'agua', 'biodiversidade', 'erosao', 'polinizacao'],
      pecuaria: ['carbono', 'agua', 'biodiversidade', 'erosao'],
      extracao_madeira: ['carbono', 'biodiversidade'],
      mineracao: ['agua', 'biodiversidade', 'erosao'],
      rodovia: ['carbono', 'biodiversidade', 'erosao'],
      construcao: ['carbono', 'agua', 'erosao'],
      industria: ['agua', 'biodiversidade'],
      turismo_predatorio: ['biodiversidade', 'erosao'],
      conservacao: [] // Conservação não impacta negativamente
    };

    const sectorEconomicBenefits = {
      agricultura: 2000, // R$/ha/ano
      pecuaria: 1600, // R$/ha/ano
      extracao_madeira: 1200,
      mineracao: 3000,
      rodovia: 500, // Benefício indireto
      construcao: 800,
      industria: 2500,
      turismo_predatorio: 400,
      conservacao: 800 // REDD+ + PSA + ecoturismo
    };

    const results = sectors.map(sector => {
      const impacts = sectorImpacts[sector as keyof typeof sectorImpacts] || [];
      const lossPerHa = impacts.reduce((sum, service) => 
        sum + ecosystemServices[service as keyof typeof ecosystemServices], 0
      );
      const totalLoss = lossPerHa * area;
      
      const economicBenefit = (sectorEconomicBenefits[sector as keyof typeof sectorEconomicBenefits] || 0) * area;
      
      const co2Emissions = sector === 'conservacao' ? 0 : area * 50; // 50 tCO2/ha
      const legalReserve = area * 0.8; // 80% legal reserve in Amazon
      
      const compliance = {
        codigoFlorestal: sector === 'conservacao' || area <= legalReserve ? 'Conforme' : 'Viola reserva legal',
        emissoes: co2Emissions <= 5000 ? 'Conforme com NDC' : 'Excede metas de emissões',
        mercadoCarbono: sector === 'conservacao' ? 'Elegível para créditos' : 'Não elegível'
      };

      const opportunities = {
        redd: sector === 'conservacao' ? area * 500 : 0,
        psa: sector === 'conservacao' ? area * 300 : 0,
        ecoturismo: sector === 'conservacao' ? area * 600 : 0,
        greenEtfs: sector === 'conservacao' ? economicBenefit * 0.05 : 0, // 5% return
        carbonCredits: sector === 'conservacao' ? co2Emissions * 10 * 5 : 0
      };

      const totalOpportunities = opportunities.redd + opportunities.psa + 
                               opportunities.ecoturismo + opportunities.greenEtfs;

      return {
        sector,
        area,
        totalLoss,
        economicBenefit,
        netBenefit: economicBenefit - totalLoss,
        impactedServices: impacts,
        compliance,
        co2Emissions,
        opportunities,
        totalOpportunities,
        costBenefitRatio: totalLoss > 0 ? economicBenefit / totalLoss : Infinity
      };
    });

    return {
      sectors: results,
      area,
      coordinates
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-ocean-50 to-earth-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Calculadora Principal
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-forest-600 mb-2">
              Comparação de Setores Econômicos
            </h1>
            <p className="text-muted-foreground">
              Compare impactos ambientais e econômicos de diferentes atividades na mesma área
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <MapContainer onAreaCalculated={handleAreaCalculated} />
            <SectorSelector 
              onSectorsSelected={handleSectorsSelected}
              onCompare={handleCompare}
              disabled={!selectedArea || selectedSectors.length < 2}
              selectedSectors={selectedSectors}
            />
          </div>
          
          <div className="space-y-6">
            {comparisonResults && (
              <>
                <ComparisonResults results={comparisonResults} />
                <ComparisonCharts results={comparisonResults} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorComparison;
