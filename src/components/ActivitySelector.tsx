
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Factory, Calculator, AlertTriangle } from 'lucide-react';

interface ActivitySelectorProps {
  onActivitySelected: (activity: string) => void;
  onCalculate: () => void;
  disabled: boolean;
}

const CNAE_ACTIVITIES = [
  {
    code: 'agricultura',
    name: 'Cultivo de Cereais (CNAE 01.11-3)',
    description: 'Cultivo de soja, milho e outros cereais',
    impacts: ['Desmatamento', 'Erosão do solo', 'Uso de agroquímicos'],
    severity: 'alta'
  },
  {
    code: 'pecuaria',
    name: 'Criação de Bovinos (CNAE 01.51-2)',
    description: 'Criação de gado para corte e leite',
    impacts: ['Desmatamento para pastagem', 'Emissões de metano'],
    severity: 'alta'
  },
  {
    code: 'extracao_madeira',
    name: 'Extração de Madeira (CNAE 02.10-8)',
    description: 'Silvicultura e extração madeireira',
    impacts: ['Perda de biodiversidade', 'Redução de carbono'],
    severity: 'muito_alta'
  },
  {
    code: 'mineracao',
    name: 'Extração de Minério (CNAE 07.10-3)',
    description: 'Extração de minério de ferro e outros',
    impacts: ['Degradação de solos', 'Poluição de rios'],
    severity: 'muito_alta'
  },
  {
    code: 'rodovia',
    name: 'Construção de Rodovias (CNAE 42.11-1)',
    description: 'Construção de infraestrutura viária',
    impacts: ['Fragmentação de habitats', 'Desmatamento'],
    severity: 'media'
  },
  {
    code: 'construcao',
    name: 'Construção Civil (CNAE 41.20-4)',
    description: 'Construção de edifícios e infraestrutura',
    impacts: ['Impermeabilização do solo', 'Poluição'],
    severity: 'media'
  },
  {
    code: 'industria',
    name: 'Indústria Química (CNAE 19.10-7)',
    description: 'Fabricação de produtos químicos',
    impacts: ['Poluição hídrica', 'Emissões atmosféricas'],
    severity: 'alta'
  },
  {
    code: 'turismo_predatorio',
    name: 'Turismo Não Sustentável (CNAE 79.11-2)',
    description: 'Turismo predatório em áreas naturais',
    impacts: ['Degradação de ecossistemas', 'Poluição'],
    severity: 'media'
  }
];

export const ActivitySelector = ({ onActivitySelected, onCalculate, disabled }: ActivitySelectorProps) => {
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedActivityData, setSelectedActivityData] = useState<any>(null);

  const handleActivityChange = (value: string) => {
    setSelectedActivity(value);
    const activityData = CNAE_ACTIVITIES.find(a => a.code === value);
    setSelectedActivityData(activityData);
    onActivitySelected(value);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'muito_alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'muito_alta': return 'Impacto Muito Alto';
      case 'alta': return 'Impacto Alto';
      case 'media': return 'Impacto Médio';
      default: return 'Impacto Baixo';
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory className="h-5 w-5 text-earth-600" />
          Atividade Econômica (CNAE)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecione a atividade antrópica:</label>
          <Select onValueChange={handleActivityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma atividade do CNAE..." />
            </SelectTrigger>
            <SelectContent>
              {CNAE_ACTIVITIES.map((activity) => (
                <SelectItem key={activity.code} value={activity.code}>
                  {activity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedActivityData && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{selectedActivityData.name}</h4>
              <Badge className={getSeverityColor(selectedActivityData.severity)}>
                {getSeverityText(selectedActivityData.severity)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {selectedActivityData.description}
            </p>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Principais Impactos Ambientais:
              </label>
              <div className="flex flex-wrap gap-1">
                {selectedActivityData.impacts.map((impact: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {impact}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={onCalculate} 
          disabled={disabled}
          className="w-full bg-gradient-eco hover:opacity-90 transition-opacity"
          size="lg"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calcular Custos Ambientais
        </Button>
        
        {disabled && (
          <p className="text-xs text-muted-foreground text-center">
            Defina uma área e selecione uma atividade para calcular
          </p>
        )}
      </CardContent>
    </Card>
  );
};
