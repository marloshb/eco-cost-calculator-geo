
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CalculationResultsProps {
  results: {
    totalLoss: number;
    impactedServices: string[];
    compliance: {
      codigoFlorestal: string;
      emissoes: string;
      mercadoCarbono: string;
    };
    area: number;
    activity: string;
    co2Emissions: number;
  };
}

export const CalculationResults = ({ results }: CalculationResultsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getComplianceIcon = (status: string) => {
    if (status.includes('Conforme')) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getComplianceColor = (status: string) => {
    if (status.includes('Conforme')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const impactPerHectare = results.totalLoss / results.area;
  const maxImpactPerHa = 2000; // R$ 2000/ha as reference
  const impactPercentage = Math.min((impactPerHectare / maxImpactPerHa) * 100, 100);

  const serviceTranslations: { [key: string]: string } = {
    carbono: 'Sequestro de Carbono',
    agua: 'Purificação de Água',
    biodiversidade: 'Conservação da Biodiversidade',
    erosao: 'Controle de Erosão',
    polinizacao: 'Polinização',
    enchentes: 'Regulação de Enchentes',
    solo: 'Formação de Solo'
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-600" />
          Resultados do Cálculo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Loss Section */}
        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {formatCurrency(results.totalLoss)}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Custo anual estimado das perdas ambientais
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Impacto por hectare:</span>
              <span className="font-medium">{formatCurrency(impactPerHectare)}/ha/ano</span>
            </div>
            <Progress value={impactPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {impactPercentage.toFixed(1)}% do impacto máximo de referência
            </p>
          </div>
        </div>

        {/* Impacted Services */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            Serviços Ecossistêmicos Impactados
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {results.impactedServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-sm font-medium">
                  {serviceTranslations[service] || service}
                </span>
                <Badge variant="outline" className="text-orange-800 border-orange-300">
                  Impactado
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Analysis */}
        <div className="space-y-3">
          <h4 className="font-medium">Análise de Conformidade</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {getComplianceIcon(results.compliance.codigoFlorestal)}
                <span className="text-sm">Código Florestal</span>
              </div>
              <Badge className={getComplianceColor(results.compliance.codigoFlorestal)}>
                {results.compliance.codigoFlorestal}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {getComplianceIcon(results.compliance.emissoes)}
                <span className="text-sm">Metas de Emissões (NDC)</span>
              </div>
              <Badge className={getComplianceColor(results.compliance.emissoes)}>
                {results.compliance.emissoes}
              </Badge>
            </div>
          </div>
        </div>

        {/* Emissions Info */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h5 className="font-medium text-sm mb-2">Informações de Emissões</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">CO₂ Estimado:</span>
              <p className="font-medium">{results.co2Emissions.toLocaleString()} tCO₂</p>
            </div>
            <div>
              <span className="text-muted-foreground">Área Total:</span>
              <p className="font-medium">{results.area.toFixed(2)} hectares</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
