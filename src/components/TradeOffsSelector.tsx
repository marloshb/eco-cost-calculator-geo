
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface TradeOffsSelectorProps {
  onSectorsSelected: (sectors: string[], benefits: {[key: string]: number}) => void;
  onAnalyze: () => void;
  disabled: boolean;
  selectedSectors: string[];
  selectedArea: number;
}

const SECTORS = [
  {
    code: 'agricultura',
    name: 'Agricultura (CNAE 01.11-3)',
    description: 'Cultivo de cereais (soja, milho)',
    impacts: ['Desmatamento', 'Erosão do solo', 'Uso de agroquímicos'],
    severity: 'alta',
    defaultBenefit: 2000,
    allowCustomBenefit: true
  },
  {
    code: 'pecuaria',
    name: 'Pecuária (CNAE 01.51-2)',
    description: 'Criação de bovinos para corte e leite',
    impacts: ['Desmatamento para pastagem', 'Emissões de metano'],
    severity: 'alta',
    defaultBenefit: 1600,
    allowCustomBenefit: true
  },
  {
    code: 'extracao_madeira',
    name: 'Extração de Madeira (CNAE 02.10-8)',
    description: 'Silvicultura e extração madeireira',
    impacts: ['Perda de biodiversidade', 'Redução de carbono'],
    severity: 'muito_alta',
    defaultBenefit: 1200,
    allowCustomBenefit: true
  },
  {
    code: 'mineracao',
    name: 'Mineração (CNAE 07.10-3)',
    description: 'Extração de minério de ferro',
    impacts: ['Degradação de solos', 'Poluição de rios'],
    severity: 'muito_alta',
    defaultBenefit: 3000,
    allowCustomBenefit: true
  },
  {
    code: 'rodovia',
    name: 'Construção de Rodovias (CNAE 42.11-1)',
    description: 'Construção de infraestrutura viária',
    impacts: ['Fragmentação de habitats', 'Desmatamento'],
    severity: 'media',
    defaultBenefit: 500,
    allowCustomBenefit: true
  },
  {
    code: 'conservacao',
    name: 'Conservação Ambiental',
    description: 'Preservação e manejo sustentável',
    impacts: ['Manutenção dos serviços ecossistêmicos'],
    severity: 'baixa',
    defaultBenefit: 800,
    allowCustomBenefit: false
  }
];

export const TradeOffsSelector = ({ onSectorsSelected, onAnalyze, disabled, selectedSectors, selectedArea }: TradeOffsSelectorProps) => {
  const [economicBenefits, setEconomicBenefits] = useState<{[key: string]: number}>({});

  const handleSectorChange = (sectorCode: string, checked: boolean) => {
    let newSelection: string[];
    let newBenefits = { ...economicBenefits };

    if (checked) {
      newSelection = [...selectedSectors, sectorCode];
      // Set default benefit for new sector
      const sector = SECTORS.find(s => s.code === sectorCode);
      if (sector) {
        newBenefits[sectorCode] = sector.defaultBenefit * selectedArea;
      }
    } else {
      newSelection = selectedSectors.filter(s => s !== sectorCode);
      delete newBenefits[sectorCode];
    }

    setEconomicBenefits(newBenefits);
    onSectorsSelected(newSelection, newBenefits);
  };

  const handleBenefitChange = (sectorCode: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newBenefits = { ...economicBenefits, [sectorCode]: numValue };
    setEconomicBenefits(newBenefits);
    onSectorsSelected(selectedSectors, newBenefits);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'muito_alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'muito_alta': return 'Impacto Muito Alto';
      case 'alta': return 'Impacto Alto';
      case 'media': return 'Impacto Médio';
      case 'baixa': return 'Impacto Baixo';
      default: return 'Impacto Baixo';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-earth-600" />
          Seleção de Setores e Benefícios Econômicos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecione setores e defina os benefícios econômicos esperados para análise de trade-offs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {SECTORS.map((sector) => (
            <div key={sector.code} className="flex flex-col space-y-3 p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={sector.code}
                  checked={selectedSectors.includes(sector.code)}
                  onCheckedChange={(checked) => handleSectorChange(sector.code, checked as boolean)}
                  disabled={!selectedSectors.includes(sector.code) && selectedSectors.length >= 4}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor={sector.code} className="text-sm font-medium cursor-pointer">
                      {sector.name}
                    </label>
                    <Badge className={getSeverityColor(sector.severity)}>
                      {getSeverityText(sector.severity)}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {sector.description}
                  </p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Principais Impactos:
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {sector.impacts.map((impact: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {impact}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedSectors.includes(sector.code) && (
                <div className="ml-8 space-y-2">
                  <Label className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Benefício Econômico Anual Total
                  </Label>
                  {sector.allowCustomBenefit ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">R$</span>
                      <Input
                        type="number"
                        value={economicBenefits[sector.code] || 0}
                        onChange={(e) => handleBenefitChange(sector.code, e.target.value)}
                        className="flex-1 text-sm"
                        placeholder="Digite o valor anual"
                      />
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency((sector.defaultBenefit * selectedArea) || 0)}
                      <span className="text-xs text-muted-foreground ml-1">
                        (REDD+ + PSA + Ecoturismo)
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Padrão: R$ {sector.defaultBenefit}/ha/ano × {selectedArea.toFixed(0)} ha = {formatCurrency(sector.defaultBenefit * selectedArea)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Setores selecionados: {selectedSectors.length}/4
          </div>
          
          <Button 
            onClick={onAnalyze} 
            disabled={disabled}
            className="w-full bg-gradient-eco hover:opacity-90 transition-opacity"
            size="lg"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analisar Trade-offs
          </Button>
          
          {disabled && (
            <p className="text-xs text-muted-foreground text-center">
              {!selectedSectors.length || selectedSectors.length < 2 
                ? 'Selecione pelo menos 2 setores para comparar'
                : 'Defina uma área no mapa para continuar'
              }
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
