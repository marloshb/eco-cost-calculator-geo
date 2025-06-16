
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface ComparisonChartsProps {
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

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

export const ComparisonCharts = ({ results }: ComparisonChartsProps) => {
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
      extracao_madeira: 'Ext. Madeira',
      mineracao: 'Mineração',
      rodovia: 'Rodovias',
      construcao: 'Construção',
      industria: 'Indústria',
      conservacao: 'Conservação'
    };
    return names[code] || code;
  };

  const chartData = results.sectors.map((sector, index) => ({
    name: getSectorName(sector.sector),
    perdas: sector.totalLoss,
    beneficios: sector.economicBenefit,
    liquido: sector.netBenefit,
    oportunidades: sector.totalOpportunities,
    emissoes: sector.co2Emissions,
    color: COLORS[index % COLORS.length]
  }));

  const emissionsData = results.sectors.map((sector, index) => ({
    name: getSectorName(sector.sector),
    value: sector.co2Emissions,
    color: COLORS[index % COLORS.length]
  }));

  const chartConfig = {
    perdas: {
      label: "Perdas Ambientais (R$/ano)",
      color: "#ef4444",
    },
    beneficios: {
      label: "Benefícios Econômicos (R$/ano)",
      color: "#22c55e",
    },
    liquido: {
      label: "Benefício Líquido (R$/ano)",
      color: "#3b82f6",
    },
    oportunidades: {
      label: "Oportunidades (R$/ano)",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Barras - Comparação Financeira */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Comparação Financeira por Setor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: string) => [
                    formatCurrency(value),
                    name === 'perdas' ? 'Perdas Ambientais' :
                    name === 'beneficios' ? 'Benefícios Econômicos' :
                    name === 'liquido' ? 'Benefício Líquido' :
                    'Oportunidades'
                  ]}
                />
                <Bar dataKey="perdas" fill="#ef4444" name="Perdas" />
                <Bar dataKey="beneficios" fill="#22c55e" name="Benefícios" />
                <Bar dataKey="liquido" fill="#3b82f6" name="Líquido" />
                <Bar dataKey="oportunidades" fill="#8b5cf6" name="Oportunidades" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Emissões de CO2 */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Distribuição de Emissões de CO₂
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emissionsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()} tCO₂`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {emissionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                formatter={(value: any) => [`${value.toLocaleString()} tCO₂`, 'Emissões']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras Horizontais - Benefício Líquido */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Ranking de Benefício Líquido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData
              .sort((a, b) => b.liquido - a.liquido)
              .map((sector, index) => (
                <div key={sector.name} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{sector.name}</span>
                      <span className={`text-sm font-bold ${
                        sector.liquido >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(sector.liquido)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          sector.liquido >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.abs(sector.liquido) / Math.max(...chartData.map(d => Math.abs(d.liquido))) * 100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
