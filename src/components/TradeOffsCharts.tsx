
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar } from 'recharts';
import { Scale, Target, TrendingUp, Award } from 'lucide-react';

interface TradeOffsChartsProps {
  results: {
    sectors: Array<{
      sector: string;
      area: number;
      environmentalCost: number;
      economicBenefit: number;
      netBenefit: number;
      sustainabilityIndex: number;
      impactedServices: string[];
      compliance: any;
      complianceFactor: number;
      co2Emissions: number;
      opportunities: any;
      totalOpportunities: number;
      costBenefitRatio: number;
      benefitPerHa: number;
    }>;
    area: number;
  };
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

export const TradeOffsCharts = ({ results }: TradeOffsChartsProps) => {
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
    custoAmbiental: sector.environmentalCost,
    beneficioEconomico: sector.economicBenefit,
    beneficioLiquido: sector.netBenefit,
    indiceSustentabilidade: sector.sustainabilityIndex > 1000 ? 1000 : sector.sustainabilityIndex, // Cap for visualization
    emissoes: sector.co2Emissions,
    razaoCustoBeneficio: sector.costBenefitRatio > 10 ? 10 : sector.costBenefitRatio, // Cap for visualization
    color: COLORS[index % COLORS.length],
    beneficioPorHa: sector.benefitPerHa
  }));

  // Data for scatter plot (Trade-offs visualization)
  const scatterData = results.sectors.map((sector, index) => ({
    x: sector.environmentalCost,
    y: sector.economicBenefit,
    z: sector.sustainabilityIndex > 100 ? 100 : sector.sustainabilityIndex, // Size based on sustainability
    name: getSectorName(sector.sector),
    color: COLORS[index % COLORS.length]
  }));

  // Data for sustainability index radial chart
  const sustainabilityData = results.sectors.map((sector, index) => ({
    name: getSectorName(sector.sector),
    value: sector.sustainabilityIndex > 5 ? 5 : sector.sustainabilityIndex, // Cap at 5 for better visualization
    fill: COLORS[index % COLORS.length]
  }));

  const chartConfig = {
    custoAmbiental: {
      label: "Custo Ambiental (R$/ano)",
      color: "#ef4444",
    },
    beneficioEconomico: {
      label: "Benefício Econômico (R$/ano)",
      color: "#22c55e",
    },
    beneficioLiquido: {
      label: "Benefício Líquido (R$/ano)",
      color: "#3b82f6",
    },
    indiceSustentabilidade: {
      label: "Índice de Sustentabilidade",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6">
      {/* Trade-offs Matrix - Scatter Plot */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            Matriz de Trade-offs: Custo Ambiental × Benefício Econômico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x"
                name="Custo Ambiental"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                dataKey="y"
                name="Benefício Econômico"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-red-600">Custo: {formatCurrency(data.x)}</p>
                        <p className="text-green-600">Benefício: {formatCurrency(data.y)}</p>
                        <p className="text-purple-600">Sustentabilidade: {data.z.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={scatterData} fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Setores no canto superior esquerdo têm melhor trade-off (baixo custo ambiental, alto benefício econômico)
          </p>
        </CardContent>
      </Card>

      {/* Sustainability Index Radial Chart */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Índice de Sustentabilidade por Setor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={sustainabilityData}>
              <RadialBar 
                dataKey="value" 
                cornerRadius={10} 
                fill="#8884d8"
                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
              />
              <Legend />
              <ChartTooltip 
                formatter={(value: any, name: string) => [
                  value === 5 ? '5+' : value.toFixed(2),
                  'Índice de Sustentabilidade'
                ]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Índice = (Benefício Econômico ÷ Custo Ambiental) × Fator de Conformidade
          </p>
        </CardContent>
      </Card>

      {/* Comparative Bar Chart */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Comparação Custo-Benefício
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
                    name === 'custoAmbiental' ? 'Custo Ambiental' :
                    name === 'beneficioEconomico' ? 'Benefício Econômico' :
                    'Benefício Líquido'
                  ]}
                />
                <Bar dataKey="custoAmbiental" fill="#ef4444" name="Custo Ambiental" />
                <Bar dataKey="beneficioEconomico" fill="#22c55e" name="Benefício Econômico" />
                <Bar dataKey="beneficioLiquido" fill="#3b82f6" name="Benefício Líquido" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Trade-offs Summary */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Ranking de Eficiência Sustentável
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData
              .sort((a, b) => {
                // Sort by sustainability index, then by net benefit
                if (a.indiceSustentabilidade !== b.indiceSustentabilidade) {
                  return b.indiceSustentabilidade - a.indiceSustentabilidade;
                }
                return b.beneficioLiquido - a.beneficioLiquido;
              })
              .map((sector, index) => (
                <div key={sector.name} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{sector.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-purple-600">
                          Sustentabilidade: {sector.indiceSustentabilidade >= 1000 ? '∞' : sector.indiceSustentabilidade.toFixed(2)}
                        </span>
                        <div className={`text-xs ${
                          sector.beneficioLiquido >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Líquido: {formatCurrency(sector.beneficioLiquido)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{
                          width: `${Math.min(
                            (sector.indiceSustentabilidade / Math.max(...chartData.map(d => d.indiceSustentabilidade))) * 100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      R$ {sector.beneficioPorHa.toFixed(0)}/ha/ano
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
