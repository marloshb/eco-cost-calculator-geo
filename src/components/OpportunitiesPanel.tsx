import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TreePine, Droplets, Camera, TrendingUp, ExternalLink, FileText, Download } from 'lucide-react';
import { reportGenerator } from './ReportGenerator';
import { useState } from 'react';

interface OpportunitiesPanelProps {
  opportunities: {
    redd: number;
    psa: number;
    ecoturismo: number;
    carbonCredits: number;
  };
  results?: {
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
  coordinates?: [number, number][];
}

export const OpportunitiesPanel = ({ opportunities, results, coordinates = [] }: OpportunitiesPanelProps) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleGenerateReport = async () => {
    if (!results) {
      alert('Nenhum resultado disponível para gerar relatório');
      return;
    }

    setIsGeneratingReport(true);
    try {
      const reportData = {
        area: results.area,
        activity: results.activity,
        totalLoss: results.totalLoss,
        impactedServices: results.impactedServices,
        compliance: results.compliance,
        co2Emissions: results.co2Emissions,
        opportunities,
        coordinates
      };

      await reportGenerator.generateReport(reportData);
      console.log('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const opportunityData = [
    {
      id: 'redd',
      title: 'REDD+ / Créditos de Carbono',
      description: 'Monetização através da conservação florestal e venda de créditos de carbono',
      value: opportunities.redd,
      icon: TreePine,
      color: 'text-forest-600',
      bgColor: 'bg-forest-100',
      badge: 'Alto Potencial',
      badgeColor: 'bg-green-100 text-green-800',
      links: [
        { name: 'Verra Registry', url: 'https://verra.org' },
        { name: 'Gold Standard', url: 'https://goldstandard.org' }
      ]
    },
    {
      id: 'psa',
      title: 'Pagamento por Serviços Ambientais (PSA)',
      description: 'Remuneração por conservação de água, biodiversidade e outros serviços',
      value: opportunities.psa,
      icon: Droplets,
      color: 'text-ocean-600',
      bgColor: 'bg-ocean-100',
      badge: 'Médio Potencial',
      badgeColor: 'bg-blue-100 text-blue-800',
      links: [
        { name: 'Programa Bolsa Verde', url: '#' },
        { name: 'Conservador da Mantiqueira', url: '#' }
      ]
    },
    {
      id: 'ecoturismo',
      title: 'Ecoturismo Sustentável',
      description: 'Desenvolvimento de turismo ecológico responsável em áreas conservadas',
      value: opportunities.ecoturismo,
      icon: Camera,
      color: 'text-earth-600',
      bgColor: 'bg-earth-100',
      badge: 'Longo Prazo',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      links: [
        { name: 'ICMBio Turismo', url: '#' },
        { name: 'Cadastur', url: '#' }
      ]
    },
    {
      id: 'green_etfs',
      title: 'Green ETFs e Títulos Verdes',
      description: 'Investimento em fundos sustentáveis e títulos verdes',
      value: 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      badge: 'Investimento',
      badgeColor: 'bg-purple-100 text-purple-800',
      links: [
        { name: 'B3 ESG', url: 'https://www.b3.com.br' },
        { name: 'BNDES Títulos Verdes', url: '#' }
      ]
    }
  ];

  const totalOpportunities = opportunities.redd + opportunities.psa + opportunities.ecoturismo;

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-forest-600" />
          Oportunidades de Comercialização
        </CardTitle>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
          <div className="text-2xl font-bold text-forest-600 mb-1">
            {formatCurrency(totalOpportunities)}
          </div>
          <p className="text-sm text-muted-foreground">
            Potencial de receita anual com ativos ambientais
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunityData.map((opportunity) => (
          <div key={opportunity.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${opportunity.bgColor}`}>
                  <opportunity.icon className={`h-5 w-5 ${opportunity.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{opportunity.title}</h4>
                  <Badge className={opportunity.badgeColor} variant="secondary">
                    {opportunity.badge}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {opportunity.value > 0 ? formatCurrency(opportunity.value) : 'Variável'}
                </p>
                <p className="text-xs text-muted-foreground">por ano</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {opportunity.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {opportunity.links.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (link.url !== '#') {
                      window.open(link.url, '_blank');
                    }
                  }}
                >
                  {link.name}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Compare os custos de perdas com as oportunidades de receita para tomar decisões sustentáveis
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={handleGenerateReport}
                disabled={isGeneratingReport || !results}
                className="w-full bg-gradient-eco hover:opacity-90"
              >
                {isGeneratingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando Relatório...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Relatório Completo (PDF)
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={!results}
                onClick={() => {
                  if (results) {
                    const summary = `Análise Ambiental - Área: ${results.area.toFixed(2)}ha | Atividade: ${results.activity} | Perdas: ${formatCurrency(results.totalLoss)}/ano | Oportunidades: ${formatCurrency(totalOpportunities)}/ano`;
                    navigator.clipboard.writeText(summary);
                    alert('Resumo copiado para a área de transferência!');
                  }
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Copiar Resumo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
