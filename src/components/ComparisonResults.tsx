
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface ComparisonResultsProps {
  results: {
    sectors: Array<{
      sector: string;
      area: number;
      totalLoss: number;
      economicBenefit: number;
      netBenefit: number;
      impactedServices: string[];
      compliance: {
        codigoFlorestal: string;
        emissoes: string;
        mercadoCarbono: string;
      };
      co2Emissions: number;
      opportunities: any;
      totalOpportunities: number;
      costBenefitRatio: number;
    }>;
    area: number;
  };
}

export const ComparisonResults = ({ results }: ComparisonResultsProps) => {
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

  const bestSector = results.sectors.reduce((best, current) => 
    current.netBenefit > best.netBenefit ? current : best
  );

  const worstSector = results.sectors.reduce((worst, current) => 
    current.totalLoss > worst.totalLoss ? current : worst
  );

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-forest-600" />
          Resultados da Comparação
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium">Melhor Opção</span>
            </div>
            <p className="text-green-700">{getSectorName(bestSector.sector)}</p>
            <p className="text-xs text-green-600">
              Benefício Líquido: {formatCurrency(bestSector.netBenefit)}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="font-medium">Maior Impacto</span>
            </div>
            <p className="text-red-700">{getSectorName(worstSector.sector)}</p>
            <p className="text-xs text-red-600">
              Perdas: {formatCurrency(worstSector.totalLoss)}
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
                <TableHead>Perdas Ambientais</TableHead>
                <TableHead>Benefício Econômico</TableHead>
                <TableHead>Benefício Líquido</TableHead>
                <TableHead>Conformidade</TableHead>
                <TableHead>Oportunidades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.sectors.map((sector) => (
                <TableRow key={sector.sector}>
                  <TableCell className="font-medium">
                    {getSectorName(sector.sector)}
                  </TableCell>
                  <TableCell>
                    <span className="text-red-600 font-medium">
                      {formatCurrency(sector.totalLoss)}/ano
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
                      Razão: {sector.costBenefitRatio === Infinity ? '∞' : sector.costBenefitRatio.toFixed(2)}
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600 font-medium">
                      {formatCurrency(sector.totalOpportunities)}/ano
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {sector.sector === 'conservacao' ? 'REDD+ + PSA + Eco' : 'Green ETFs'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Análise Resumo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <strong>Área Analisada:</strong> {results.area.toFixed(2)} hectares
              </p>
              <p className="text-blue-800">
                <strong>Setores Comparados:</strong> {results.sectors.length}
              </p>
            </div>
            <div>
              <p className="text-blue-800">
                <strong>Reserva Legal Mínima (Amazônia):</strong> {(results.area * 0.8).toFixed(2)} ha
              </p>
              <p className="text-blue-800">
                <strong>Limite Emissões NDC:</strong> 5.000 tCO₂/ano
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
