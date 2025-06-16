
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Factory, AlertTriangle } from 'lucide-react';

interface SectorSelectorProps {
  onSectorsSelected: (sectors: string[]) => void;
  onCompare: () => void;
  disabled: boolean;
  selectedSectors: string[];
}

const SECTORS = [
  {
    code: 'agricultura',
    name: 'Agricultura (CNAE 01.11-3)',
    description: 'Cultivo de cereais (soja, milho)',
    impacts: ['Desmatamento', 'Erosão do solo', 'Uso de agroquímicos'],
    severity: 'alta',
    economicReturn: 'R$ 2.000/ha/ano'
  },
  {
    code: 'pecuaria',
    name: 'Pecuária (CNAE 01.51-2)',
    description: 'Criação de bovinos para corte e leite',
    impacts: ['Desmatamento para pastagem', 'Emissões de metano'],
    severity: 'alta',
    economicReturn: 'R$ 1.600/ha/ano'
  },
  {
    code: 'extracao_madeira',
    name: 'Extração de Madeira (CNAE 02.10-8)',
    description: 'Silvicultura e extração madeireira',
    impacts: ['Perda de biodiversidade', 'Redução de carbono'],
    severity: 'muito_alta',
    economicReturn: 'R$ 1.200/ha/ano'
  },
  {
    code: 'mineracao',
    name: 'Mineração (CNAE 07.10-3)',
    description: 'Extração de minério de ferro',
    impacts: ['Degradação de solos', 'Poluição de rios'],
    severity: 'muito_alta',
    economicReturn: 'R$ 3.000/ha/ano'
  },
  {
    code: 'rodovia',
    name: 'Construção de Rodovias (CNAE 42.11-1)',
    description: 'Construção de infraestrutura viária',
    impacts: ['Fragmentação de habitats', 'Desmatamento'],
    severity: 'media',
    economicReturn: 'R$ 500/ha/ano'
  },
  {
    code: 'construcao',
    name: 'Construção Civil (CNAE 41.20-4)',
    description: 'Construção de edifícios e infraestrutura',
    impacts: ['Impermeabilização do solo', 'Poluição'],
    severity: 'media',
    economicReturn: 'R$ 800/ha/ano'
  },
  {
    code: 'industria',
    name: 'Indústria Química (CNAE 19.10-7)',
    description: 'Fabricação de produtos químicos',
    impacts: ['Poluição hídrica', 'Emissões atmosféricas'],
    severity: 'alta',
    economicReturn: 'R$ 2.500/ha/ano'
  },
  {
    code: 'conservacao',
    name: 'Conservação Ambiental',
    description: 'Preservação e manejo sustentável',
    impacts: ['Manutenção dos serviços ecossistêmicos'],
    severity: 'baixa',
    economicReturn: 'R$ 800/ha/ano (REDD+ + PSA)'
  }
];

export const SectorSelector = ({ onSectorsSelected, onCompare, disabled, selectedSectors }: SectorSelectorProps) => {
  const handleSectorChange = (sectorCode: string, checked: boolean) => {
    let newSelection: string[];
    if (checked) {
      newSelection = [...selectedSectors, sectorCode];
    } else {
      newSelection = selectedSectors.filter(s => s !== sectorCode);
    }
    onSectorsSelected(newSelection);
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

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory className="h-5 w-5 text-earth-600" />
          Seleção de Setores para Comparação
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecione pelo menos 2 setores para comparar (mínimo recomendado: 2, máximo: 4)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {SECTORS.map((sector) => (
            <div key={sector.code} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
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
                
                <div className="text-xs font-medium text-green-600">
                  Retorno Econômico: {sector.economicReturn}
                </div>
                
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
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Setores selecionados: {selectedSectors.length}/4
          </div>
          
          <Button 
            onClick={onCompare} 
            disabled={disabled}
            className="w-full bg-gradient-eco hover:opacity-90 transition-opacity"
            size="lg"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparar Setores Selecionados
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
