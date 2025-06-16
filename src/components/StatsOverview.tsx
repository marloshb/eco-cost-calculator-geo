
import { Card, CardContent } from '@/components/ui/card';
import { TreePine, MapPin, Activity, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  totalArea: number;
  selectedActivity: string;
  results: any;
}

export const StatsOverview = ({ totalArea, selectedActivity, results }: StatsOverviewProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const stats = [
    {
      title: 'Área Selecionada',
      value: totalArea > 0 ? `${totalArea.toFixed(2)} ha` : 'Não definida',
      icon: MapPin,
      color: 'text-ocean-600',
      bgColor: 'bg-ocean-100'
    },
    {
      title: 'Atividade CNAE',
      value: selectedActivity ? selectedActivity.replace('_', ' ').toUpperCase() : 'Não selecionada',
      icon: Activity,
      color: 'text-earth-600',
      bgColor: 'bg-earth-100'
    },
    {
      title: 'Perda Estimada/Ano',
      value: results ? formatCurrency(results.totalLoss) : 'Calcular',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Oportunidade REDD+',
      value: results ? formatCurrency(results.opportunities.redd) : 'Calcular',
      icon: TreePine,
      color: 'text-forest-600',
      bgColor: 'bg-forest-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
