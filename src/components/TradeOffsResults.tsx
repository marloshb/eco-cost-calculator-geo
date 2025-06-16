
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Scale, Award, AlertCircle } from 'lucide-react';

interface TradeOffsResultsProps {
  results: {
    sectors: Array<{
      sector: string;
      area: number;
      environmentalCost: number;
      economicBenefit: number;
      netBenefit: number;
      sustainabilityIndex: number;
      impactedServices: string[];
      compliance: {
        codigoFlorestal: string;
        emissoes: string;
        mercadoCarbono: string;
      };
      complianceFactor: number;
      co2Emissions: number;
      opportunities: any;
      totalOpportunities: number;
      costBenefitRatio: number;
      benefitPerHa: number;
    }>;
    area: number;
    analysis: {
      bestSustainability: any;
      worstEnvironmentalImpact: any;
      bestEconomicReturn: any;
    };
  };
}

export const TradeOffsResults = ({ results }: TradeOffsResultsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getSectorName = (code: string) => {
    const names: { [key: string]: string } = {
      agricultura: 'Agricultura',
      pecuaria: 'Pecuária',
      extracao_madeira: 'Extração Madeira',
      mineracao: 'Mineração',
      rodovia: 'Rodovias',
      construcao: 'Construção',
      industria: 'Indústria',
      conservacao: 'Conservação'
    };
    return names[code] || code;
  };

  const getComplianceIcon = (status: string) => {
    if (status.includes('Conforme') || status.includes('Elegível')) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getComplianceColor = (status: string) => {
    if (status.includes('Conforme') || status.includes('Elegível')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getNetBenefitColor = (netBenefit: number) => {
    if (netBenefit > 0) {
      return 'text-green-600';
    } else {
      return 'text-red-600';
    }
  };

  const getSustainabilityLevel = (index: number) => {
    if (index >= 100) return { level: 'Excelente', color: 'bg-green-100 text-green-800' };
    if (index >= 1.5) return { level: 'Muito Bom', color: 'bg-blue-100 text-blue-800' };
    if (index >= 1.0) return { level: 'Bom', color: 'bg-yellow-100 text-yellow-800' };
    if (index >= 0.5) return { level: 'Regular', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Baixo', color: 'bg-red-100 text-red-800' };
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-forest-600" />
          Análise de Trade-offs Ambientais
        </CardTitle>
        
        {/* Analysis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-green-600" />
              <span className="font-medium">Melhor Sustentabilidade</span>
            </div>
            <p className="text-green-700 font-medium">{getSectorName(results.analysis.bestSustainability.sector)}</p>
            <p className="text-xs text-green-600">
              Índice: {results.analysis.bestSustainability.sustainabilityIndex >= 100 ? 
                '∞' : results.analysis.bestSustainability.sustainabilityIndex.toFixed(2)}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Melhor Retorno</span>
            </div>
            <p className="text-blue-700 font-medium">{getSectorName(results.analysis.bestEconomicReturn.sector)}</p>
            <p className="text-xs text-blue-600">
              {formatCurrency(results.analysis.bestEconomicReturn.economicBenefit)}/ano
            </p>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium">Maior Impacto</span>
            </div>
            <p className="text-red-700 font-medium">{getSectorName(results.analysis.worstEnvironmentalImpact.sector)}</p>
            <p className="text-xs text-red-600">
              {formatCurrency(results.analysis.worstEnvironmentalImpact.environmentalCost)}/ano
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Custo Ambiental</TableHead>
                <TableHead>Benefício Econômico</TableHead>
                <TableHead>Benefício Líquido</TableHead>
                <TableHead>Índice Sustentabilidade</TableHead>
                <TableHead>Conformidade</TableHead>
                <TableHead>Oportunidades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.sectors.map((sector) => {
                const sustainability = getSustainabilityLevel(sector.sustainabilityIndex);
                return (
                  <TableRow key={sector.sector}>
                    <TableCell className="font-medium">
                      {getSectorName(sector.sector)}
                      <div className="text-xs text-muted-foreground">
                        R$ {sector.benefitPerHa.toFixed(0)}/ha/ano
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600 font-medium">
                        {formatCurrency(sector.environmentalCost)}/ano
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {sector.co2Emissions.toLocaleString()} tCO₂
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">
                        {formatCurrency(sector.economicBenefit)}/ano
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getNetBenefitColor(sector.netBenefit)}`}>
                        {formatCurrency(sector.netBenefit)}/ano
                      </span>
                      <div className="text-xs text-muted-foreground">
                        Razão C/B: {sector.costBenefitRatio === Infinity ? '∞' : sector.costBenefitRatio.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={sustainability.color} variant="secondary">
                        {sustainability.level}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {sector.sustainabilityIndex >= 100 ? '∞' : sector.sustainabilityIndex.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          {getComplianceIcon(sector.compliance.codigoFlorestal)}
                          <Badge className={getComplianceColor(sector.compliance.codigoFlorestal)} variant="secondary">
                            {sector.compliance.codigoFlorestal.includes('Conforme') ? 'CF OK' : 'CF Viola'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {getComplianceIcon(sector.compliance.emissoes)}
                          <Badge className={getComplianceColor(sector.compliance.emissoes)} variant="secondary">
                            {sector.compliance.emissoes.includes('Conforme') ? 'NDC OK' : 'NDC Viola'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fator: {sector.complianceFactor}x
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 font-medium">
                        {formatCurrency(sector.totalOpportunities)}/ano
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {sector.sector === 'conservacao' ? 'REDD+ + PSA' : 'Green ETFs'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Metodologia de Trade-offs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <strong>Área Analisada:</strong> {results.area.toFixed(2)} hectares
              </p>
              <p className="text-blue-800">
                <strong>Setores Comparados:</strong> {results.sectors.length}
              </p>
              <p className="text-blue-800">
                <strong>Índice de Sustentabilidade:</strong> (Benefício ÷ Custo Ambiental) × Fator Conformidade
              </p>
            </div>
            <div>
              <p className="text-blue-800">
                <strong>Reserva Legal (Amazônia):</strong> {(results.area * 0.8).toFixed(2)} ha (80%)
              </p>
              <p className="text-blue-800">
                <strong>Limite NDC:</strong> 5.000 tCO₂/ano
              </p>
              <p className="text-blue-800">
                <strong>Fator Conformidade:</strong> 1.0 (conforme) ou 0.5 (viola)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
