
import { useState } from 'react';
import { MapContainer } from '../components/MapContainer';
import { TradeOffsSelector } from '../components/TradeOffsSelector';
import { TradeOffsResults } from '../components/TradeOffsResults';
import { TradeOffsCharts } from '../components/TradeOffsCharts';
import { Header } from '../components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TradeOffsAnalysis = () => {
  const [selectedArea, setSelectedArea] = useState<number>(0);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [economicBenefits, setEconomicBenefits] = useState<{[key: string]: number}>({});
  const [tradeOffsResults, setTradeOffsResults] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const handleAreaCalculated = (area: number, coords: [number, number][]) => {
    console.log('Area calculated for trade-offs:', area, 'hectares');
    setSelectedArea(area);
    setCoordinates(coords);
  };

  const handleSectorsSelected = (sectors: string[], benefits: {[key: string]: number}) => {
    console.log('Sectors selected for trade-offs:', sectors);
    console.log('Economic benefits:', benefits);
    setSelectedSectors(sectors);
    setEconomicBenefits(benefits);
  };

  const handleAnalyzeTradeOffs = () => {
    if (selectedArea > 0 && selectedSectors.length > 1) {
      console.log('Analyzing trade-offs...');
      const results = calculateTradeOffs(selectedArea, selectedSectors, economicBenefits);
      setTradeOffsResults(results);
    }
  };

  const calculateTradeOffs = (area: number, sectors: string[], benefits: {[key: string]: number}) => {
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

    const defaultEconomicBenefits = {
      agricultura: 2000, // R$/ha/ano
      pecuaria: 1600,
      extracao_madeira: 1200,
      mineracao: 3000,
      rodovia: 500,
      construcao: 800,
      industria: 2500,
      turismo_predatorio: 400,
      conservacao: 800 // REDD+ + PSA + ecoturismo
    };

    const results = sectors.map(sector => {
      const impacts = sectorImpacts[sector as keyof typeof sectorImpacts] || [];
      const environmentalCostPerHa = impacts.reduce((sum, service) => 
        sum + ecosystemServices[service as keyof typeof ecosystemServices], 0
      );
      const totalEnvironmentalCost = environmentalCostPerHa * area;
      
      // Use user-defined benefits or defaults
      const benefitPerHa = benefits[sector] ? benefits[sector] / area : 
                          (defaultEconomicBenefits[sector as keyof typeof defaultEconomicBenefits] || 0);
      const totalEconomicBenefit = benefitPerHa * area;
      
      const co2Emissions = sector === 'conservacao' ? 0 : area * 50; // 50 tCO2/ha
      const legalReserve = area * 0.8; // 80% legal reserve in Amazon
      
      const compliance = {
        codigoFlorestal: sector === 'conservacao' || area <= legalReserve ? 'Conforme' : 'Viola reserva legal',
        emissoes: co2Emissions <= 5000 ? 'Conforme com NDC' : 'Excede metas de emissões',
        mercadoCarbono: sector === 'conservacao' ? 'Elegível para créditos' : 'Não elegível'
      };

      // Compliance factor: 1 if compliant, 0.5 if violates
      const complianceFactor = compliance.codigoFlorestal.includes('Conforme') && 
                              compliance.emissoes.includes('Conforme') ? 1 : 0.5;

      // Sustainability index: (Economic Benefit / Environmental Cost) × Compliance Factor
      const sustainabilityIndex = totalEnvironmentalCost > 0 ? 
        (totalEconomicBenefit / totalEnvironmentalCost) * complianceFactor : 
        totalEconomicBenefit * complianceFactor;

      const opportunities = {
        redd: sector === 'conservacao' ? area * 500 : 0,
        psa: sector === 'conservacao' ? area * 300 : 0,
        ecoturismo: sector === 'conservacao' ? area * 600 : 0,
        greenEtfs: area * 50, // 5% return on R$1000/ha
        carbonCredits: sector === 'conservacao' ? co2Emissions * 10 * 5 : 0
      };

      const totalOpportunities = opportunities.redd + opportunities.psa + 
                               opportunities.ecoturismo + opportunities.greenEtfs;

      return {
        sector,
        area,
        environmentalCost: totalEnvironmentalCost,
        economicBenefit: totalEconomicBenefit,
        netBenefit: totalEconomicBenefit - totalEnvironmentalCost,
        sustainabilityIndex,
        impactedServices: impacts,
        compliance,
        complianceFactor,
        co2Emissions,
        opportunities,
        totalOpportunities,
        costBenefitRatio: totalEnvironmentalCost > 0 ? totalEconomicBenefit / totalEnvironmentalCost : Infinity,
        benefitPerHa
      };
    });

    return {
      sectors: results,
      area,
      coordinates,
      analysis: {
        bestSustainability: results.reduce((best, current) => 
          current.sustainabilityIndex > best.sustainabilityIndex ? current : best
        ),
        worstEnvironmentalImpact: results.reduce((worst, current) => 
          current.environmentalCost > worst.environmentalCost ? current : worst
        ),
        bestEconomicReturn: results.reduce((best, current) => 
          current.economicBenefit > best.economicBenefit ? current : best
        )
      }
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
              Análise de Trade-offs Ambientais
            </h1>
            <p className="text-muted-foreground">
              Avalie os compromissos entre impactos ambientais e benefícios econômicos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <MapContainer onAreaCalculated={handleAreaCalculated} />
            <TradeOffsSelector 
              onSectorsSelected={handleSectorsSelected}
              onAnalyze={handleAnalyzeTradeOffs}
              disabled={!selectedArea || selectedSectors.length < 2}
              selectedSectors={selectedSectors}
              selectedArea={selectedArea}
            />
          </div>
          
          <div className="space-y-6">
            {tradeOffsResults && (
              <>
                <TradeOffsResults results={tradeOffsResults} />
                <TradeOffsCharts results={tradeOffsResults} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeOffsAnalysis;
